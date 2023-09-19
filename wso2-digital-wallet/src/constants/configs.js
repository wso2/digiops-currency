// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

// Private variables
export const RPC_ENDPOINT = process.env.REACT_APP_RPC_ENDPOINT;
export const TOKEN_REFRESH_URL = process.env.REACT_APP_TOKEN_REFRESH_URL;
export const API_KEY = process.env.REACT_APP_API_KEY;
export const MASTER_WALLET_PRIVATE_KEY =
  process.env.REACT_APP_MASTER_WALLET_PRIVATE_KEY;

// Public variables
export const MASTER_WALLET_ADDRESS =
  "0xc0F38dCf78aAa08b7528af2ad0B9c10eCD1ce338";
export const SECONDARY_WALLET_ADDRESS =
  "0x1e545367dF65237cE52E86F53e2ffFf341564236";
export const CONTRACT_ADDRESS = "0xafc35cAa0B4865C848948e2e001B0c4ECEBc0ca0";
export const CHAIN_ID = 10000;
export const CONTRACT_ABI =
  '[{"inputs":[{"internalType":"uint256","name":"_supply","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"approveMax","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]';

export const STORAGE_KEYS = {
  WALLET_ADDRESS: "wallet-address",
  API_KEY: "api-key",
  PRIVATE_KEY: "private-key",
  THEME_MODE: "theme-mode",
  SENDER_WALLET_ADDRESS: "sender-wallet-address",
  SENDING_AMOUNT: "sending_amount"
};

export const MESSAGE_TYPES = {
  ERROR: "error",
  SUCCESS: "success",
  INFO: "info",
  WARNING: "warning"
};

export const PASS_PHRASE_LENGTH = 12;
export const DEFAULT_WALLET_ADDRESS = "0x";
