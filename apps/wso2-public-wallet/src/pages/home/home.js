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
import { message, Modal, Spin , Tag, Tooltip} from "antd";
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
import WalletOverview from "../../components/wallet-overview/wallet-overview";
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
        message.success(COPIED);
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
        <>
        <div className="home-container">
           
            <WalletOverview walletAddress={walletAddress} tokenBalance={tokenBalance} isTokenBalanceLoading={isTokenBalanceLoading} handleSendClick={handleSendClick} handleCopy={handleCopy} isAccountCopied={isAccountCopied} />
       
                {/* recent activities */}
                <div className="recent-activities-container">
                    <RecentActivities />
                </div>

                {/* send modal */}
                {/* <SendTokens isOpen={isSendModalVisible} onClose={handleSendModalCancel} /> */}
            </div>
        </>
            
    );

};

export default HomePage;