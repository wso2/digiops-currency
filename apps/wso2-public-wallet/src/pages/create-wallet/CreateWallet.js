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

import { Button, message } from "antd";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import WalletPhrase from "../wallet-phrase/WalletParse";
import { useNavigate } from "react-router-dom";
import {
  CREATE_A_NEW_WALLET,
  RESTORE_EXISTING_WALLET,
  ERROR_CREATING_WALLET,
} from "../../constants/Strings";
import { STORAGE_KEYS } from "../../constants/Configs";
import { saveLocalDataAsync, getLocalDataAsync } from "../../helpers/Storage";
import "./CreateWallet.css";

function CreateWallet() {
  const [walletCreateLoading, setWalletCreateLoading] = useState(false);
  const [isWalletCreated, setIsWalletCreated] = useState(false);
  const [walletPhrase, setWalletPhrase] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingWallet = async () => {
      const walletAddress = await getLocalDataAsync(STORAGE_KEYS.WALLET_ADDRESS);
      if (walletAddress) navigate("/");
    };
    checkExistingWallet();
  }, [navigate]);

  const handleRestoreWallet = () => navigate("/recover-wallet");

  const handleCreateNewWallet = async () => {
    setWalletCreateLoading(true);
    try {
      const wallet = ethers.Wallet.createRandom();
      await saveLocalDataAsync(STORAGE_KEYS.WALLET_ADDRESS, wallet.address);
      await saveLocalDataAsync(STORAGE_KEYS.PRIVATE_KEY, wallet.privateKey);
      setWalletPhrase(wallet.mnemonic.phrase);
      setIsWalletCreated(true);
    } catch (error) {
      console.error(error);
      await messageApi.error(ERROR_CREATING_WALLET);
    } finally {
      setWalletCreateLoading(false);
    }
  };

  return (
    <div className="wallet-create-top-margin">
      {contextHolder}
      {!isWalletCreated ? (
        <div className="wallet-create-content">
          <div className="footer-wrapper-buttons-section">
            <Button
              block
              className="primary-button create-wallet-button"
              size="large"
              onClick={handleCreateNewWallet}
              loading={walletCreateLoading}
            >
              {CREATE_A_NEW_WALLET}
            </Button>
            <span onClick={handleRestoreWallet} className="wallet-create-restore-wallet">
              {RESTORE_EXISTING_WALLET}
            </span>
          </div>
        </div>
      ) : (
        <WalletPhrase walletPhrase={walletPhrase} onGoBack={setIsWalletCreated} />
      )}
    </div>
  );
}

export default CreateWallet;
