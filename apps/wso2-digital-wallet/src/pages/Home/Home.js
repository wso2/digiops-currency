import { Tag, Tooltip, Spin, message, Modal, Button, Input } from "antd";
import React, { useState, useEffect } from "react";
import { getEllipsisTxt } from "../../helpers/formatter";
import {
  DownloadOutlined,
  WalletOutlined,
  CopyOutlined,
  CheckOutlined,
  LoadingOutlined,
  SendOutlined,
} from "@ant-design/icons";
import RecentActivities from "../../components/Home/RecentActivities";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { getLocalDataAsync } from "../../helpers/storage";
import { getWalletBalanceByWalletAddress } from "../../services/blockchain.service";
import { NumericFormat } from "react-number-format";
import {
  TOTAL_BALANCE,
  SEND,
  REQUEST,
  BUY,
  ERROR_RETRIEVE_WALLET_ADDRESS,
  WALLET_ADDRESS_COPIED,
  OK,
  COPIED,
} from "../../constants/strings";
import { DEFAULT_WALLET_ADDRESS, STORAGE_KEYS } from "../../constants/configs";
import { showAlertBox } from "../../helpers/alerts";

function Home() {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(DEFAULT_WALLET_ADDRESS);
  const [messageApi, contextHolder] = message.useMessage();
  const [isAccountCopied, setIsAccountCopied] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [isTokenBalanceLoading, setIsTokenBalanceLoading] = useState(false);
  const [isSendModalVisible, setIsSendModalVisible] = useState(false);
  const [sendAddress, setSendAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");

  const fetchWalletAddress = async () => {
    try {
      const walletAddressResponse = await getLocalDataAsync(
        STORAGE_KEYS.WALLET_ADDRESS
      );
      setWalletAddress(walletAddressResponse);
    } catch (error) {
      console.log(`${ERROR_RETRIEVE_WALLET_ADDRESS} - ${error}`);
      messageApi.error(ERROR_RETRIEVE_WALLET_ADDRESS);
    }
  };

  useEffect(() => {
    fetchWalletAddress();
  }, []);

  useEffect(() => {
    if (walletAddress !== DEFAULT_WALLET_ADDRESS && walletAddress) {
      fetchCurrentTokenBalance();
    }
  }, [walletAddress]);

  const fetchCurrentTokenBalance = async () => {
    try {
      setIsTokenBalanceLoading(true);
      const tokenBalance = await getWalletBalanceByWalletAddress(walletAddress);
      setTokenBalance(tokenBalance);
      setIsTokenBalanceLoading(false);
    } catch (error) {
      console.debug("DEBUG: error while fetching token balance", error);
      setIsTokenBalanceLoading(false);
      setTokenBalance(0);
    }
  };

  const handleCopyAccount = async () => {
    await showAlertBox(COPIED, WALLET_ADDRESS_COPIED, OK);
    setIsAccountCopied(true);
    setTimeout(() => {
      setIsAccountCopied(false);
    }, 2000);
  };

  const handleSendClick = () => {
    setIsSendModalVisible(true);
  };

  const handleSendModalOk = () => {
    console.log("Sending to:", sendAddress, "Amount:", sendAmount);
    message.success("Transaction initiated!");
    setIsSendModalVisible(false);
  };

  const handleSendModalCancel = () => {
    setIsSendModalVisible(false);
  };

  return (
    <div className="home-container">
      {contextHolder}
      <div className="wallet-balance-details mt-4">
        <span className="total-balance-tag">{TOTAL_BALANCE}</span>
        <span className="total-balance-value">
          {isTokenBalanceLoading ? (
            <Spin indicator={<LoadingOutlined style={{ color: "#EE7B2F" }} />} />
          ) : (
            <NumericFormat value={tokenBalance} displayType={"text"} thousandSeparator={true} />
          )}
        </span>
        <CopyToClipboard text={walletAddress} onCopy={handleCopyAccount}>
          <Tooltip title={isAccountCopied ? "Copied" : "Copy to Clipboard"}>
            <Tag className="total-balance-wallet-address mt-2">
              {getEllipsisTxt(walletAddress, 13)} {isAccountCopied ? <CheckOutlined /> : <CopyOutlined />}
            </Tag>
          </Tooltip>
        </CopyToClipboard>
        <div className="d-flex justify-content-between mt-4">
          <div onClick={handleSendClick}>
            <div className="total-balance-icons">
              <SendOutlined rotate={320} style={{ fontSize: "18px", cursor: "pointer" }} />
            </div>
            <div className="total-balance-action">{SEND}</div>
          </div>
        </div>
      </div>
      <RecentActivities />

      {/* Send Modal */}
      <Modal
        title="Send Tokens"
        visible={isSendModalVisible}
        onOk={handleSendModalOk}
        onCancel={handleSendModalCancel}
        okText="Send"
        cancelText="Cancel"
      >
        <Input
          placeholder="Recipient Address"
          value={sendAddress}
          onChange={(e) => setSendAddress(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <Input
          placeholder="Amount"
          value={sendAmount}
          type="number"
          onChange={(e) => setSendAmount(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default Home;
