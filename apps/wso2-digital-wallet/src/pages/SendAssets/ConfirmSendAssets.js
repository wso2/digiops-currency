// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import React, { useState, useEffect } from "react";
import Identicon from "identicon.js";
import { SHA256 } from "crypto-js";
import { Avatar, Button } from "antd";
import { Col, Row } from "reactstrap";
import Wso2MainImg from "../../assets/images/wso2_main.png";
import { useNavigate } from "react-router-dom";
import { getLocalDataAsync, saveLocalDataAsync } from "../../helpers/storage";
import { transferToken } from "../../services/blockchain.service";
import { getEllipsisTxt } from "../../helpers/formatter";
import {
  ERROR,
  ERROR_FETCHING_LOCAL_TX_DETAILS,
  ERROR_RESETTING_TX_VALUES,
  ERROR_TRANSFERRING_TOKEN,
  OK,
  SUCCESS,
  SUCCESS_TOKEN_TRANSFER
} from "../../constants/strings";
import { STORAGE_KEYS } from "../../constants/configs";
import { showAlertBox } from "../../helpers/alerts";

function ConfirmSendAssets() {
  const navigate = useNavigate();

  const [fromAddress, setFromAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [isTransferLoading, setIsTransferLoading] = useState(false);

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
    fetchLocalTxDetails();
  }, []);

  const generateAvatar = (seed) => {
    const options = {
      size: 80 // Adjust the size of the identicon image
    };
    const hash = SHA256(seed).toString();
    const data = new Identicon(hash.slice(0, 15), options).toString();
    return "data:image/png;base64," + data;
  };

  const handleReject = async () => {
    await resetInputFields();
    navigate("/");
  };

  const resetInputFields = async () => {
    try {
      await saveLocalDataAsync(STORAGE_KEYS.SENDING_AMOUNT, "");
      await saveLocalDataAsync(STORAGE_KEYS.SENDER_WALLET_ADDRESS, "");
    } catch (error) {
      console.log(`${ERROR_RESETTING_TX_VALUES}: ${error}`);
    }
  };

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

  const handleConfirm = async () => {
    try {
      const isBridgeReady = await waitForBridge();
      if (!isBridgeReady) {
        console.error('Bridge not ready for token transfer');
        showAlertBox(ERROR, 'Bridge not ready for transfer', OK);
        return;
      }

      setIsTransferLoading(true);
      const receipt = await transferToken(senderAddress, sendAmount);
      if (receipt) {
        await resetInputFields();
        showAlertBox(SUCCESS, SUCCESS_TOKEN_TRANSFER, OK);
        setTimeout(() => {
          navigate("/");
        }, 500);
      }
      setIsTransferLoading(false);
    } catch (error) {
      console.log("error while transferring token", error);
      showAlertBox(ERROR, ERROR_TRANSFERRING_TOKEN, OK);
      setIsTransferLoading(false);
    }
  };

  const avatar1Url = generateAvatar("avatar1");
  const avatar2Url = generateAvatar("avatar2");

  return (
    <div className="mx-4">
      <Row>
        <Col span={12}>
          <div style={{ textAlign: "left" }} className="d-flex">
            <Avatar size={40} src={avatar1Url} />
            <div className="d-flex flex-column">
              <span style={{ marginLeft: "10px" }}>From</span>
              <span style={{ marginLeft: "10px" }}>
                {getEllipsisTxt(fromAddress, 5)}{" "}
              </span>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div style={{ textAlign: "left" }} className="d-flex">
            <Avatar size={40} src={avatar2Url} />
            <div className="d-flex flex-column">
              <span style={{ marginLeft: "10px" }}>To</span>
              <span style={{ marginLeft: "10px" }}>
                {getEllipsisTxt(senderAddress, 5)}{" "}
              </span>
            </div>
          </div>
        </Col>
      </Row>
      <div className="d-flex flex-column mt-3 sending-details">
        <span className="sending-wso2">SENDING WSO2</span>
        <div className="d-flex justify-content-start mt-2">
          <Avatar size={20} src={Wso2MainImg} />
          <span className="send-coin-balance mx-1">{sendAmount}</span>
        </div>
      </div>
      <div className="d-flex justify-content-between mt-5">
        <span className="">Total</span>
        <span className="">{sendAmount} WSO2</span>
      </div>
      <Row className="send-button-section">
        <Col md="6" sm="6">
          <Button block className="default-button mt-2" onClick={handleReject}>
            Reject
          </Button>
        </Col>
        <Col md="6" sm="6">
          <Button
            block
            className="primary-button mt-2"
            loading={isTransferLoading}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default ConfirmSendAssets;
