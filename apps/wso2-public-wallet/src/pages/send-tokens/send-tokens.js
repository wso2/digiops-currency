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
import { Input, Button, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { isAddress } from "ethereum-address";
import { Col, Row, Container } from "reactstrap";
import {
  ERROR_RESETTING_TX_VALUES,
  ERROR_SAVING_TX_DETAILS,
  ERROR_RETRIEVE_WALLET_ADDRESS,
} from "../../constants/strings";
import { getLocalDataAsync, saveLocalDataAsync } from "../../helpers/storage";
import { STORAGE_KEYS } from "../../constants/configs";
import { getWalletBalanceByWalletAddress } from "../../services/blockchain.service";
import "./send-tokens.css";

const SendTokens = () => {
  // --- get the navigate function from useNavigate hook ---
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // --- states to store send wallet address and amount ---
  const [sendWalletAddress, setSendWalletAddress] = useState("");
  const [sendAmount, setSendAmount] = useState(0);
  const [isValidWalletAddress, setIsValidWalletAddress] = useState(false);
  const [isShowErrorMsg, setIsShowErrorMsg] = useState(false);
  const [walletValidationErrorMsg, setWalletValidationErrorMsg] = useState("");
  const [isCanContinue, setIsCanContinue] = useState(false);
  const [isTokenBalanceLoading, setIsTokenBalanceLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState(null);

  // --- Fetch Wallet Address ---
  const fetchWalletAddress = async () => {
    try {
      const walletAddressResponse = await getLocalDataAsync(
        STORAGE_KEYS.WALLET_ADDRESS
      );
      setWalletAddress(walletAddressResponse);
    } catch (error) {
      console.log(`${ERROR_RETRIEVE_WALLET_ADDRESS} - ${error}`);
      messageApi.error(ERROR_RETRIEVE_WALLET_ADDRESS);
    }
  };

  // --- Fetch Token Balance ---
  const fetchCurrentTokenBalance = async () => {
    try {
      setIsTokenBalanceLoading(true);
      const balance = await getWalletBalanceByWalletAddress(walletAddress);
      setTokenBalance(balance);
    } catch (error) {
      console.log("Error while fetching token balance", error);
      setTokenBalance(0);
    } finally {
      setIsTokenBalanceLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchCurrentTokenBalance();
    }
  }, [walletAddress]);

  // --- Handle Next Button ---
  const handleSendTokensNext = async () => {
    try {
      await saveLocalDataAsync(STORAGE_KEYS.SENDING_AMOUNT, sendAmount);
      await saveLocalDataAsync(
        STORAGE_KEYS.SENDER_WALLET_ADDRESS,
        sendWalletAddress
      );
      navigate("/confirm-tokens-send");
    } catch (error) {
      console.log(`${ERROR_SAVING_TX_DETAILS}: ${error}`);
    }
  };

  // --- Handle Cancel ---
  const handleCancel = async () => {
    try {
      await saveLocalDataAsync(STORAGE_KEYS.SENDING_AMOUNT, "");
      await saveLocalDataAsync(STORAGE_KEYS.SENDER_WALLET_ADDRESS, "");
      navigate("/");
    } catch (error) {
      console.log(`${ERROR_RESETTING_TX_VALUES}: ${error}`);
    }
  };

  const handleWalletAddressInputChange = (e) => {
    const address = e.target.value;
    setSendWalletAddress(address);
    setIsShowErrorMsg(false);
  };

  // --- Validate Wallet Address ---
  useEffect(() => {
    setIsValidWalletAddress(isAddress(sendWalletAddress));
    if (isAddress(sendWalletAddress)) {
      setIsShowErrorMsg(false);
      setWalletValidationErrorMsg("");
    } else {
      setIsShowErrorMsg(true);
      setWalletValidationErrorMsg("Please enter a valid wallet address.");
    }
  }, [sendWalletAddress]);

  // --- Check if user can continue ---
  useEffect(() => {
    if (
      sendWalletAddress &&
      parseFloat(sendAmount) > 0 &&
      isValidWalletAddress
    ) {
      setIsCanContinue(true);
    } else {
      setIsCanContinue(false);
    }
  }, [sendWalletAddress, sendAmount, isValidWalletAddress]);

  useEffect(() => {
    fetchWalletAddress();
  }, []);

  return (
    <Container className="send-tokens-page">
      {contextHolder}
      <h2 className="send-tokens-title">Send Tokens</h2>
      <div className="send-tokens-form">
        <Row>
          <Col>
            <div className="send-tokens__balance">
              <div className="send-tokens__balance__label">Your Balance</div>
              <div className="send-tokens__balance__amount">
                {isTokenBalanceLoading ? <Spin /> : tokenBalance}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="send-tokens__wallet-address">
              <Input
                placeholder="Enter Wallet Address"
                value={sendWalletAddress}
                onChange={handleWalletAddressInputChange}
              />
              {isShowErrorMsg && (
                <div className="send-tokens__error">
                  {walletValidationErrorMsg}
                </div>
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="send-tokens__amount">
              <Input
                placeholder="Enter Amount"
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
              />
            </div>
          </Col>
        </Row>
        <div className="send-tokens__buttons">
          <Button className="cancel-button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="primary"
            disabled={!isCanContinue}
            onClick={handleSendTokensNext}
          >
            Next
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default SendTokens;
