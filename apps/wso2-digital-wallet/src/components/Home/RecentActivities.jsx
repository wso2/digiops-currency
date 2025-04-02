// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import React, { useEffect, useState } from "react";
import { RightOutlined, ArrowUpOutlined, ArrowDownOutlined, LoadingOutlined } from "@ant-design/icons";
import { Avatar, Spin } from "antd";
import { getLocalDataAsync } from "../../helpers/storage";
import { getRecentTransactions } from "../../services/blockchain.service";
import {
    ERROR_READING_WALLET_DETAILS,
    RECENT_ACTIVITIES,
    TRANSFER,
    WSO2_TOKEN
} from '../../constants/strings'
import { STORAGE_KEYS } from "../../constants/configs";

function RecentActivities() {

    const [walletAddress, setWalletAddress] = useState('')
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [isRecentTransactionsLoading, setIsRecentTransactionsLoading] =
        useState(false);

    const orangeColor = "#EE7B2F";

    const fetchWalletAddress = async () => {
        try {
            const walletAddressResponse = await getLocalDataAsync(STORAGE_KEYS.WALLET_ADDRESS);
            setWalletAddress(walletAddressResponse)
        } catch (error) {
            console.log(`${ERROR_READING_WALLET_DETAILS}: ${error}`);
            setWalletAddress('')
        }
    }

    useEffect(() => {
        fetchWalletAddress()
    }, [])

    useEffect(() => {
        if (walletAddress) {
            fetchRecentTransactions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletAddress]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (walletAddress) {
                fetchRecentTransactionsDoInBackground();
            }
            // Place your function here.
        }, 5000);

        // This is important, as it clears the interval when the component is unmounted.
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletAddress]);


    const fetchRecentTransactions = async () => {
        try {
            setIsRecentTransactionsLoading(true);
            const recentTransactions = await getRecentTransactions(walletAddress);
            setRecentTransactions(recentTransactions);
            setIsRecentTransactionsLoading(false);
        } catch (error) {
            setIsRecentTransactionsLoading(false);
            console.log("error while fetching recent transactions", error);
        }
    };

    const fetchRecentTransactionsDoInBackground = async () => {
        try {
            const recentTransactions = await getRecentTransactions(walletAddress);
            setRecentTransactions(recentTransactions);
        } catch (error) {
            console.log("error while fetching recent transactions", error);
        }
    };

    function TransactionList({ transactions }) {
        if (transactions.length > 0) {
            return (
                <>
                    {transactions.map((transaction, index) => (
                        <div key={index} className="mt-4">
                            <div className="d-flex justify-content-between">
                                <div className="d-flex">
                                    <Avatar
                                        shape="square"
                                        size={40}
                                        icon={transaction.direction === "send" ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                        className={transaction.direction === "send" ? "red-text" : "green-text"}
                                    />
                                    <div className="d-flex flex-column mx-3">
                                        <span className="recent-activity-topic">{transaction.direction.charAt(0).toUpperCase() + transaction.direction.slice(1)} {TRANSFER}</span>
                                        <span className="recent-activity-time">{transaction.timestamp}</span>
                                    </div>
                                </div>
                                <span className={`recent-activity-value ${transaction.direction === "send" ? "red-text" : "green-text"}`}>{transaction.direction === "send" ? "-" : "+"}{transaction.tokenAmount} {WSO2_TOKEN}</span>
                            </div>
                        </div>
                    ))}
                </>
            );
        } else {
            return (
                <div className="mt-5">
                    <p className="text-muted">no recent activities</p>
                </div>
            )
        }
    }

    return (
        <div className=" recent-activities-widget">

            <div className="recent-activities-widget-inner">
                <div className="mt-3">
                    <div className="d-flex justify-content-between">
                        <div className = "sub-heading">
                            <h4>{RECENT_ACTIVITIES}</h4>
                        </div>
                        <div>
                            <RightOutlined />
                        </div>
                    </div>
                </div>

                {
                    isRecentTransactionsLoading ? (
                        <div className="mt-5">
                            <Spin indicator={<LoadingOutlined style={{ color: orangeColor }} />} style={{ margin: "10px " }} />
                        </div>
                    ) : (

                        <div className="recent-activity-container">
                            <TransactionList transactions={recentTransactions} />
                        </div>

                    )
                }

            </div>
        </div>
    )
}

export default RecentActivities;