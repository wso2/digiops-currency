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

import React, { useState } from "react";
import { Input, Button, Row, Col, Typography, Card, Spin } from "antd";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import WalletAddressCopy from "../../components/home/wallet-address-copy";
import { saveLocalDataAsync } from "../../helpers/storage";
import { showAlertBox } from "../../helpers/alerts";
import {
  RECOVER_WALLET,
  PASTE_PHRASE_HERE,
  RECOVER_YOUR_WALLET,
  CONTINUE,
  WALLET_ADDRESS,
  WALLET_PRIVATE_KEY,
  OK,
  ERROR,
  RECOVER_WALLET_ERROR,
  SHOW_WALLET_ADDRESS,
} from "../../constants/strings";
import { PASS_PHRASE_LENGTH, STORAGE_KEYS } from "../../constants/configs";
import "./recover-wallet.css";

const { Title, Text } = Typography;

const RecoverWallet = () => {
  const [wordList, setWordList] = useState(Array(12).fill(""));
  const [walletAddress, setWalletAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [continueRecover, setContinueRecover] = useState(false);
  const [walletRecovered, setWalletRecovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (index, value) => {
    const words = value.trim().split(" ");
    const newWordList = [...wordList];

    if (words.length === 12) {
      for (let i = 0; i < 12; i++) {
        newWordList[i] = words[i] || "";
      }
      setContinueRecover(true);
    } else {
      newWordList[index] = value;
      setContinueRecover(false);
    }
    setWordList(newWordList);
  };

  const handleRecover = async () => {
    setLoading(true);
    try {
      const phrase = wordList.join(" ");
      const wallet = ethers.Wallet.fromMnemonic(phrase);
      setWalletAddress(wallet.address);
      setPrivateKey(wallet.privateKey);
      await saveLocalDataAsync(STORAGE_KEYS.WALLET_ADDRESS, wallet.address);
      await saveLocalDataAsync(STORAGE_KEYS.PRIVATE_KEY, wallet.privateKey);
      setWalletRecovered(true);
    } catch (error) {
      setWalletRecovered(false);
      showAlertBox(ERROR, RECOVER_WALLET_ERROR, OK);
    }
    setLoading(false);
  };

  return (
    <div className="recover-wallet-container">
      <Card className="recover-wallet-card">
        <Title level={3} className="text-center">
          {RECOVER_YOUR_WALLET}
        </Title>
        <Text className="description-text">{PASTE_PHRASE_HERE}</Text>
        <Row gutter={[8, 8]} className="phrase-input-container">
          {wordList.map((word, index) => (
            <Col span={8} key={index}>
              <Input
                value={word}
                onChange={(event) =>
                  handleInputChange(index, event.target.value)
                }
                className="phrase-input"
                placeholder={`${index + 1}`}
              />
            </Col>
          ))}
        </Row>
        <div className="action-buttons">
          {!walletRecovered ? (
            <Button
              type="primary"
              block
              disabled={!continueRecover}
              onClick={handleRecover}
              loading={loading}
              className="recover-button"
            >
              {RECOVER_WALLET}
            </Button>
          ) : (
            <>
              <WalletAddressCopy
                address={walletAddress}
                topic={WALLET_ADDRESS}
                buttonText={SHOW_WALLET_ADDRESS}
                className="wallet-info"
              />
              <WalletAddressCopy
                address={privateKey}
                topic={WALLET_PRIVATE_KEY}
                className="wallet-info"
              />
              <Button
                type="primary"
                block
                onClick={() => navigate("/")}
                className="continue-button"
              >
                {CONTINUE}
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RecoverWallet;
