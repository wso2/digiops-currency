// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { Tag, Tooltip, Spin, message } from "antd";
import React, { useState, useEffect } from "react";
import { getEllipsisTxt } from "../../helpers/formatter";
import {
  DownloadOutlined,
  WalletOutlined,
  CopyOutlined,
  CheckOutlined,
  LoadingOutlined,
  SendOutlined,
} from "@ant-design/icons";
import RecentActivities from "../../components/Home/RecentActivities";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { getLocalDataAsync } from "../../helpers/storage";
import { getWalletBalanceByWalletAddress } from "../../services/blockchain.service";
import { NumericFormat } from "react-number-format";
import {
  TOTAL_BALANCE,
  SEND,
  REQUEST,
  BUY,
  ERROR_RETRIEVE_WALLET_ADDRESS,
  WALLET_ADDRESS_COPIED,
  OK,
  COPIED,
} from "../../constants/strings";
import { DEFAULT_WALLET_ADDRESS, STORAGE_KEYS } from "../../constants/configs";
import { showAlertBox } from "../../helpers/alerts";

function Home() {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(DEFAULT_WALLET_ADDRESS);

  const [messageApi, contextHolder] = message.useMessage();

  const fetchWalletAddress = async () => {
    try {
      const walletAddressResponse = await getLocalDataAsync(
        STORAGE_KEYS.WALLET_ADDRESS
      );
      if (walletAddressResponse !== walletAddress) {
        setWalletAddress(walletAddressResponse);
      }
    } catch (error) {
      console.log(`${ERROR_RETRIEVE_WALLET_ADDRESS} - ${error}`);
      messageApi.error(ERROR_RETRIEVE_WALLET_ADDRESS);
    }
  };

  const [isAccountCopied, setIsAccountCopied] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [isTokenBalanceLoading, setIsTokenBalanceLoading] = useState(false);

  useEffect(() => {
    fetchWalletAddress();
    // eslint-disable-next-line
  }, [walletAddress]);

  useEffect(() => {
    if (walletAddress !== DEFAULT_WALLET_ADDRESS && walletAddress) {
      fetchCurrentTokenBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (walletAddress !== DEFAULT_WALLET_ADDRESS && walletAddress) {
        fetchCurrentTokenBalanceDoInBackground();
      }
    }, 5000);

    // This is important, as it clears the interval when the component is unmounted.
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  const handleCopyAccount = async () => {
    await showAlertBox(COPIED, WALLET_ADDRESS_COPIED, OK);
    setIsAccountCopied(true);
    setTimeout(() => {
      setIsAccountCopied(false);
    }, 2000);
  };

  const handleSendIcon = () => {
    navigate("/send");
  };

  useEffect(() => {
    if (!walletAddress || walletAddress?.length === 0) {
      navigate("/create-wallet");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  const fetchCurrentTokenBalance = async () => {
    try {
      setIsTokenBalanceLoading(true);
      const tokenBalance = await getWalletBalanceByWalletAddress(walletAddress);
      setTokenBalance(tokenBalance);
      setIsTokenBalanceLoading(false);
    } catch (error) {
      console.debug("DEBUG: error while fetching token balance", error);
      setIsTokenBalanceLoading(false);
      setTokenBalance(0);
    }
  };

  const fetchCurrentTokenBalanceDoInBackground = async () => {
    try {
      const tokenBalance = await getWalletBalanceByWalletAddress(walletAddress);
      setTokenBalance(tokenBalance);
    } catch (error) {
      setTokenBalance(0);
      console.debug("DEBUG: error while fetching token balance", error);
    }
  };

  const orangeColor = "#EE7B2F";

  return (
    <div className="home-container ">
      {contextHolder}
      <div className="wallet-balance-details mt-4">
        <span className="total-balance-tag">{TOTAL_BALANCE}</span>
        <span className="total-balance-value">
          {isTokenBalanceLoading ? (
            <Spin
              indicator={<LoadingOutlined style={{ color: orangeColor }} />}
              style={{ margin: "10px " }}
            />
          ) : (
            <NumericFormat
              value={tokenBalance}
              displayType={"text"}
              thousandSeparator={true}
            />
          )}
        </span>
        <CopyToClipboard text={walletAddress} onCopy={handleCopyAccount}>
          <Tooltip title={isAccountCopied ? "Copied" : "Copy to Clipboard"}>
            <Tag className="total-balance-wallet-address mt-2">
              {getEllipsisTxt(walletAddress, 13)}{" "}
              {!isAccountCopied ? (
                <CopyOutlined style={{ marginLeft: "5px" }} />
              ) : (
                <CheckOutlined style={{ marginLeft: "5px" }} />
              )}
            </Tag>
          </Tooltip>
        </CopyToClipboard>
        <div className="d-flex justify-content-between mt-4">
          <div onClick={handleSendIcon}>
            <div className="total-balance-icons">
              <div style={{ marginTop: "-2px", marginBottom: "-2px" }}>
                <SendOutlined
                  rotate={320}
                  style={{ fontSize: "18px", cursor: "pointer" }}
                />
              </div>
            </div>
            <div className="total-balance-action">{SEND}</div>
          </div>
          <div>
            <div className="total-balance-icons mx-5">
              <div style={{ marginTop: "-2px", marginBottom: "-2px" }}>
                <DownloadOutlined
                  style={{ fontSize: "18px", cursor: "pointer" }}
                />
              </div>
            </div>
            <div className="total-balance-action">{REQUEST}</div>
          </div>
          <div>
            <div className="total-balance-icons">
              <div style={{ marginTop: "-2px", marginBottom: "-2px" }}>
                <WalletOutlined
                  style={{ fontSize: "18px", cursor: "pointer" }}
                />
              </div>
            </div>
            <div className="total-balance-action">{BUY}</div>
          </div>
        </div>
      </div>
      <RecentActivities />
    </div>
  );
}

export default Home;
