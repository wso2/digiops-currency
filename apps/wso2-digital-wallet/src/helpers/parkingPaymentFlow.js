// Copyright (c) 2026, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { isAddress } from "ethereum-address";

const PEOPLE_WALLET_PAYMENT_STATUS_KEY = "people_parking_payment_status";
const PEOPLE_WALLET_PAYMENT_TX_HASH_KEY = "people_parking_payment_tx_hash";
const PEOPLE_WALLET_PAYMENT_ERROR_KEY = "people_parking_payment_error";
const DEFAULT_RETURN_APP_ID = "com.wso2.superapp.microapp.people";
const LAUNCH_DATA_CONSUMED_FLAG = "__parkingLaunchDataConsumed";
const CANONICAL_POSITIVE_DECIMAL_PATTERN = /^(?:0|[1-9]\d*)(?:\.\d+)?$/;

const parseHashQuery = () => {
  const hash = window.location?.hash || "";
  const queryIndex = hash.indexOf("?");
  if (queryIndex === -1) return {}
  const params = new URLSearchParams(hash.slice(queryIndex + 1));
  return Object.fromEntries(params.entries());
};

const parseSearchQuery = () => {
  const params = new URLSearchParams(window.location?.search || "");
  return Object.fromEntries(params.entries());
};

const getWindowLaunchData = () => {
  const candidates = [
    { owner: window?.nativebridge, key: "launchData" },
    { owner: window, key: "__MICROAPP_LAUNCH_DATA__" },
    { owner: window, key: "microappLaunchData" },
    { owner: window, key: "launchData" }
  ];

  for (const candidateRef of candidates) {
    const candidate = candidateRef?.owner?.[candidateRef?.key];
    if (!candidate || typeof candidate !== "object") continue;
    if (candidate[LAUNCH_DATA_CONSUMED_FLAG]) continue;

    const payload = { ...candidate };
    candidate[LAUNCH_DATA_CONSUMED_FLAG] = true;

    try {
      delete candidateRef.owner[candidateRef.key];
    } catch (error) {
      // Best effort cleanup for immutable/native-injected objects.
    }

    return payload;
  }

  return {};
};

const normalizeLaunchData = (launchData = {}) => {
  return {
    wallet_address: launchData.wallet_address || launchData.walletAddress || "",
    coin_amount: launchData.coin_amount || launchData.coinAmount || "",
    source_app_id: launchData.source_app_id || launchData.sourceAppId || "",
    return_app_id: launchData.return_app_id || launchData.returnAppId || "",
    return_route: launchData.return_route || launchData.returnRoute || ""
  };
};

export const getParkingPaymentLaunchData = () => {
  const launchData = {
    ...parseSearchQuery(),
    ...parseHashQuery(),
    ...getWindowLaunchData()
  };

  const normalized = normalizeLaunchData(launchData);
  const amountString = String(normalized.coin_amount).trim();
  const validAmountFormat = CANONICAL_POSITIVE_DECIMAL_PATTERN.test(amountString);
  const parsedAmount = Number(amountString);
  const validAmount =
    validAmountFormat && Number.isFinite(parsedAmount) && parsedAmount > 0;
  const validWallet =
    typeof normalized.wallet_address === "string" &&
    isAddress(normalized.wallet_address);

  if (!validAmount || !validWallet) {
    return null;
  }

  return {
    walletAddress: normalized.wallet_address,
    amount: amountString,
    returnAppId: normalized.return_app_id || normalized.source_app_id || DEFAULT_RETURN_APP_ID,
    returnRoute: normalized.return_route || ""
  };
};

export const isParkingPaymentFlow = () => Boolean(getParkingPaymentLaunchData());

export const completeParkingPayment = async ({
  status,
  txHash = "",
  error = "",
  saveLocalDataAsync,
  requestOpenMicroApp,
  returnAppId,
  returnRoute
}) => {
  await saveLocalDataAsync(PEOPLE_WALLET_PAYMENT_STATUS_KEY, status);
  await saveLocalDataAsync(PEOPLE_WALLET_PAYMENT_TX_HASH_KEY, txHash);
  await saveLocalDataAsync(PEOPLE_WALLET_PAYMENT_ERROR_KEY, error);

  if (typeof requestOpenMicroApp === "function") {
    requestOpenMicroApp(returnAppId || DEFAULT_RETURN_APP_ID, {
      initialRoute: returnRoute || undefined
    });
  }
};
