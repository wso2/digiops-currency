// Copyright (c) 2025 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import React, { useEffect, useState } from "react";
import RecentActivities from "../../components/home/RecentActivities";
import { getLocalDataAsync } from "../../helpers/Storage";
import { STORAGE_KEYS } from "../../constants/Configs";
import { ERROR_RETRIEVE_WALLET_ADDRESS } from "../../constants/Strings";
import { message } from "antd";
import NoWallet from "../no-wallet/NoWallet";

const HistoryPage = () => {
  // --- states to store wallet address ---
  const [walletAddress, setWalletAddress] = useState("");

  // --- message api to show alerts ---
  const [messageApi, contextHolder] = message.useMessage();

  // --- fetch wallet address ---
  const fetchWalletAddress = async () => {
    try {
      const walletAddressResponse = await getLocalDataAsync(
        STORAGE_KEYS.WALLET_ADDRESS
      );

      if (walletAddressResponse) {
        setWalletAddress(walletAddressResponse);
      }

      console.log("this is wallet address --- > ", walletAddress);
    } catch (error) {
      console.error(ERROR_RETRIEVE_WALLET_ADDRESS);
      messageApi.error(ERROR_RETRIEVE_WALLET_ADDRESS);
    }
  };

  // --- fetch wallet address when page mounts ---
  useEffect(() => {
    fetchWalletAddress();
  }, []);

  return !walletAddress ? (
    <NoWallet />
  ) : (
    <div style={{ padding: "20px" }}>
      <RecentActivities />
    </div>
  );
};

export default HistoryPage;
