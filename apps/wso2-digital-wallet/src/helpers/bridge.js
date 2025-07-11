// Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

/**
 * Checks if the native bridge is ready for communication
 * @returns {boolean} True if bridge is ready, false otherwise
 */
export const checkBridgeReady = () => {
  return window.nativebridge && window.ReactNativeWebView;
};

/**
 * Waits for the native bridge to become ready
 * @param {number} maxWaitTime - Maximum time to wait in milliseconds (default - 5000)
 * @returns {Promise<boolean>} Promise that resolves true if bridge is ready, false if timeout
 */
export const waitForBridge = async (maxWaitTime = 5000) => {
  const startTime = Date.now();
  
  while (!checkBridgeReady() && (Date.now() - startTime) < maxWaitTime) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return checkBridgeReady();
};
