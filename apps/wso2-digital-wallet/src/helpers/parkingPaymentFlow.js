// Copyright (c) 2026, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { isAddress } from "ethereum-address";
import { requestGetLaunchData } from "../microapp-bridge";

const PEOPLE_WALLET_PAYMENT_STATUS_KEY = "people_parking_payment_status";
const PEOPLE_WALLET_PAYMENT_TX_HASH_KEY = "people_parking_payment_tx_hash";
const PEOPLE_WALLET_PAYMENT_ERROR_KEY = "people_parking_payment_error";
const DEFAULT_RETURN_APP_ID = "com.wso2.superapp.microapp.people";
const LAUNCH_DATA_CONSUMED_FLAG = "__parkingLaunchDataConsumed";
const CANONICAL_POSITIVE_DECIMAL_PATTERN = /^(?:0|[1-9]\d*)(?:\.\d+)?$/;

const HYDRATE_ATTEMPT_TIMEOUT_MS = 2800;
const HYDRATE_RETRY_DELAY_MS = 500;
const HYDRATE_MAX_ATTEMPTS = 3;

let hydrateInFlight = null;

const hasPayloadInMicroappLaunchWindow = () =>
  Object.keys(window.__MICROAPP_LAUNCH_DATA__ || {}).length > 0;

const mergeLaunchPayloadIntoWindow = (raw) => {
  const merged = unwrapLaunchPayload(raw);
  if (!isObjectRecord(merged)) return;
  window.__MICROAPP_LAUNCH_DATA__ = {
    ...(window.__MICROAPP_LAUNCH_DATA__ || {}),
    ...merged,
  };
};

const singleHydrateAttempt = () =>
  new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    try {
      requestGetLaunchData(
        (data) => {
          mergeLaunchPayloadIntoWindow(data);
          finish();
        },
        () => finish(),
      );
    } catch {
      finish();
    }

    setTimeout(finish, HYDRATE_ATTEMPT_TIMEOUT_MS);
  });

/**
 * Fetch launch data from the native bridge into window.__MICROAPP_LAUNCH_DATA__.
 */
export const hydrateParkingLaunchDataFromBridge = async () => {
  if (typeof window === "undefined") return;
  if (hasPayloadInMicroappLaunchWindow()) return;
  if (hydrateInFlight) return hydrateInFlight;

  hydrateInFlight = (async () => {
    try {
      for (let attempt = 0; attempt < HYDRATE_MAX_ATTEMPTS; attempt++) {
        await singleHydrateAttempt();
        if (hasPayloadInMicroappLaunchWindow()) return;
        if (attempt < HYDRATE_MAX_ATTEMPTS - 1) {
          await new Promise((r) => setTimeout(r, HYDRATE_RETRY_DELAY_MS));
        }
      }
    } finally {
      hydrateInFlight = null;
    }
  })();

  return hydrateInFlight;
};

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

const safeParseJson = (value) => {
  if (typeof value !== "string") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const isObjectRecord = (value) =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const unwrapLaunchPayload = (value) => {
  const parsed = safeParseJson(value);
  if (!isObjectRecord(parsed)) {
    return null;
  }

  const directPayload = parsed.launchData;
  if (isObjectRecord(directPayload)) {
    return directPayload;
  }

  const nestedData = parsed.data;
  if (isObjectRecord(nestedData)) {
    if (isObjectRecord(nestedData.launchData)) {
      return nestedData.launchData;
    }
    return nestedData;
  }

  return parsed;
};

const peekWindowLaunchData = () => {
  const candidates = [
    { owner: window?.nativebridge, key: "launchData" },
    { owner: window, key: "__MICROAPP_LAUNCH_DATA__" },
    { owner: window, key: "microappLaunchData" },
    { owner: window, key: "launchData" }
  ];

  for (const candidateRef of candidates) {
    const candidate = unwrapLaunchPayload(candidateRef?.owner?.[candidateRef?.key]);
    if (!candidate) {
      continue;
    }
    if (candidate[LAUNCH_DATA_CONSUMED_FLAG]) {
      continue;
    }
    return { ...candidate };
  }

  return {};
};

const getWindowLaunchData = () => {
  const candidates = [
    { owner: window?.nativebridge, key: "launchData" },
    { owner: window, key: "__MICROAPP_LAUNCH_DATA__" },
    { owner: window, key: "microappLaunchData" },
    { owner: window, key: "launchData" }
  ];

  for (const candidateRef of candidates) {
    const candidate = unwrapLaunchPayload(candidateRef?.owner?.[candidateRef?.key]);
    if (!candidate) {
      continue;
    }
    if (candidate[LAUNCH_DATA_CONSUMED_FLAG]) {
      continue;
    }

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

const validateParkingLaunchMerged = (launchData) => {
  const normalized = normalizeLaunchData(launchData);
  const amountString = String(normalized.coin_amount).trim();
  const validAmountFormat = CANONICAL_POSITIVE_DECIMAL_PATTERN.test(amountString);
  const parsedAmount = Number(amountString);
  const validAmount =
    validAmountFormat && Number.isFinite(parsedAmount) && parsedAmount > 0;
  const validWallet =
    typeof normalized.wallet_address === "string" &&
    isAddress(normalized.wallet_address);
  const appId = String(
    normalized.source_app_id || normalized.return_app_id || "",
  ).trim();
  // Treat source app id as optional, but if present it must match People app.
  const validSource = appId.length === 0 || appId === DEFAULT_RETURN_APP_ID;

  if (!validAmount || !validWallet || !validSource) {
    return null;
  }

  return {
    walletAddress: normalized.wallet_address,
    amount: amountString,
    returnAppId: normalized.return_app_id || normalized.source_app_id || DEFAULT_RETURN_APP_ID,
    returnRoute: normalized.return_route || ""
  };
};

export const peekParkingPaymentLaunchData = () => {
  const launchData = {
    ...parseSearchQuery(),
    ...parseHashQuery(),
    ...peekWindowLaunchData()
  };
  return validateParkingLaunchMerged(launchData);
};

export const getParkingPaymentLaunchData = () => {
  const launchData = {
    ...parseSearchQuery(),
    ...parseHashQuery(),
    ...getWindowLaunchData()
  };
  return validateParkingLaunchMerged(launchData);
};

export const isParkingPaymentFlow = () => Boolean(peekParkingPaymentLaunchData());

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
