// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import {
  useEffect,
  useState,
} from 'react';

import { Spin } from 'antd';

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

import { STORAGE_KEYS } from '../../constants/configs';
import {
  ERROR_READING_WALLET_DETAILS,
  RECENT_ACTIVITIES,
  WSO2_TOKEN,
} from '../../constants/strings';
import { getLocalDataAsync } from '../../helpers/storage';
import { getRecentTransactions } from '../../services/blockchain.service';

function RecentActivities() {
  const [walletAddress, setWalletAddress] = useState("");
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isRecentTransactionsLoading, setIsRecentTransactionsLoading] =
    useState(false);

  const orangeColor = "#ff7300";

  const checkBridgeReady = () => {
    return window.nativebridge && window.ReactNativeWebView;
  };

  const waitForBridge = async (maxWaitTime = 5000) => {
    const startTime = Date.now();
    
    while (!checkBridgeReady() && (Date.now() - startTime) < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return checkBridgeReady();
  };

  const fetchWalletAddress = async () => {
    try {
      const walletAddressResponse = await getLocalDataAsync(
        STORAGE_KEYS.WALLET_ADDRESS
      );
      setWalletAddress(walletAddressResponse);
    } catch (error) {
      console.error(`${ERROR_READING_WALLET_DETAILS}: ${error}`);
      setWalletAddress("");
    }
  };

  useEffect(() => {
    fetchWalletAddress();
  }, []);

  useEffect(() => {
    if (walletAddress) {
      fetchRecentTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (walletAddress) {
        fetchRecentTransactionsDoInBackground();
      }
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  const fetchRecentTransactions = async () => {
    try {
      const isBridgeReady = await waitForBridge();
      if (!isBridgeReady) {
        console.error("Bridge not ready for recent transactions fetch");
        return;
      }

      setIsRecentTransactionsLoading(true);
      const recentTransactions = await getRecentTransactions(walletAddress);
      setRecentTransactions(recentTransactions);
      setIsRecentTransactionsLoading(false);
    } catch (error) {
      setIsRecentTransactionsLoading(false);
      console.error("error while fetching recent transactions", error);
    }
  };

  const fetchRecentTransactionsDoInBackground = async () => {
    try {
      const isBridgeReady = await waitForBridge();
      if (!isBridgeReady) {
        console.error("Bridge not ready for background recent transactions fetch");
        return;
      }

      const recentTransactions = await getRecentTransactions(walletAddress);
      setRecentTransactions(recentTransactions);
    } catch (error) {
      console.error("error while fetching recent transactions", error);
    }
  };

  function TransactionList({ transactions }) {
    if (transactions.length > 0) {
      return (
        <>
          {transactions.map((transaction, index) => (
            <div key={index} className="mt-4">
              <div className="d-flex justify-content-between">
                <div className="d-flex">
                  {transaction.direction === "send" ? (
                    <ArrowUpOutlined
                      className="red-text mt-2"
                      style={{ fontSize: 24 }}
                    />
                  ) : (
                    <ArrowDownOutlined
                      className="green-text mt-2"
                      style={{ fontSize: 24 }}
                    />
                  )}
                  <div className="d-flex flex-column mx-3 text-start">
                    <span className="recent-activity-topic fw-normal">
                      {transaction.direction === "send" ? "Sent" : "Received"}
                    </span>
                    <span className="recent-activity-time">
                      {transaction.timestamp}
                    </span>
                  </div>
                </div>
                <span
                  className={`recent-activity-value ${
                    transaction.direction === "send" ? "red-text" : "green-text"
                  }`}
                >
                  {transaction.direction === "send" ? "-" : "+"}
                  {transaction.tokenAmount} {WSO2_TOKEN}
                </span>
              </div>
            </div>
          ))}
        </>
      );
    } else {
      return (
        <div className="mt-5">
          <p className="text-muted">no recent activities</p>
        </div>
      );
    }
  }

  return (
    <div className=" recent-activities-widget">
      <div className="recent-activities-widget-inner">
        <div className="mt-1">
          <div className="d-flex justify-content-between">
            <div className="sub-heading">
              <h4>{RECENT_ACTIVITIES}</h4>
            </div>
          </div>
        </div>

        {isRecentTransactionsLoading ? (
          <div className="mt-5">
            <Spin
              indicator={<LoadingOutlined style={{ color: orangeColor }} />}
              style={{ margin: "10px " }}
            />
          </div>
        ) : (
          <div className="recent-activity-container">
            <TransactionList transactions={recentTransactions} />
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentActivities;
