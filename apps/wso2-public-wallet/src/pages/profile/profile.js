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
import {
  Avatar,
  Button,
  Tag,
  Tooltip,
  Card,
  Typography,
  Divider,
  message,
} from "antd";
import Identicon from "identicon.js";
import { SHA256 } from "crypto-js";
import { CopyOutlined, CheckOutlined, LogoutOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  WALLET_PRIVATE_KEY,
  LOGOUT,
  WALLET_ADDRESS_COPIED,
} from "../../constants/Strings";
import { useNavigate } from "react-router-dom";
import { getLocalDataAsync, saveLocalDataAsync } from "../../helpers/Storage";
import { STORAGE_KEYS } from "../../constants/Configs";
import { useAuthContext } from "@asgardeo/auth-react";
import NoWallet from "../no-wallet/NoWallet";
import "./Profile.css";

const { Title, Text } = Typography;

function Profile() {
  // --- get the navigate function from useNavigate hook ---
  const navigate = useNavigate();
  const { signOut } = useAuthContext();

  // --- get the message api and context holder from the message hook ---
  const [messageApi, contextHolder] = message.useMessage();

  // --- set the initial state for account copied status ---
  const [isAccountCopied, setIsAccountCopied] = useState(false);
  const [isPrivateKryCopied, setIsPrivateKryCopied] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletPrivateKey, setWalletPrivateKey] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  // --- fetch the wallet details from local storage ---
  useEffect(() => {
    const fetchWalletDetails = async () => {
      try {
        const walletAddressResponse = await getLocalDataAsync(
          STORAGE_KEYS.WALLET_ADDRESS
        );
        const privateKeyResponse = await getLocalDataAsync(
          STORAGE_KEYS.PRIVATE_KEY
        );
        if (walletAddressResponse) {
          setWalletAddress(walletAddressResponse);
          setWalletPrivateKey(privateKeyResponse);
        }
      } catch (error) {
        console.error("Error reading wallet details: ", error);
      }
    };
    fetchWalletDetails();
  }, []);

  // --- generate avatar based on the wallet address ---
  const generateAvatar = (seed) => {
    const options = { size: 80 };
    const hash = SHA256(seed).toString();
    const data = new Identicon(hash.slice(0, 15), options).toString();
    return "data:image/png;base64," + data;
  };

  // --- generate avatar url ---
  const avatarUrl = generateAvatar(walletAddress || "avatar1");

  // --- handle copy account ---
  const handleCopyAccount = async () => {
    await messageApi.open({
      content: WALLET_ADDRESS_COPIED,
      duration: 3,
      key: "copyAccount",
    });
    setIsAccountCopied(true);
    setTimeout(() => setIsAccountCopied(false), 2000);
  };

  // --- handle copy private key ---
  const handlePrivateKeyCopy = async () => {
    await messageApi.open({
      content: WALLET_PRIVATE_KEY,
      duration: 3,
      key: "copyPrivateKey",
    });
    setIsPrivateKryCopied(true);
    setTimeout(() => setIsPrivateKryCopied(false), 2000);
  };

  // --- handle logout ---
  const handleLogout = async () => {
    try {
      await saveLocalDataAsync(STORAGE_KEYS.WALLET_ADDRESS, "");
      await saveLocalDataAsync(STORAGE_KEYS.PRIVATE_KEY, "");
      messageApi.open({
        content: "Logged out successfully",
        duration: 3,
        key: "logout",
      });

      await signOut();
      console.log("Logged out successfully from asgardeo ---->>>>");
      navigate("/create-wallet");
    } catch (error) {
      console.error("Error when logging out: ", error);
    }
  };

  return !walletAddress ? (
    <NoWallet />
  ) : (
    <div className="profile-container">
      {contextHolder}
      <Card className="profile-card" bordered={false}>
        <div className="avatar-container">
          <Avatar size={80} src={avatarUrl} />
          <Title level={4} className="profile-title">
            Wallet Profile
          </Title>
        </div>
        <Divider />
        <div className="wallet-section">
          <Text strong className="wallet-text">
            Wallet Address
          </Text>
          <CopyToClipboard
            className="wallet-address-text-container"
            text={walletAddress}
            onCopy={handleCopyAccount}
          >
            <Tooltip title={isAccountCopied ? "Copied" : "Copy to Clipboard"}>
              <Tag className="wallet-tag">
                {walletAddress}
                {isAccountCopied ? (
                  <CheckOutlined className="icon-copied" />
                ) : (
                  <CopyOutlined className="icon-copy" />
                )}
              </Tag>
            </Tooltip>
          </CopyToClipboard>
          <Text strong className="wallet-text">
            Wallet Private Key
          </Text>
          {showPrivateKey ? (
            <div className="wallet-address-text-container">
              <CopyToClipboard
                className="wallet-address-text-container"
                text={walletPrivateKey}
                onCopy={handlePrivateKeyCopy}
              >
                <Tooltip
                  title={isPrivateKryCopied ? "Copied" : "Copy to Clipboard"}
                >
                  <Tag className="wallet-tag">
                    {walletPrivateKey}
                    {isPrivateKryCopied ? (
                      <CheckOutlined className="icon-copied" />
                    ) : (
                      <CopyOutlined className="icon-copy" />
                    )}
                  </Tag>
                </Tooltip>
              </CopyToClipboard>
              <Button
                className="show-private-key-button"
                onClick={() => setShowPrivateKey(false)}
              >
                Hide Private Key
              </Button>
            </div>
          ) : (
            <Button
              className="show-private-key-button"
              onClick={() => setShowPrivateKey(true)}
            >
              Show Private Key
            </Button>
          )}

          <Divider />
        </div>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          block
          onClick={handleLogout}
        >
          {LOGOUT}
        </Button>
      </Card>
    </div>
  );
}

export default Profile;
