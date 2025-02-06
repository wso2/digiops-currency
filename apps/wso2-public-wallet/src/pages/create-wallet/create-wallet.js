import {Avatar ,Button, message } from "antd";
import React, { useEffect, useState } from "react";
import Wso2MainImg from "../../assets/images/wso2_main.png";
import { ethers } from "ethers";
import WalletPhrase from "../wallet-phrase/wallet-parse";
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


function CreateWallet() {

    // --- states to store wallet creation status ---
    const [walletCreateLoading, setWalletCreateLoading] = useState(false);
    const [isWalletCreated, setIsWalletCreated] = useState(false);
    const [walletPhrase, setWalletPhrase] = useState("");

    // --- message api to show alerts ---
    const [messageApi, contextHolder] = message.useMessage();
  
    // --- navigate to home page ---
    const navigate = useNavigate();
  

    // --- check if wallet exists ---
    const getCurrentWalletIFExists = async () => {
      const walletAddress = await getLocalDataAsync(STORAGE_KEYS.WALLET_ADDRESS);
      if (walletAddress) {
        navigate("/");
      }
    };
  

    // --- fetch wallet details ---
    useEffect(() => {
      getCurrentWalletIFExists();
    }, []);
  
    // --- handle restore wallet ---
    const handleRestoreWallet = () => {
      navigate("/recover-wallet");
    };
  
    // --- handle create new wallet ---
    const handleCreateNewWallet = async () => {
      setWalletCreateLoading(true);
      try {
        const wallet = ethers.Wallet.createRandom();
        if (wallet.address) {
          updateUserWalletAddress(wallet.address)
            .then(async () => {
              await saveLocalDataAsync(STORAGE_KEYS.WALLET_ADDRESS, wallet.address);
              await saveLocalDataAsync(STORAGE_KEYS.PRIVATE_KEY, wallet.privateKey); 
              setTimeout(async () => {
                await messageApi.success(SUCCESS, SUCCESS_WALLET_CREATED);
                setIsWalletCreated(true);
                setWalletCreateLoading(false);
              }, 5000);
              setWalletPhrase(wallet.mnemonic.phrase);
            })
            .catch(async (error) => {
              console.log(error);
              await messageApi.error(ERROR_CREATING_WALLET);
              setWalletCreateLoading(false);
            });
        }
      } catch (error) {
        await messageApi.error(ERROR_CREATING_WALLET);
        setIsWalletCreated(false);
        setWalletCreateLoading(false);
      }
    };
  
    // --- handle go back ---
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
                >
                  {CREATE_A_NEW_WALLET}
                </Button>
                <span
                  onClick={handleRestoreWallet}
                  className="wallet-create-restore-wallet mt-4"
                >
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
  
