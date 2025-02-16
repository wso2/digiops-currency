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
import React, { useEffect, useState } from 'react';
import { RightOutlined, ArrowUpOutlined, ArrowDownOutlined, SmileOutlined } from "@ant-design/icons";
import { Avatar, Spin, Card, Col, Row, Tag } from 'antd';
import { getLocalDataAsync } from '../../helpers/storage';
import { getTransactionHistory } from '../../services/blockchain.service';
import { ERROR_READING_WALLET_DETAILS, RECENT_ACTIVITIES, WSO2_TOKEN } from '../../constants/strings';
import { STORAGE_KEYS } from '../../constants/configs';
import NoRecentActivities from '../no-recent-activities/no-recent-activities';
import RecentTransactionCard from '../recent-transaction-card/recent-transaction-card';
import moment from 'moment';
import './recent-activities.css';

// --- Recent Activities Component ---
const RecentActivities = () => {
    const [walletAddress, setWalletAddress] = useState('');
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [isRecentTransactionsLoading, setIsRecentTransactionsLoading] = useState(false);

    // --- Fetch Wallet Address ---
    const fetchWalletAddress = async () => {
        try {
            const walletAddressResponse = await getLocalDataAsync(STORAGE_KEYS.WALLET_ADDRESS);
            setWalletAddress(walletAddressResponse);
        } catch (error) {
            console.log(ERROR_READING_WALLET_DETAILS);
        }
    };

    // --- Fetch Wallet Address when page mounts ---
    useEffect(() => {
        fetchWalletAddress();
    }, []);

    // --- Fetch Transaction History ---
    const fetchTransactionHistory = async () => {
        try {
            setIsRecentTransactionsLoading(true);
            const transactionHistory = await getTransactionHistory(walletAddress);
            setRecentTransactions(transactionHistory);
            console.log("this is the transaction history --- > **", transactionHistory);
        } catch (error) {
            console.log(error);
        } finally {
            setIsRecentTransactionsLoading(false);
        }
    };

    useEffect(() => {
        if (walletAddress) {
            fetchTransactionHistory();
        }
    }, [walletAddress]);

    // Fetch recent transactions in the background
    const fetchRecentTransactionsDoInBackground = async () => {
        try {
            const recentTransactions = await getTransactionHistory(walletAddress);
            setRecentTransactions(recentTransactions);
        } catch (error) {
            console.log("Error fetching recent transactions", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (walletAddress) {
                fetchRecentTransactionsDoInBackground();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [walletAddress]);

    return (
        <div className="recent-activities-container">
            <h3>{RECENT_ACTIVITIES}</h3>
            <div className="recent-activities-content">
                {isRecentTransactionsLoading ? (
                    <div className="recent-activities-loading">
                        <Spin size='large' />
                    </div>
                ) : 
                    recentTransactions.length === 0 ? (
                        <NoRecentActivities />
                       
                      ) : (
                    recentTransactions.map((transaction, index) => (
                        <RecentTransactionCard key={index} transaction={transaction} />
                        
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentActivities;
