// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import React, { useState, useEffect } from "react";
import { Row, Col, Alert, Button, message, Modal } from "antd";
import { ExclamationCircleFilled, ArrowRightOutlined } from "@ant-design/icons";
import "./WalletPhrase.css";
import WalletAddressCopy from "../../components/Home/WalletAddressCopy";
import PhraseCopy from "../../components/Home/PhraseCopy";
import { useNavigate } from "react-router-dom";
import {
  RECOVERY_PHRASE,
  RECOVERY_PHRASE_WARNING_TEXT,
  CONTINUE,
  WALLET_ADDRESS,
  WALLET_PRIVATE_KEY,
  ERROR_READING_WALLET_DETAILS,
  WALLET_SECURE_TIPS,
  SHOW_WALLET_ADDRESS,
  CONFIRM_RECOVERY_PHRASE
} from "../../constants/strings";
import { COLORS } from "../../constants/colors";
import { STORAGE_KEYS } from "../../constants/configs";
import { getLocalDataAsync } from "../../helpers/storage";

function WalletPhrase(props) {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletPrivateKey, setWalletPrivateKey] = useState("");
  const { walletPhrase, onGoBack } = props;
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

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

  useEffect(() => {
    fetchWalletDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    Modal.confirm({
      title: "Backing Up Recovery Phrase",
      content: (
        <div>
          <p>{CONFIRM_RECOVERY_PHRASE}</p>
        </div>
      ),
      okText: "Yes, I have saved it",
      cancelText: "Go Back",
      cancelButtonProps: {
        style: {
          backgroundColor: COLORS.ORANGE_PRIMARY, borderColor: COLORS.ORANGE_PRIMARY, color: "#fff"
        }
      },
      okButtonProps: {
        style: {
          backgroundColor: "#fff", borderColor: "#333", borderWidth: ".1px", color: "#000"
        }
      },
      onOk() {
        navigate("/");
      },
      centered: true,
    });
  };

  const handleClick = () => {
    onGoBack(false);
  };

  return (
    <div className="wallet-phrase">
      {contextHolder}
      <Row justify="center" align="middle">
        <Col flex="auto">
          <span className="recovery-phrase-header">{RECOVERY_PHRASE}</span>
        </Col>
      </Row>

      <div className="create-wallet-content container">
        <div className="mt-4">
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
        {/* <div className="mt-3">
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
        </div> */}
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
        <div className="mt-4 mb-1">
          <Button
            block
            disabled={walletPrivateKey === "" || walletAddress === ""}
            className="primary-button"
            size="large"
            onClick={handleContinue}
            icon={<ArrowRightOutlined />}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {CONTINUE}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WalletPhrase;
