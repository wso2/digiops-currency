// Copyright (c) 2026, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

const PEOPLE_WALLET_PAYMENT_STATUS_KEY = "people_parking_payment_status";
const PEOPLE_WALLET_PAYMENT_TX_HASH_KEY = "people_parking_payment_tx_hash";
const PEOPLE_WALLET_PAYMENT_ERROR_KEY = "people_parking_payment_error";
const DEFAULT_RETURN_APP_ID = "com.wso2.superapp.microapp.people";

const parseHashQuery = () => {
  const hash = window.location?.hash || "";
  const queryIndex = hash.indexOf("?");
  if (queryIndex === -1) {
    return {};
  }
  const params = new URLSearchParams(hash.slice(queryIndex + 1));
  return Object.fromEntries(params.entries());
};

const parseSearchQuery = () => {
  const params = new URLSearchParams(window.location?.search || "");
  return Object.fromEntries(params.entries());
};

const getWindowLaunchData = () => {
  const candidates = [
    window?.nativebridge?.launchData,
    window?.__MICROAPP_LAUNCH_DATA__,
    window?.microappLaunchData,
    window?.launchData
  ];

  return candidates.find((candidate) => candidate && typeof candidate === "object") || {};
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
  const amount = Number(normalized.coin_amount);
  const validAmount = Number.isFinite(amount) && amount > 0;
  const validWallet = typeof normalized.wallet_address === "string" && normalized.wallet_address.startsWith("0x");

  if (!validAmount || !validWallet) {
    return null;
  }

  return {
    walletAddress: normalized.wallet_address,
    amount: String(normalized.coin_amount),
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
