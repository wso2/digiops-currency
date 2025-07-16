// Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { message } from 'antd';

export const formatWalletAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
};

export const copyToClipboard = async (address, direction) => {
  try {
    await navigator.clipboard.writeText(address);
    const action = direction === 'send' ? 'Recipient\'s' : 'Sender\'s';
    message.success(`${action} wallet address copied to clipboard!`);
  } catch (err) {
    // for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = address;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    const action = direction === 'send' ? 'Recipient\'s' : 'Sender\'s';
    message.success(`${action} wallet address copied to clipboard!`);
  }
};

export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};
