// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

const nativebridge = require("@nrk/nativebridge");

export function getToken(callback) {
  nativebridge.rpc({
    topic: "token",
    data: {},
    resolve: (data) => {
      callback(data.data);
    },
    reject: (err) => {
      callback();
    },
    timeout: 3000
  });
}

export function showAlert(
  title,
  message,
  buttonText,
  successCallback,
  failedToRespondCallback
) {
  nativebridge.rpc({
    topic: "alert",
    data: {
      title: title,
      message: message,
      buttonText: buttonText
    },
    resolve: () => {
      successCallback();
    },
    reject: (err) => {
      failedToRespondCallback(err);
    },
    timeout: 120000
  });
}

export function showConfirmAlert(
  title,
  message,
  confirmButtonText,
  cancelButtonText,
  confirmCallback,
  cancelCallback,
  failedToRespondCallback
) {
  nativebridge.rpc({
    topic: "confirmAlert",
    data: {
      title: title,
      message: message,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText
    },
    resolve: (data) => {
      if (data.action === "confirm") {
        confirmCallback();
      } else if (data.action === "cancel") {
        cancelCallback();
      } else {
        failedToRespondCallback();
      }
    },
    reject: (err) => {
      failedToRespondCallback(err);
    },
    timeout: 120000
  });
}

export function scanQRCode(successCallback, failedToRespondCallback) {
  nativebridge.rpc({
    topic: "scanQrCode",
    data: {},
    resolve: (data) => {
      successCallback(data.qrData);
    },
    reject: (err) => {
      failedToRespondCallback(err);
    },
    timeout: 120000
  });
}

export function saveLocalData(key, value, callback, failedToRespondCallback) {
  key = key.toString().replace(" ", "-").toLowerCase();
  var encodedValue = btoa(JSON.stringify(value));

  nativebridge.rpc({
    topic: "saveLocalData",
    data: {
      key: key,
      value: encodedValue
    },
    resolve: () => {
      callback();
    },
    reject: (err) => {
      failedToRespondCallback(err);
    },
    timeout: 1000
  });
}

export function getLocalData(key, callback, failedToRespondCallback) {
  key = key.toString().replace(" ", "-").toLowerCase();
  nativebridge.rpc({
    topic: "getLocalData",
    data: {
      key: key
    },
    resolve: (encodedData) => {
      if (
        encodedData.value === undefined ||
        encodedData.value === null ||
        encodedData.value === ""
      ) {
        callback();
      } else {
        var jsonObject = JSON.parse(atob(encodedData.value));
        callback(jsonObject);
      }
    },
    reject: (err) => {
      failedToRespondCallback(err);
    },
    timeout: 1000
  });
}

export function totpQrMigrationData(callback, failedToRespondCallback) {
  nativebridge.rpc({
    topic: "getTotpQrMigrationData",
    data: {},
    resolve: (encodedData) => {
      var data = encodedData.data;
      if (data !== undefined && data != null && data !== "") {
        var trimmed = data.replace(" ", "");
        callback(trimmed.split(","));
      } else {
        callback([]);
      }
    },
    reject: (err) => {
      failedToRespondCallback(err);
    },
    timeout: 5000
  });
}

export function totpQrMigrationParsedData(callback, failedToRespondCallback) {
  nativebridge.rpc({
    topic: "getTotpQrMigrationParsedData",
    data: {},
    resolve: (encodedData) => {
      var data = encodedData.data;
      if (data !== undefined && data != null && data !== "") {
        var trimmed = data.replace(" ", "");
        callback(trimmed.split(","));
      } else {
        callback([]);
      }
    },
    reject: (err) => {
      failedToRespondCallback(err);
    },
    timeout: 5000
  });
}
