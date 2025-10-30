// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { Avatar, Button } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, UndoOutlined } from "@ant-design/icons";
import "./CreateWallet.css";
import Wso2MainImg from "../../assets/images/wso2_main.png";
import { ethers } from "ethers";
import WalletPhrase from "../WalletPhrase/WalletPhrase";
import { useNavigate } from "react-router-dom";
import {
  WSO2_WALLET,
  CREATE_A_NEW_WALLET,
  RESTORE_EXISTING_WALLET,
  SUCCESS,
  SUCCESS_WALLET_CREATED,
  OK,
  ERROR,
  ERROR_CREATING_WALLET,
} from "../../constants/strings";
import { STORAGE_KEYS } from "../../constants/configs";
import { saveLocalDataAsync, getLocalDataAsync } from "../../helpers/storage";
import { updateUserWalletAddress } from "../../services/wallet.service";
import { showAlertBox, showToast } from "../../helpers/alerts";

function CreateWallet() {
  const [walletCreateLoading, setWalletCreateLoading] = useState(false);
  const [isWalletCreated, setIsWalletCreated] = useState(false);
  const [walletPhrase, setWalletPhrase] = useState("");

  const navigate = useNavigate();

  const getCurrentWalletIFExists = async () => {
    const walletAddress = await getLocalDataAsync(STORAGE_KEYS.WALLET_ADDRESS);
    if (walletAddress) {
      navigate("/");
    }
  };

  useEffect(() => {
    getCurrentWalletIFExists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRestoreWallet = () => {
    navigate("/recover-wallet");
  };

  const handleCreateNewWallet = async () => {
    setWalletCreateLoading(true);
    try {
      const wallet = ethers.Wallet.createRandom();
      if (wallet.address) {
        updateUserWalletAddress(wallet.address)
          .then(async () => {
            await saveLocalDataAsync(STORAGE_KEYS.WALLET_ADDRESS, wallet.address);
            await saveLocalDataAsync(STORAGE_KEYS.PRIVATE_KEY, wallet.privateKey);
            
            setWalletPhrase(wallet.mnemonic.phrase);
            showToast(SUCCESS, SUCCESS_WALLET_CREATED);

            setTimeout(() => {
              setIsWalletCreated(true);
              setWalletCreateLoading(false);
            }, 1000);
          })
          .catch(async (error) => {
            console.log(error);
            showAlertBox(ERROR, ERROR_CREATING_WALLET, OK);
            setWalletCreateLoading(false);
          });
      }
    } catch (error) {
      showAlertBox(ERROR, ERROR_CREATING_WALLET, OK);
      setIsWalletCreated(false);
      setWalletCreateLoading(false);
    }
  };

  const handleGoBack = (value) => {
    setIsWalletCreated(value);
  };

  return (
    <div>
      {!isWalletCreated ? (
        <div className="wallet-create-top-margin">
          <div className="wallet-create-content">
            <Avatar size={100} src={Wso2MainImg} />
            <span className="wallet-create-topic mt-3 mb-5">{WSO2_WALLET}</span>

            <div className="footer-wrapper-buttons-section container">
              <Button
                block
                className="primary-button create-wallet-button mb-4"
                size="large"
                onClick={handleCreateNewWallet}
                loading={walletCreateLoading}
                icon={<PlusOutlined />}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {CREATE_A_NEW_WALLET}
              </Button>
              <span
                onClick={handleRestoreWallet}
                className="wallet-create-restore-wallet mt-4"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <UndoOutlined />
                {RESTORE_EXISTING_WALLET}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <WalletPhrase walletPhrase={walletPhrase} onGoBack={handleGoBack} />
      )}
    </div>
  );
}

export default CreateWallet;
