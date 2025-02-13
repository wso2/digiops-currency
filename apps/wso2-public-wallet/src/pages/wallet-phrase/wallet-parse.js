import React, { useState, useEffect } from "react";
import { Row, Col, Alert, Button, message } from "antd";
import { LeftOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import PhraseCopy from "../../components/home/phrase-copy";
import { useNavigate } from "react-router-dom";
import {
  RECOVERY_PHRASE,
  RECOVERY_PHRASE_WARNING_TEXT,
  CONTINUE,
  WALLET_SECURE_TIPS,
  ERROR_READING_WALLET_DETAILS
} from "../../constants/strings";
import { STORAGE_KEYS } from "../../constants/configs";
import { getLocalDataAsync } from "../../helpers/storage";
import './wallet-parse.css'; // Importing the CSS file

const WalletPhrase = (props) => {

  // --- states to store wallet address and private key ---
  const [walletAddress, setWalletAddress] = useState("");
  const [walletPrivateKey, setWalletPrivateKey] = useState("");
  const { walletPhrase, onGoBack } = props;

  // --- navigate to home page ---
  const navigate = useNavigate();

  // --- message api to show alerts ---
  const [messageApi, contextHolder] = message.useMessage();

  // --- fetch wallet details ---
  const fetchWalletDetails = async () => {
    try {
      const walletAddressResponse = await getLocalDataAsync(
        STORAGE_KEYS.WALLET_ADDRESS
      );
      const privateKeyResponse = await getLocalDataAsync(
        STORAGE_KEYS.PRIVATE_KEY
      );
      setWalletPrivateKey(privateKeyResponse);
      setWalletAddress(walletAddressResponse);
    } catch (err) {
      console.log(`${ERROR_READING_WALLET_DETAILS} - ${err}`);
      messageApi.error(ERROR_READING_WALLET_DETAILS);
    }
  };

  // --- fetch wallet details when page mounts ---
  useEffect(() => {
    fetchWalletDetails();
  }, []);

  // --- handle continue ---
  const handleContinue = () => {
    navigate("/");
  }

  // --- handle back ---
  const handleClick = () => {
    onGoBack(false);
  }

  return (
    <div className="wallet-phrase">
      {contextHolder}
     

      <div className="create-wallet-content">
        <div className="mt-5">
          <Alert
            message={RECOVERY_PHRASE_WARNING_TEXT}
            type="error"
            showIcon
            icon={<ExclamationCircleFilled />}
            className="error-alert"
          />
        </div>
        <div className="mt-3">
          <Alert
            message={
              <span className="custom-alert-message">
                <ul>
                  {WALLET_SECURE_TIPS.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </span>
            }
            icon={<ExclamationCircleFilled />}
            showIcon
            className="success-alert"
            type="success"
          />
        </div>
        
        <div className="mt-3 phrase-copy-container">
          <PhraseCopy phrase={walletPhrase} />
        </div>
        <div className="mt-5 mb-5">
          <Button
            block
            disabled={walletPrivateKey === "" || walletAddress === ""}
            className="primary-button"
            size="large"
            onClick={handleContinue}
          >
            {CONTINUE}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WalletPhrase;
