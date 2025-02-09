import { Tag, Button, Spin, message } from "antd";
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
import { DEFAULT_WALLET_ADDRESS, STORAGE_KEYS } from "../../constants/configs";
import "./home.css";
import { useAuthContext } from '@asgardeo/auth-react';

const HomePage = () => {
    const navigate = useNavigate();
    const [walletAddress, setWalletAddress] = useState(DEFAULT_WALLET_ADDRESS);
    const [isAccountCopied, setIsAccountCopied] = useState(false);
    const [tokenBalance, setTokenBalance] = useState(0);
    const [isTokenBalanceLoading, setIsTokenBalanceLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    // additonal code begins here

    const { isAuthenticated, getBasicUserInfo, getIDToken } = useAuthContext();


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
            setWalletAddress(walletAddressResponse);
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
            const tokenBalance = await getWalletBalanceByWalletAddress(walletAddress);
            setTokenBalance(tokenBalance);
        } catch (error) {
            setTokenBalance(0);
        } finally {
            setIsTokenBalanceLoading(false);
        }
    };

    // --- fetch token balance when wallet address changes ---
    useEffect(() => {
        if (walletAddress !== DEFAULT_WALLET_ADDRESS && walletAddress) {
            fetchCurrentTokenBalance();
        }
    }, [walletAddress]);

    // --- fetch token balance in every 5 seconds ---  
    useEffect(() => {
        const interval = setInterval(() => {
            if (walletAddress !== DEFAULT_WALLET_ADDRESS && walletAddress) {
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

    return (
        <div className="home-container">
            {contextHolder}
            <h1 className="title">Wallet Overview</h1>
            <div className="wallet-details">
                <Tag icon={<WalletOutlined />} color="blue">{walletAddress}</Tag>
                <CopyToClipboard text={walletAddress} onCopy={handledCopyAccount}>
                    <Button icon={isAccountCopied ? <CheckOutlined /> : <CopyOutlined />} />
                </CopyToClipboard>
            </div>
            <div className="balance-section">
                <h2>{TOTAL_BALANCE}</h2>
                {isTokenBalanceLoading ? (
                    <Spin indicator={<LoadingOutlined />} />
                ) : (
                    <NumericFormat value={tokenBalance} displayType={'text'} thousandSeparator={true} />
                )}
            </div>
            <div className="actions">
                <Button type="primary" icon={<SendOutlined />} onClick={() => navigate("/send")}>{SEND}</Button>
                <Button icon={<DownloadOutlined />} onClick={() => navigate("/request")}>{REQUEST}</Button>
            </div>
        </div>
    );
};

export default HomePage;