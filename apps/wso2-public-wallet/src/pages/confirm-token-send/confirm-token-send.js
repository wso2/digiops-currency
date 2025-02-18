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

import React, { useState, useEffect } from "react";
import Identicon from "identicon.js";
import { SHA256 } from "crypto-js";
import { Avatar, Button, message } from "antd";
import { Col, Row } from "reactstrap";
import Wso2MainImg from "../../assets/images/wso2_main.png";
import { useNavigate } from "react-router-dom";
import { getLocalDataAsync, saveLocalDataAsync } from "../../helpers/storage";
import { transferTokens } from "../../services/blockchain.service";
import { getEllipsisTxt } from "../../helpers/formatter";
import {
  ERROR,
  ERROR_FETCHING_LOCAL_TX_DETAILS,
  ERROR_RESETTING_TX_VALUES,
  ERROR_TRANSFERRING_TOKEN,
  SUCCESS,
  SUCCESS_TOKEN_TRANSFER,
} from "../../constants/strings";
import { STORAGE_KEYS } from "../../constants/configs";
import "./confirm-token-send.css";

const ConfirmSendTokens = () => {
  // --- get the navigate function from useNavigate hook ---
  const navigate = useNavigate();

  // --- get the message api and context holder from the message hook ---
  const [messageApi, contextHolder] = message.useMessage();

  // --- set the initial state for the sender and receiver wallet addresses ---
  const [fromAddress, setFromAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [isTransferLoading, setIsTransferLoading] = useState(false);

  // --- fetch the transaction details from local storage ---
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
      console.error(`${ERROR_FETCHING_LOCAL_TX_DETAILS}: ${error}`);
    }
  };

  // --- fetch transaction details when page mounts ---
  useEffect(() => {
    fetchLocalTxDetails();
  }, []);

  // --- generate avatar based on the wallet address ---
  const generateAvatar = (seed) => {
    const options = {
      size: 80, // Adjust the size of the identicon image
    };
    const hash = SHA256(seed).toString();
    const data = new Identicon(hash.slice(0, 15), options).toString();
    return "data:image/png;base64," + data;
  };

  // --- handle reject ---
  const handleReject = async () => {
    await resetInputFields();
    navigate("/");
  };

  // --- reset input fields ---
  const resetInputFields = async () => {
    console.log("resetting input fields");
    try {
      await saveLocalDataAsync(STORAGE_KEYS.SENDING_AMOUNT, "");
      await saveLocalDataAsync(STORAGE_KEYS.SENDER_WALLET_ADDRESS, "");
    } catch (error) {
      console.log(`${ERROR_RESETTING_TX_VALUES}: ${error}`);
    }
    console.log("resetting input fields done");
  };

  // --- handle confirm ---
  const handleConfirm = async () => {
    try {
      setIsTransferLoading(true);
      const receipt = await transferTokens(senderAddress, sendAmount);
      console.log("this is receipt --- > ", receipt);
      if (receipt) {
        await resetInputFields();
        // wait 3 seconds before navigating to home page
        messageApi.success(SUCCESS, SUCCESS_TOKEN_TRANSFER);
        console.log("Alert shown");

        setTimeout(() => {
          navigate("/");
          setIsTransferLoading(false);
        }, 3000);
      }
    } catch (error) {
      console.log("error while transferring token", error);
      await messageApi.error(ERROR, ERROR_TRANSFERRING_TOKEN);
      setIsTransferLoading(false);
    }
  };

  // --- generate avatar url ---
  const avatar1Url = generateAvatar("avatar1");
  const avatar2Url = generateAvatar("avatar2");

  return (
    <div className="container">
      {contextHolder}
      <Row className="mt-5">
        <Col md="6" className="text-center">
          <img src={Wso2MainImg} alt="wso2-logo" className="wso2-logo" />
        </Col>
        <Col md="6" className="text-center">
          <Avatar src={avatar1Url} size={80} className="avatar" alt="avatar1" />
          <Avatar src={avatar2Url} size={80} className="avatar" alt="avatar2" />
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md="12" className="text-center">
          <h2>Confirm Transfer</h2>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md="12" className="text-center">
          <p>
            Transfer {sendAmount} tokens from {getEllipsisTxt(fromAddress, 10)}{" "}
            to {getEllipsisTxt(senderAddress, 10)}?
          </p>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md="12" className="text-center">
          <Button
            type="primary"
            onClick={handleConfirm}
            loading={isTransferLoading}
          >
            Confirm
          </Button>
          <Button className="ml-3" onClick={handleReject}>
            Reject
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ConfirmSendTokens;
