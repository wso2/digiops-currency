import React, { useState, useEffect } from "react";
import { Avatar, Button, Tag, Tooltip, Card, Typography, Divider } from "antd";
import Identicon from "identicon.js";
import { SHA256 } from "crypto-js";
import { CopyOutlined, CheckOutlined, LogoutOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import WalletAddressCopy from "../../components/home/wallet-address-copy";
import {
  WALLET_PRIVATE_KEY,
  LOGOUT,
  COPY_TO_CLIPBOARD,
  WALLET_ADDRESS_COPIED,
  OK,
} from "../../constants/strings";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import { getLocalDataAsync, saveLocalDataAsync } from "../../helpers/storage";
import { STORAGE_KEYS } from "../../constants/configs";
import { showAlertBox } from "../../helpers/alerts";

const { Title, Text } = Typography;

function Profile() {
  const navigate = useNavigate();

  const [isAccountCopied, setIsAccountCopied] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletPrivateKey, setWalletPrivateKey] = useState("");

  useEffect(() => {
    const fetchWalletDetails = async () => {
      try {
        const walletAddressResponse = await getLocalDataAsync(STORAGE_KEYS.WALLET_ADDRESS);
        const privateKeyResponse = await getLocalDataAsync(STORAGE_KEYS.PRIVATE_KEY);
        setWalletAddress(walletAddressResponse);
        setWalletPrivateKey(privateKeyResponse);
      } catch (error) {
        console.error("Error reading wallet details: ", error);
      }
    };
    fetchWalletDetails();
  }, []);

  const generateAvatar = (seed) => {
    const options = { size: 80 };
    const hash = SHA256(seed).toString();
    const data = new Identicon(hash.slice(0, 15), options).toString();
    return "data:image/png;base64," + data;
  };

  const avatarUrl = generateAvatar(walletAddress || "avatar1");

  const handleCopyAccount = async () => {
    await showAlertBox(COPY_TO_CLIPBOARD, WALLET_ADDRESS_COPIED, OK);
    setIsAccountCopied(true);
    setTimeout(() => setIsAccountCopied(false), 2000);
  };

  const handleLogout = async () => {
    try {
      await saveLocalDataAsync(STORAGE_KEYS.WALLET_ADDRESS, "");
      await saveLocalDataAsync(STORAGE_KEYS.PRIVATE_KEY, "");
      navigate("/create-wallet");
    } catch (error) {
      console.error("Error when logging out: ", error);
    }
  };

  return (
    <div className="profile-container">
      <Card className="profile-card" bordered={false}>
        <div className="avatar-container">
          <Avatar size={80} src={avatarUrl} />
          <Title level={4} className="profile-title">Wallet Profile</Title>
        </div>
        <Divider />
        <div className="wallet-section">
          <Text strong>Wallet Address</Text>
          <CopyToClipboard text={walletAddress} onCopy={handleCopyAccount}>
            <Tooltip title={isAccountCopied ? "Copied" : "Copy to Clipboard"}>
              <Tag className="wallet-tag">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-6)}
                {isAccountCopied ? (
                  <CheckOutlined className="icon-copied" />
                ) : (
                  <CopyOutlined className="icon-copy" />
                )}
              </Tag>
            </Tooltip>
          </CopyToClipboard>
        </div>
        <WalletAddressCopy address={walletPrivateKey} topic={WALLET_PRIVATE_KEY} />
        <Divider />
        <Button type="primary" danger icon={<LogoutOutlined />} block onClick={handleLogout}>
          {LOGOUT}
        </Button>
      </Card>
    </div>
  );
}

export default Profile;
