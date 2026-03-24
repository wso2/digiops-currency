// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import React, { useState, useEffect } from "react";
import { Avatar, Button } from "antd";
import Wso2MainImg from "../../assets/images/wso2_main.png";
import { useLocation, useNavigate } from "react-router-dom";
import "./ConfirmSendAssets.css";
import { getLocalDataAsync, saveLocalDataAsync } from "../../helpers/storage";
import { transferToken } from "../../services/blockchain.service";
import { getEllipsisTxt } from "../../helpers/formatter";
import {
  ERROR,
  ERROR_FETCHING_LOCAL_TX_DETAILS,
  ERROR_RESETTING_TX_VALUES,
  ERROR_TRANSFERRING_TOKEN,
  ERROR_BRIDGE_NOT_READY,
  OK,
  SUCCESS,
  SUCCESS_TOKEN_TRANSFER,
  WSO2_TOKEN
} from "../../constants/strings";
import { STORAGE_KEYS } from "../../constants/configs";
import { showToast, showAlertBox } from "../../helpers/alerts";
import { waitForBridge } from "../../helpers/bridge";
import {
  completeParkingPayment,
  getParkingPaymentLaunchData
} from "../../helpers/parkingPaymentFlow";
import { requestOpenMicroApp } from "../../microapp-bridge";

function ConfirmSendAssets() {
  const navigate = useNavigate();
  const location = useLocation();

  const [fromAddress, setFromAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [isTransferLoading, setIsTransferLoading] = useState(false);
  const [parkingFlowData, setParkingFlowData] = useState(null);

  const fetchLocalTxDetails = async () => {
    try {
      const sendingAmount = await getLocalDataAsync(
        STORAGE_KEYS.SENDING_AMOUNT
      );
      const senderWalletAddress = await getLocalDataAsync(
        STORAGE_KEYS.SENDER_WALLET_ADDRESS
      );
      const walletAddress = await getLocalDataAsync(
        STORAGE_KEYS.WALLET_ADDRESS
      );

      setSendAmount(sendingAmount);
      setSenderAddress(senderWalletAddress);

      setFromAddress(walletAddress);
    } catch (error) {
      console.log(`${ERROR_FETCHING_LOCAL_TX_DETAILS}: ${error}`);
    }
  };

  useEffect(() => {
    const stateData = location?.state?.isParkingPaymentFlow
      ? {
          returnAppId: location?.state?.returnAppId,
          returnRoute: location?.state?.returnRoute
        }
      : null;
    const launchData = getParkingPaymentLaunchData();

    if (stateData || launchData) {
      setParkingFlowData({
        returnAppId: stateData?.returnAppId || launchData?.returnAppId || "",
        returnRoute: stateData?.returnRoute || launchData?.returnRoute || ""
      });
    }
  }, [location]);

  useEffect(() => {
    fetchLocalTxDetails();
  }, []);

  const handleReject = async () => {
    await resetInputFields();
    if (parkingFlowData) {
      await completeParkingPayment({
        status: "FAILED",
        error: "User cancelled payment",
        saveLocalDataAsync,
        requestOpenMicroApp,
        returnAppId: parkingFlowData.returnAppId,
        returnRoute: parkingFlowData.returnRoute
      });
      return;
    }
    navigate("/send");
  };

  const resetInputFields = async () => {
    try {
      await saveLocalDataAsync(STORAGE_KEYS.SENDING_AMOUNT, "");
      await saveLocalDataAsync(STORAGE_KEYS.SENDER_WALLET_ADDRESS, "");
    } catch (error) {
      console.log(`${ERROR_RESETTING_TX_VALUES}: ${error}`);
    }
  };

  const handleConfirm = async () => {
    try {
      const isBridgeReady = await waitForBridge();
      if (!isBridgeReady) {
        console.error(ERROR_BRIDGE_NOT_READY);
        showAlertBox(ERROR, ERROR_BRIDGE_NOT_READY, OK);
        return;
      }

      setIsTransferLoading(true);
      const receipt = await transferToken(senderAddress, sendAmount);
      if (receipt) {
        await resetInputFields();

        if (parkingFlowData) {
          await completeParkingPayment({
            status: "SUCCESS",
            txHash: receipt?.transactionHash || "",
            saveLocalDataAsync,
            requestOpenMicroApp,
            returnAppId: parkingFlowData.returnAppId,
            returnRoute: parkingFlowData.returnRoute
          });
          setIsTransferLoading(false);
          return;
        }

        showToast(SUCCESS, SUCCESS_TOKEN_TRANSFER);
        setTimeout(() => {
          navigate("/");
        }, 500);
      }
      setIsTransferLoading(false);
    } catch (error) {
      console.log("error while transferring token", error);

      if (parkingFlowData) {
        try {
          await completeParkingPayment({
            status: "FAILED",
            error: ERROR_TRANSFERRING_TOKEN,
            saveLocalDataAsync,
            requestOpenMicroApp,
            returnAppId: parkingFlowData.returnAppId,
            returnRoute: parkingFlowData.returnRoute
          });
        } catch (parkingError) {
          console.log("error while reporting parking payment failure", parkingError);
        }
      }

      showAlertBox(ERROR, ERROR_TRANSFERRING_TOKEN, OK);
      setIsTransferLoading(false);
    }
  };

  return (
    <div className="confirm-send-container">
      <div className="confirm-header-section">
        <span className="confirm-header">Review Transaction</span>
      </div>

      <div className="confirm-content">
        {/* Hero Amount Display */}
        <div className="amount-hero">
          <div className="amount-subtitle">You're sending</div>
          <div className="amount-value">{sendAmount}</div>
          <div className="amount-currency">{WSO2_TOKEN}</div>
        </div>

        {/* Transaction Flow - Compact Horizontal */}
        <div className="transaction-flow">
          <div className="flow-item from-item">
            <div className="flow-details">
              <span className="flow-label">From</span>
              <span className="flow-address">{getEllipsisTxt(fromAddress, 6)}</span>
            </div>
          </div>
          
          <div className="flow-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#8c8c8c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="flow-item to-item">
            <div className="flow-details">
              <span className="flow-label">To</span>
              <span className="flow-address">{getEllipsisTxt(senderAddress, 6)}</span>
            </div>
          </div>
        </div>

        {/* Total Section - Single Line */}
        <div className="total-section">
          <span className="total-label">Total</span>
          <div className="total-amount-container">
            <span className="total-amount">{sendAmount}</span>
            <div className="currency-badge">
              <Avatar size={24} src={Wso2MainImg} />
              <span>{WSO2_TOKEN}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="button-group">
          {parkingFlowData ? null : (
            <Button
              className="default-button"
              onClick={handleReject}
              block
            >
              Cancel
            </Button>
          )}
          <Button
            className="primary-button"
            loading={isTransferLoading}
            onClick={handleConfirm}
            block
          >
            Confirm & Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmSendAssets;
