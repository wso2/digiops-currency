import React, { useState, useEffect } from "react"
import { Row, Col, Alert, Button, message } from "antd";
import { LeftOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import WalletAddressCopy from "../../components/home/phrase-copy";
import PhraseCopy from "../../components/home/phrase-copy";
import { useNavigate } from "react-router-dom";
import {
  RECOVERY_PHRASE,
  RECOVERY_PHRASE_WARNING_TEXT,
  CONTINUE,
  WALLET_ADDRESS,
  WALLET_PRIVATE_KEY,
  ERROR_READING_WALLET_DETAILS,
  WALLET_SECURE_TIPS,
  SHOW_WALLET_ADDRESS
} from "../../constants/strings";
import { STORAGE_KEYS } from "../../constants/configs";
import { getLocalDataAsync } from "../../helpers/storage";


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
          <Row justify="space-between" align="middle">
            <Col flex="none">
              <LeftOutlined
                style={{ fontSize: "18px", cursor: "pointer", marginTop: "5px" }}
                onClick={handleClick}
              />
            </Col>
            <Col flex="auto">
              <span className="recovery-phrase-header">{RECOVERY_PHRASE}</span>
            </Col>
          </Row>
    
          <div className="create-wallet-content container">
            <div className="mt-5">
              <Alert
                message={RECOVERY_PHRASE_WARNING_TEXT}
                type="error"
                showIcon
                icon={<ExclamationCircleFilled />}
                style={{
                  color: "red",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center"
                }}
                iconStyle={{ marginRight: "100px" }}
              />
            </div>
            <div className="mt-3">
              <Alert
                message={
                  <span className="custom-alert-message">
                    <ul style={{ textAlign: "left" }}>
                      {WALLET_SECURE_TIPS.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </span>
                }
                icon={<ExclamationCircleFilled />}
                showIcon
                style={{
                  color: "green",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center"
                }}
                type="success"
              />
            </div>
            <div className="mt-3">
              <WalletAddressCopy
                address={walletAddress}
                topic={WALLET_ADDRESS}
                buttonText={SHOW_WALLET_ADDRESS}
              />
            </div>
            <div className="mt-3">
              <WalletAddressCopy
                address={walletPrivateKey}
                topic={WALLET_PRIVATE_KEY}
              />
            </div>
            <div className="mt-3">
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