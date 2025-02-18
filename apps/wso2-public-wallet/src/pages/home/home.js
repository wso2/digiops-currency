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

import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalDataAsync } from "../../helpers/Storage";
import { getWalletBalanceByWalletAddress } from "../../services/BlockChainService";
import {
  ERROR_RETRIEVE_WALLET_ADDRESS,
  WALLET_ADDRESS_COPIED,
  COPIED,
} from "../../constants/Strings";
import { STORAGE_KEYS } from "../../constants/Configs";
import NoWallet from "../no-wallet/NoWallet";
import RecentActivities from "../../components/home/RecentActivities";
import WalletOverview from "../../components/wallet-overview/WalletOverview";
import "./Home.css";

const HomePage = () => {
  // --- get the navigate function from useNavigate hook ---
  const navigate = useNavigate();

  // --- get the message api and context holder from the message hook ---
  const [walletAddress, setWalletAddress] = useState(null);
  const [isAccountCopied, setIsAccountCopied] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [isTokenBalanceLoading, setIsTokenBalanceLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [copied, setCopied] = useState(false);

  // --- get the message api and context holder from the message hook ---
  const handleCopy = () => {
    handledCopyAccount();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    message.success(COPIED);
  };

  // --- fetch wallet address ---
  const fetchWalletAddress = async () => {
    try {
      const walletAddressResponse = await getLocalDataAsync(
        STORAGE_KEYS.WALLET_ADDRESS
      );
      if (walletAddressResponse) {
        setWalletAddress(walletAddressResponse);
      }
    } catch (error) {
      messageApi.error(ERROR_RETRIEVE_WALLET_ADDRESS);
    }
  };

  // --- fetch wallet address when page mounts ---
  useEffect(() => {
    fetchWalletAddress();
  }, []);

  // --- fetch current token balance ---
  const fetchCurrentTokenBalance = async () => {
    try {
      setIsTokenBalanceLoading(true);
      const tokenBalance = await getWalletBalanceByWalletAddress(walletAddress);
      setTokenBalance(tokenBalance);
    } catch (error) {
      setTokenBalance(0);
      console.error("Error fetching token balance", error);
    } finally {
      setIsTokenBalanceLoading(false);
    }
  };

  // --- fetch token balance when wallet address changes ---
  useEffect(() => {
    if (walletAddress) {
      fetchCurrentTokenBalance();
    }
  }, [walletAddress]);

  // --- fetch token balance in every 5 seconds ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (walletAddress) {
        getWalletBalanceByWalletAddress(walletAddress)
          .then(setTokenBalance)
          .catch(() => setTokenBalance(0));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [walletAddress]);

  // --- handle copy account ---
  const handledCopyAccount = () => {
    setIsAccountCopied(true);
    messageApi.success(WALLET_ADDRESS_COPIED, 1, () => {
      setIsAccountCopied(false);
    });
  };

  // --- handle send click ---
  const handleSendClick = () => {
    navigate("/send-tokens");
  };

  return walletAddress == null ? (
    <NoWallet />
  ) : (
    <>
      <div className="home-container">
        <WalletOverview
          walletAddress={walletAddress}
          tokenBalance={tokenBalance}
          isTokenBalanceLoading={isTokenBalanceLoading}
          handleSendClick={handleSendClick}
          handleCopy={handleCopy}
          isAccountCopied={isAccountCopied}
        />
        {/* recent activities */}
        <div styles={{ padding: "20px" }}>
          <RecentActivities />
        </div>
      </div>
    </>
  );
};

export default HomePage;
