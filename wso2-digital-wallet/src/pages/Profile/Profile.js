// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import React, { useState, useEffect } from "react";
import { Avatar, Button, Tag, Tooltip } from "antd";
import Identicon from "identicon.js";
import { SHA256 } from "crypto-js";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import WalletAddressCopy from "../../components/Home/WalletAddressCopy";
import {
  WALLET_PRIVATE_KEY,
  LOGOUT,
  ERROR_READING_WALLET_DETAILS,
  ERROR_WHEN_LOGGING_OUT,
  COPY_TO_CLIPBOARD,
  WALLET_ADDRESS_COPIED,
  OK
} from "../../constants/strings";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { getLocalDataAsync, saveLocalDataAsync } from "../../helpers/storage";
import { STORAGE_KEYS } from "../../constants/configs";
import { showAlertBox } from "../../helpers/alerts";

function Profile() {
  const navigate = useNavigate();

  const [isAccountCopied, setIsAccountCopied] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletPrivateKey, setWalletPrivateKey] = useState("");

  const fetchWalletDetails = async () => {
    try {
      const walletAddressResponse = await getLocalDataAsync(
        STORAGE_KEYS.WALLET_ADDRESS
      );
      const privateKeyResponse = await getLocalDataAsync(
        STORAGE_KEYS.PRIVATE_KEY
      );
      setWalletAddress(walletAddressResponse);
      setWalletPrivateKey(privateKeyResponse);
    } catch (error) {
      console.log(`${ERROR_READING_WALLET_DETAILS} - ${error}`);
    }
  };

  useEffect(() => {
    fetchWalletDetails();
  }, []);

  const generateAvatar = (seed) => {
    const options = {
      size: 80 // Adjust the size of the identicon image
    };
    const hash = SHA256(seed).toString();
    const data = new Identicon(hash.slice(0, 15), options).toString();
    return "data:image/png;base64," + data;
  };

  const avatar1Url = generateAvatar("avatar1");

  const handleCopyAccount = async () => {
    await showAlertBox(COPY_TO_CLIPBOARD, WALLET_ADDRESS_COPIED, OK);
    setIsAccountCopied(true);
    setTimeout(() => {
      setIsAccountCopied(false);
    }, 2000);
  };

  const handleLogout = async () => {
    try {
      await saveLocalDataAsync(STORAGE_KEYS.WALLET_ADDRESS, "");
      await saveLocalDataAsync(STORAGE_KEYS.PRIVATE_KEY, "");
    } catch (error) {
      console.log(`${ERROR_WHEN_LOGGING_OUT} - ${error}`);
    }
    navigate("/create-wallet");
  };

  return (
    <div className="mx-4">
      <div className="d-flex justify-content-center mt-4">
        <Avatar size={80} src={avatar1Url} />
      </div>
      <div className="d-flex justify-content-center mt-2">
        <CopyToClipboard text={walletAddress} onCopy={handleCopyAccount}>
          <Tooltip title={isAccountCopied ? "Copied" : "Copy to Clipboard"}>
            <Tag className="total-balance-wallet-address mt-2 d-flex">
              {walletAddress}
              <div>
                {!isAccountCopied ? (
                  <div>
                    <CopyOutlined style={{ marginLeft: "5px" }} />
                  </div>
                ) : (
                  <CheckOutlined style={{ marginLeft: "5px" }} />
                )}
              </div>
            </Tag>
          </Tooltip>
        </CopyToClipboard>
      </div>
      <div className="mt-5">
        <WalletAddressCopy
          address={walletPrivateKey}
          topic={WALLET_PRIVATE_KEY}
        />
      </div>
      <div className="logout-button">
        <Button className="primary-button container" onClick={handleLogout}>
          {LOGOUT}
        </Button>
      </div>
    </div>
  );
}

export default Profile;
