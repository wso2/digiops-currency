// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import './Profile.css';

import {
  useEffect,
  useState,
} from 'react';

import {
  Avatar,
  Button,
  Spin,
  Tag,
  Tooltip,
} from 'antd';
import { SHA256 } from 'crypto-js';
import Identicon from 'identicon.js';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useNavigate } from 'react-router-dom';

import {
  CheckOutlined,
  CopyOutlined,
  LoadingOutlined,
  QrcodeOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import WalletAddressCopy from '../../components/Home/WalletAddressCopy';
import { COLORS } from '../../constants/colors';
import { STORAGE_KEYS } from '../../constants/configs';
import {
  ERROR_READING_WALLET_DETAILS,
  ERROR_WHEN_LOGGING_OUT,
  LOGOUT,
  SUCCESS,
  ERROR,
  OK,
  WALLET_ADDRESS_COPIED,
  WALLET_PRIVATE_KEY,
  SHOW_WALLET_ADDRESS
} from '../../constants/strings';
import { showToast, showAlertBox } from '../../helpers/alerts';
import {
  getLocalDataAsync,
  saveLocalDataAsync,
} from '../../helpers/storage';
import { getUserWalletAddresses, setWalletAsPrimary } from '../../services/wallet.service';
import { Modal } from 'antd';
import { QRCodeSVG } from 'qrcode.react';

function Profile() {
  const navigate = useNavigate();

  const [isAccountCopied, setIsAccountCopied] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletPrivateKey, setWalletPrivateKey] = useState("");
  const [userWallets, setUserWallets] = useState([]);
  const [isLoadingWallets, setIsLoadingWallets] = useState(true);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isSettingPrimary, setIsSettingPrimary] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

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

  const fetchUserWallets = async () => {
    try {
      setIsLoadingWallets(true);
      const wallets = await getUserWalletAddresses();
      setUserWallets(wallets);
    } catch (error) {
      console.log(`${ERROR_READING_WALLET_DETAILS} - ${error}`);
      showAlertBox(ERROR, ERROR_READING_WALLET_DETAILS, OK);
      setUserWallets([]);
    } finally {
      setIsLoadingWallets(false);
    }
  };

  useEffect(() => {
    fetchWalletDetails();
   
    fetchUserWallets();
  }, []);

  const generateAvatar = (seed) => {
    const options = {
      size: 80
    };
    const hash = SHA256(seed).toString();
    const data = new Identicon(hash.slice(0, 15), options).toString();
    return "data:image/png;base64," + data;
  };

  const avatarUrl = generateAvatar(walletAddress || "default");

  const handleCopyAccount = async () => {
    showToast(SUCCESS, WALLET_ADDRESS_COPIED);
    setIsAccountCopied(true);
    setTimeout(() => {
      setIsAccountCopied(false);
    }, 2000);
  };

  const handleSetAsPrimary = async () => {
    if (!selectedWallet || selectedWallet.defaultWallet) return;
    
    setIsSettingPrimary(true);
    try {
      await setWalletAsPrimary(selectedWallet.walletAddress);
      showToast(SUCCESS, "Successfully set as primary wallet");
      
      await fetchUserWallets();
      
      setIsWalletModalOpen(false);
      setSelectedWallet(null);
    } catch (error) {
      console.error("Error setting wallet as primary:", error);
      showAlertBox(ERROR, "Failed to set wallet as primary", OK);
    } finally {
      setIsSettingPrimary(false);
    }
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
    <div className="mx-4 wallet-details">
      {/* Wallet Details Modal */}
      <Modal
        open={isWalletModalOpen}
        onCancel={() => setIsWalletModalOpen(false)}
        footer={null}
        title="Wallet Details"
      >
        {selectedWallet && (
          <div>
            <div style={{ marginTop: '15px', fontWeight: 600, wordBreak: 'break-all', marginBottom: '8px', fontSize: '0.85rem' }}>
              {selectedWallet.walletAddress}
            </div>
            <div style={{ fontSize: '12px', color: COLORS.GRAY_LIGHT, marginBottom: '12px' }}>
              Created on: {new Date(selectedWallet.createdOn).toLocaleString()}
            </div>
            <div style={{ marginBottom: '12px' }}>
              {selectedWallet.defaultWallet ? (
                <Tag color="green">Primary Wallet</Tag>
              ) : (
                <div></div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <Button
                type="primary"
                disabled={selectedWallet.defaultWallet || isSettingPrimary}
                loading={isSettingPrimary}
                onClick={handleSetAsPrimary}
                style={{
                  minWidth: '160px',
                  backgroundColor: selectedWallet.defaultWallet ? COLORS.GRAY_LIGHT : COLORS.ORANGE_PRIMARY,
                  color: selectedWallet.defaultWallet ? COLORS.GRAY_DARK : COLORS.WHITE,
                  border: selectedWallet.defaultWallet ? `1px solid ${COLORS.GRAY_LIGHT}` : undefined
                }}
              >
                {selectedWallet.defaultWallet ? "Primary Wallet" : "Set as Primary"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* QR Code Modal */}
      <Modal
        open={isQrModalOpen}
        onCancel={() => setIsQrModalOpen(false)}
        footer={null}
        title="Wallet QR Code"
        centered
      >
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ marginBottom: '16px', fontSize: '14px', color: COLORS.GRAY_MEDIUM, fontWeight: '500' }}>
            Share this QR code to receive coins
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <QRCodeSVG
              value={walletAddress}
              size={200}
              level="M"
            />
          </div>
        <div className="d-flex justify-content-center">
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
        </div>
      </Modal>

      <div className="profile-header">
        <h4>Profile</h4>
      </div>
      {/* <div className="d-flex justify-content-center mt-4">
        <Avatar size={80} src={avatarUrl} />
      </div> */}
      <div className="mt-4">
        <div className="profile-title">Public Wallet Address</div>
        <div className="d-flex justify-content-center mt-2">
          <Button
            type="primary"
            className="primary-button"
            icon={<QrcodeOutlined />}
            onClick={() => setIsQrModalOpen(true)}
            style={{
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: '700',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              minWidth: '180px'
            }}
          >
            {SHOW_WALLET_ADDRESS}
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <WalletAddressCopy
          address={walletPrivateKey}
          topic={WALLET_PRIVATE_KEY}
        />
      </div>
      {/* User Wallets Section */}
      <div className="mt-4 mb-5">
        <div className="wallet-list-title">My Wallets</div>
        {isLoadingWallets ? (
          <div className="mt-2 d-flex justify-content-center">
            <Spin
              indicator={<LoadingOutlined style={{ color: COLORS.ORANGE_PRIMARY }} />}
              style={{ margin: "10px" }}
            />
          </div>
        ) : userWallets.length === 0 ? (
          <div className="mt-2 text-muted">No wallets found.</div>
        ) : (
          <div className="wallet-list mt-2">
            {userWallets.map((wallet, idx) => (
                <div key={wallet.walletAddress + idx} className="wallet-list-item mb-3 p-3" style={{ border: `1px solid ${COLORS.BORDER_LIGHT}`, borderRadius: '8px', position: 'relative', cursor: 'pointer' }}
                  onClick={() => { setSelectedWallet(wallet); setIsWalletModalOpen(true); }}>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="wallet-address" style={{ fontWeight: 'bold', wordBreak: 'break-all' }}>
                    {wallet.walletAddress.slice(0, 12)}...{wallet.walletAddress.slice(-12)}
                  </span>
                  {wallet.defaultWallet && (
                    <Tag color="green" style={{ marginLeft: '8px', fontSize: '11px' }}>Primary</Tag>
                  )}
                </div>

                <div className="wallet-created-on" style={{ fontSize: '11px', color: COLORS.GRAY_MEDIUM, marginTop: '4px', textAlign: 'left' }}>
                  Created on: {new Date(wallet.createdOn).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="logout-button">
        <div className="d-flex justify-content-center">
          <Button 
            className="default-button" 
            onClick={handleLogout}
            icon={<LogoutOutlined />}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              minWidth: '140px',
              padding: '0 24px'
            }}
          >
            {LOGOUT}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
