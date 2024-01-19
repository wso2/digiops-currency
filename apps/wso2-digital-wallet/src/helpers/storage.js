// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { saveLocalData, getLocalData } from "../microapp-bridge";

export function saveLocalDataAsync(key, value) {
  return new Promise((resolve, reject) => {
    const callback = () => resolve();
    const failedToRespondCallback = (err) => reject(err);

    saveLocalData(key, value, callback, failedToRespondCallback);
  });
}

export function getLocalDataAsync(key) {
  return new Promise((resolve, reject) => {
    const callback = (data) => resolve(data);
    const failedToRespondCallback = (err) => reject(err);

    getLocalData(key, callback, failedToRespondCallback);
  });
}
