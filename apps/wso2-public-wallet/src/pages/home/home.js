import { message, Modal, Spin } from "antd";
import { FaWallet, FaCopy, FaCheck, FaPaperPlane, FaDownload } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import {
    DownloadOutlined,
    WalletOutlined,
    CopyOutlined,
    CheckOutlined,
    LoadingOutlined,
    SendOutlined
} from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";
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
    COPIED
} from "../../constants/strings";
import { STORAGE_KEYS } from "../../constants/configs";
import "./home.css";
import { useAuthContext } from '@asgardeo/auth-react';
import NoWallet from "../no-wallet/no-wallet";
import RecentActivities from "../../components/home/recent-activities";
// import SendTokens from "../../modals/send-tokens/send-tokens";

const HomePage = () => {
    const navigate = useNavigate();
    const [walletAddress, setWalletAddress] = useState(null);
    const [isAccountCopied, setIsAccountCopied] = useState(false);
    const [tokenBalance, setTokenBalance] = useState(0);
    const [isTokenBalanceLoading, setIsTokenBalanceLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    // const [isSendModalVisible, setIsSendModalVisible] = useState(false);

    // additonal code begins here

    const { isAuthenticated, getBasicUserInfo, getIDToken } = useAuthContext();

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        handledCopyAccount();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    useEffect(() => {
        getBasicUserInfo().then((response) => {
            console.log(response);
        });

        getIDToken().then((response) => {
            console.log(response);
        }
        );
    }, []);

    // additonal code ends here


    // --- fetch wallet address ---
    const fetchWalletAddress = async () => {
        try {
            const walletAddressResponse = await getLocalDataAsync(
                STORAGE_KEYS.WALLET_ADDRESS
            );
            if (walletAddressResponse) {
                setWalletAddress(walletAddressResponse);
            }

            console.log("this is wallet address response --- > ", walletAddressResponse);
            console.log("this is wallet address availability --- > ", walletAddress == null);

            console.log("this is wallet address --- > ", walletAddress);
        } catch (error) {
            messageApi.error(ERROR_RETRIEVE_WALLET_ADDRESS);
        }
    };

    // --- fetch wallet address when page mounts ---
    useEffect(() => {
        fetchWalletAddress();
    }, []);


    // --- fetch current token balance ---
    const fetchCurrentTokenBalance = async () => {
        try {
            setIsTokenBalanceLoading(true);
            console.log("this is wallet address --- > ", walletAddress);
            const tokenBalance = await getWalletBalanceByWalletAddress(walletAddress);
            console.log("this is token balance --- > ", tokenBalance);
            setTokenBalance(tokenBalance);
        } catch (error) {
            setTokenBalance(0);
        } finally {
            setIsTokenBalanceLoading(false);
        }
    };

    // --- fetch token balance when wallet address changes ---
    useEffect(() => {
        if (walletAddress) {
            fetchCurrentTokenBalance();
        }
    }, [walletAddress]);

    // --- fetch token balance in every 5 seconds ---  
    useEffect(() => {
        const interval = setInterval(() => {
            if (walletAddress) {
                getWalletBalanceByWalletAddress(walletAddress)
                    .then(setTokenBalance)
                    .catch(() => setTokenBalance(0));
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [walletAddress]);

    // --- handle copy account ---
    const handledCopyAccount = () => {
        setIsAccountCopied(true);
        messageApi.success(WALLET_ADDRESS_COPIED, 1, () => {
            setIsAccountCopied(false);
        });
    };

    const handleSendClick = () => {
        navigate("/send-tokens");
    };

    //   const handleSendModalOk = () => {
    //     console.log("Sending to:", sendAddress, "Amount:", sendAmount);
    //     message.success("Transaction initiated!");
    //     setIsSendModalVisible(false);
    //   };

    // const handleSendModalCancel = () => {
    //     setIsSendModalVisible(false);
    // };

    return (

        (walletAddress == null) ? <NoWallet /> :
            <div className="wallet-container">
                <h1 className="title">Wallet Overview</h1>
                <div className="wallet-details">
                    <div className="wallet-address">
                        <FaWallet className="icon" />
                        <span>{walletAddress}</span>
                        <button className="copy-btn" onClick={handleCopy}>
                            {copied ? <FaCheck className="copied" /> : <FaCopy />}
                        </button>
                    </div>
                </div>
                <div className="balance-section">
                    <h2>Balance</h2>
                    {isTokenBalanceLoading ? (
                        <Spin size="large" />
                    ) : (
                        <NumericFormat value={tokenBalance} displayType={'text'} thousandSeparator={true} />
                    )}
                </div>
                <div className="actions">
                    <button className="action-btn send" onClick={() => handleSendClick()}>
                        <FaPaperPlane /> Send
                    </button>
                    {/* <button className="action-btn request" onClick={() => navigate("/request")}>
                    <FaDownload /> Request
                </button> */}
                </div>
                {/* recent activities */}
                <div className="recent-activities-container">
                    <RecentActivities />
                </div>

                {/* send modal */}
                {/* <SendTokens isOpen={isSendModalVisible} onClose={handleSendModalCancel} /> */}
            </div>
    );

};

export default HomePage;