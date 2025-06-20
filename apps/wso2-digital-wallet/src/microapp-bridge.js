// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

const TOPIC = {
  TOKEN: "token",
  QR_REQUEST: "qr_request",
  SAVE_LOCAL_DATA: "save_local_data",
  GET_LOCAL_DATA: "get_local_data",
  ALERT: "alert",
  CONFIRM_ALERT: "confirm_alert",
  TOTP: "totp",
};

// Get Token
export const getToken = (callback) => {
  if (window.nativebridge) {
    window.nativebridge.requestToken();
    window.nativebridge.resolveToken = (token) => {
      callback(token);
    };
  } else {
    console.error("Native bridge is not available");
    callback();
  }
};

// Show Alert
export const showAlert = (title, message, buttonText) => {
  if (window.nativebridge && window.ReactNativeWebView) {
    const alertData = JSON.stringify({
      topic: TOPIC.ALERT,
      data: { title, message, buttonText },
    });

    window.ReactNativeWebView.postMessage(alertData);
  } else {
    console.error("Native bridge is not available");
  }
};

// Confirm Alert
export const showConfirmAlert = (
  title,
  message,
  confirmButtonText,
  cancelButtonText,
  confirmCallback,
  cancelCallback
) => {
  if (window.nativebridge && window.ReactNativeWebView) {
    const confirmData = JSON.stringify({
      topic: TOPIC.CONFIRM_ALERT,
      data: { title, message, confirmButtonText, cancelButtonText },
    });

    window.ReactNativeWebView.postMessage(confirmData);

    window.nativebridge.resolveConfirmAlert = (action) => {
      if (action === "confirm") {
        confirmCallback();
      } else if (action === "cancel") {
        cancelCallback();
      }
    };
  } else {
    console.error("Native bridge is not available");
  }
};

// Scan QR Code
export const scanQrCode = (successCallback, failedToRespondCallback) => {
  if (window.nativebridge && window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ topic: TOPIC.QR_REQUEST })
    );

    window.nativebridge.resolveQrCode = (qrData) => successCallback(qrData);
    window.nativebridge.rejectQrCode = (error) =>
      failedToRespondCallback(error);
  } else {
    console.error("Native bridge is not available");
  }
};

// Save Local Data
export const saveLocalData = (key, value, callback, failedToRespondCallback) => {
  key = key.toString().replace(" ", "-").toLowerCase();
  const encodedValue = btoa(JSON.stringify(value));

  if (window.nativebridge && window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        topic: TOPIC.SAVE_LOCAL_DATA,
        data: { key, value: encodedValue },
      })
    );

    window.nativebridge.resolveSaveLocalData = callback;
    window.nativebridge.rejectSaveLocalData = (error) =>
      failedToRespondCallback(error);
  } else {
    console.error("Native bridge is not available");
  }
};

// Get Local Data
export const getLocalData = (key, callback, failedToRespondCallback) => {
  key = key.toString().replace(" ", "-").toLowerCase();

  if (window.nativebridge && window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ topic: TOPIC.GET_LOCAL_DATA, data: { key } })
    );

    window.nativebridge.resolveGetLocalData = ({ value }) => {
      if (!value) {
        callback(null);
      } else {
        callback(JSON.parse(atob(value)));
      }
    };

    window.nativebridge.rejectGetLocalData = (error) =>
      failedToRespondCallback(error);
  } else {
    console.error("Native bridge is not available");
  }
};

// TOTP QR Migration Data
export const totpQrMigrationData = (callback, failedToRespondCallback) => {
  if (window.nativebridge && window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ topic: TOPIC.TOTP })
    );

    window.nativebridge.resolveTotpQrMigrationData = ({ data }) => {
      if (data) {
        callback(data.replace(" ", "").split(","));
      } else {
        callback([]);
      }
    };

    window.nativebridge.rejectTotpQrMigrationData = (error) =>
      failedToRespondCallback(error);
  } else {
    console.error("Native bridge is not available");
  }
};
