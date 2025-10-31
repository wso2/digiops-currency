// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import React, { useState, useEffect } from "react";
import { CopyOutlined, CheckOutlined, EyeOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Input, Button } from "antd";
import { showToast } from "../../helpers/alerts";
import { COPIED, SUCCESS } from "../../constants/strings";
import { WALLET_PRIVATE_KEY } from "../../constants/strings";

function WalletAddressCopy(props) {
  const { address, topic, buttonText = "Show Private Key" } = props;

  const [walletAddressCopied, setWalletAddressCopied] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  useEffect(() => {
    setShowPrivateKey(false);
  }, []);

  const handleCopyWalletAddress = async () => {
    showToast(SUCCESS, `${topic} ${COPIED}`);
    setWalletAddressCopied(true);
    setTimeout(() => {
      setWalletAddressCopied(false);
    }, 2000);
  };

  return (
    <>
      <div>
        <div className="d-flex justify-content-start sub-heading">
          <span className="wallet-copy-topic mb-2">{topic}</span>
        </div>
        {!showPrivateKey ? (
          <div className="d-flex justify-content-center">
            <Button
              className={`secondary-button ${topic === WALLET_PRIVATE_KEY ? 'sensitive-outline' : ''}`}
              onClick={() => setShowPrivateKey(true)}
              icon={<EyeOutlined />}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                minWidth: '160px',
                padding: '0 20px'
              }}
            >
              {buttonText}
            </Button>
          </div>
        ) : (
          <Input
            id="inputField"
            value={address}
            addonAfter={
              <CopyToClipboard text={address} onCopy={handleCopyWalletAddress}>
                <Button
                  size="small"
                  className="copy-button"
                  icon={
                    !walletAddressCopied ? <CopyOutlined /> : <CheckOutlined />
                  }
                />
              </CopyToClipboard>
            }
            readOnly
          />
        )}
      </div>
    </>
  );
}

export default WalletAddressCopy;
