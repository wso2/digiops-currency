// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import React, { useEffect, useState } from "react";
import { Input, Button, Avatar, message, Spin } from "antd";
import { SearchOutlined, QrcodeOutlined, ArrowRightOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./SendAssets.css";
import { isAddress } from "ethereum-address";
import Wso2MainImg from "../../assets/images/wso2_main.png";
import {
  ERROR_FETCHING_LOCAL_TX_DETAILS,
  ERROR_RESETTING_TX_VALUES,
  ERROR_SAVING_TX_DETAILS,
  ERROR_RETRIEVE_WALLET_ADDRESS,
  ERROR_BRIDGE_NOT_READY,
  WSO2_TOKEN
} from "../../constants/strings";
import { getLocalDataAsync, saveLocalDataAsync } from "../../helpers/storage";
import { STORAGE_KEYS, DEFAULT_WALLET_ADDRESS } from "../../constants/configs";
import { getWalletBalanceByWalletAddress } from "../../services/blockchain.service";
import { waitForBridge } from "../../helpers/bridge";
import { scanQrCode } from "../../microapp-bridge";
import { getParkingPaymentLaunchData } from "../../helpers/parkingPaymentFlow";

function SendAssets() {
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  const [sendWalletAddress, setSendWalletAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [isValidWalletAddress, setIsValidWalletAddress] = useState(false);
  const [isShowErrorMsg, setIsShowErrorMsg] = useState(false);
  const [walletValidationErrorMsg, setWalletValidationErrorMsg] = useState("");
  const [isCanContinue, setIsCanContinue] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const [storedSendWalletAddress, setStoredSendWalletAddress] = useState("");
  const [storedSendAmount, setStoredSendAmount] = useState("");

  const [isTokenBalanceLoading, setIsTokenBalanceLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState(DEFAULT_WALLET_ADDRESS);

  const fetchWalletAddress = async (retryCount = 0) => {
    const maxRetries = 3;
    
    try {
      const isBridgeReady = await waitForBridge();
      if (!isBridgeReady) {
        console.error(ERROR_BRIDGE_NOT_READY);
        messageApi.error(ERROR_BRIDGE_NOT_READY);
        return;
      }
      const walletAddressResponse = await getLocalDataAsync(
        STORAGE_KEYS.WALLET_ADDRESS
      );
      if (walletAddressResponse && 
          walletAddressResponse !== null && 
          walletAddressResponse !== DEFAULT_WALLET_ADDRESS && 
          typeof walletAddressResponse === 'string' && 
          walletAddressResponse.length > 2) {
        setWalletAddress(walletAddressResponse);
      } else {
        if (retryCount < maxRetries) {
          setTimeout(() => fetchWalletAddress(retryCount + 1), 1000);
        } else {
          setWalletAddress(DEFAULT_WALLET_ADDRESS);
        }
      }
    } catch (error) {
      console.log(`${ERROR_RETRIEVE_WALLET_ADDRESS} - ${error}`);
      if (retryCount < maxRetries) {
        setTimeout(() => fetchWalletAddress(retryCount + 1), 1000);
      } else {
        messageApi.error(ERROR_RETRIEVE_WALLET_ADDRESS);
        setWalletAddress(DEFAULT_WALLET_ADDRESS);
      }
    }
  };

  const fetchCurrentTokenBalance = async () => {
    try {
      if (!walletAddress || walletAddress === DEFAULT_WALLET_ADDRESS) {
        setTokenBalance(0);
        return;
      }

      const isBridgeReady = await waitForBridge();
      if (!isBridgeReady) {
        console.error(ERROR_BRIDGE_NOT_READY);
        setTokenBalance(0);
        return;
      }

      setIsTokenBalanceLoading(true);
      const tokenBalance = await getWalletBalanceByWalletAddress(walletAddress);
      setTokenBalance(tokenBalance);
      setIsTokenBalanceLoading(false);
    } catch (error) {
      console.log("error while fetching token balance", error);
      setIsTokenBalanceLoading(false);
      setTokenBalance(0);
    }
  };

  useEffect(() => {
    const initializeWallet = async () => {
      await fetchWalletAddress();
    };

    initializeWallet();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const initializeParkingPaymentLaunch = async () => {
      const launchData = getParkingPaymentLaunchData();
      if (!launchData) return;

      try {
        await saveLocalDataAsync(
          STORAGE_KEYS.SENDER_WALLET_ADDRESS,
          launchData.walletAddress
        );
        await saveLocalDataAsync(STORAGE_KEYS.SENDING_AMOUNT, launchData.amount);
        navigate("/confirm-assets-send", {
          replace: true,
          state: {
            isParkingPaymentFlow: true,
            returnAppId: launchData.returnAppId,
            returnRoute: launchData.returnRoute
          }
        });
      } catch (error) {
        console.log(`${ERROR_SAVING_TX_DETAILS}: ${error}`);
      }
    };

    initializeParkingPaymentLaunch();
  }, [navigate]);

  useEffect(() => {
    if (walletAddress !== DEFAULT_WALLET_ADDRESS && walletAddress) {
      fetchCurrentTokenBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  const handleSendCancel = () => {
    navigate("/");
  };

  const handleSendAssetsNext = async () => {
    try {
      await saveLocalDataAsync(STORAGE_KEYS.SENDING_AMOUNT, sendAmount);
      await saveLocalDataAsync(
        STORAGE_KEYS.SENDER_WALLET_ADDRESS,
        sendWalletAddress
      );
      navigate("/confirm-assets-send");
    } catch (error) {
      console.log(`${ERROR_SAVING_TX_DETAILS}: ${error}`);
    }
  };

  const handleWalletAddressInputChange = (e) => {
    const address = e.target.value;
    setSendWalletAddress(address);

    if (e.target.value === "") {
      setIsShowErrorMsg(false);
    }
  };

  const handleScanQrCode = () => {
    setIsScanning(true);
    scanQrCode(
      async (qrData) => {
        try {
          // Try parsing as JSON
          const parsedData = JSON.parse(qrData);
          
          // Validate wallet address
          if (!parsedData.wallet_address || !isAddress(parsedData.wallet_address)) {
            messageApi.error("Invalid wallet address in QR code");
            setIsScanning(false);
            return;
          }
          
          // Check if it's a payment request (has coin_amount)
          if (parsedData.coin_amount) {
            // Payment Request QR - Navigate directly to confirm
            const amount = parseFloat(parsedData.coin_amount);
            if (isNaN(amount) || amount <= 0) {
              messageApi.error("Invalid payment amount in QR code");
              setIsScanning(false);
              return;
            }
            
            // Save to localStorage and navigate to confirm page
            await saveLocalDataAsync(STORAGE_KEYS.SENDER_WALLET_ADDRESS, parsedData.wallet_address);
            await saveLocalDataAsync(STORAGE_KEYS.SENDING_AMOUNT, parsedData.coin_amount);
            messageApi.success("Payment request loaded");
            
            // Navigate directly to confirmation
            setTimeout(() => {
              navigate("/confirm-assets-send");
            }, 500);
          } else {
            // Profile QR - Only address, fill the field
            setSendWalletAddress(parsedData.wallet_address);
            messageApi.success("Recipient address added");
          }
          setIsScanning(false);
        } catch (error) {
          // Failed to parse JSON
          if (isAddress(qrData)) {
            setSendWalletAddress(qrData);
            messageApi.success("Recipient address added");
          } else {
            messageApi.error("Invalid QR code format");
          }
          setIsScanning(false);
        }
      },
      (error) => {
        console.error("QR Code scan failed:", error);
        messageApi.error("Failed to scan QR code. Please try again.");
        setIsScanning(false);
      }
    );
  };

  const fetchLocalTxDetails = async () => {
    try {
      const sendingAmount = await getLocalDataAsync(
        STORAGE_KEYS.SENDING_AMOUNT
      );
      const senderWalletAddress = await getLocalDataAsync(
        STORAGE_KEYS.SENDER_WALLET_ADDRESS
      );
      setStoredSendWalletAddress(senderWalletAddress);
      setStoredSendAmount(sendingAmount);
    } catch (error) {
      console.log(`${ERROR_FETCHING_LOCAL_TX_DETAILS}: ${error}`);
    }
  };

  useEffect(() => {
    fetchLocalTxDetails();
  }, []);

  useEffect(() => {
    if (storedSendWalletAddress || storedSendAmount) {
      setSendWalletAddress(storedSendWalletAddress);
      setSendAmount(storedSendAmount);
    }
  }, [storedSendWalletAddress, storedSendAmount]);

  useEffect(() => {
    if (isValidWalletAddress && sendAmount && parseFloat(sendAmount) > 0) {
      setIsCanContinue(true);
    } else {
      setIsCanContinue(false);
    }
  }, [isValidWalletAddress, sendAmount]);

  useEffect(() => {
    setIsValidWalletAddress(isAddress(sendWalletAddress));
    if (sendWalletAddress === "") {
      setIsShowErrorMsg(false);
      setWalletValidationErrorMsg("");
    } else if (isAddress(sendWalletAddress)) {
      setIsShowErrorMsg(false);
      setWalletValidationErrorMsg("");
    } else {
      setIsShowErrorMsg(true);
      setWalletValidationErrorMsg("Invalid wallet address");
    }
  }, [sendWalletAddress]);

  return (
    <div className="mx-3">
      {contextHolder}
      <div className="mt-4 d-flex justify-content-between align-items-center">
        <Button
          type="link"
          icon={<HomeOutlined />}
          onClick={handleSendCancel}
          className="back-button"
        >
          Home
        </Button>
        <span className="send-header">Send Coins</span>
        <div style={{ width: 60 }}></div>
      </div>

      <div className="scan-section">
        <Button
          type="primary"
          className="primary-button scan-primary-button"
          icon={<QrcodeOutlined />}
          onClick={handleScanQrCode}
          loading={isScanning}
        >
          {isScanning ? "Scanning..." : "Scan QR Code"}
        </Button>
        <div className="or-divider">
          <span>Or enter manually</span>
        </div>
      </div>

      <div className="form-section">
        <div className="form-field">
          <div className="field-label">Recipient Address</div>
          <Input
            className="wallet-search-input"
            prefix={<SearchOutlined />}
            placeholder="Enter wallet address (0x)"
            value={sendWalletAddress}
            onChange={handleWalletAddressInputChange}
            size="large"
            status={isShowErrorMsg && sendWalletAddress ? "error" : ""}
          />
          {isShowErrorMsg && sendWalletAddress && (
            <span className="error-text">{walletValidationErrorMsg}</span>
          )}
        </div>

        <div className="asset-section">
          <div className="section-label">Wallet Balance</div>
          <div className="asset-info-card">
            <Avatar size={48} src={Wso2MainImg} />
            <div className="asset-details">
              <span className="asset-name">{WSO2_TOKEN}</span>
              <span className="asset-balance">
                Balance:{" "}
                {isTokenBalanceLoading ? (
                  <Spin size="small" />
                ) : (
                  tokenBalance
                )}{" "}
                {WSO2_TOKEN}
              </span>
            </div>
          </div>
        </div>

        <div className="amount-section">
          <div className="field-label">Amount</div>
          <div className="amount-input-wrapper">
            <Input
              className="amount-input"
              placeholder="0"
              value={sendAmount}
              disabled={!isValidWalletAddress}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*(\.\d*)?$/.test(value)) {
                  setSendAmount(value);
                }
              }}
            />
            <div className="currency-badge">
              <Avatar size={24} src={Wso2MainImg} />
              <span>{WSO2_TOKEN}</span>
            </div>
          </div>
          {!isValidWalletAddress && (
            <span className="helper-text">Enter a valid wallet address first</span>
          )}
        </div>

        <div className="button-group">
          <Button
            block
            type="primary"
            className="next-button"
            onClick={handleSendAssetsNext}
            disabled={!isCanContinue}
            icon={<ArrowRightOutlined />}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SendAssets;
