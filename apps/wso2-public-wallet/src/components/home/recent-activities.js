import React, { useEffect, useState } from 'react';
import { RightOutlined, ArrowUpOutlined, ArrowDownOutlined, LoadingOutlined, ExportOutlined } from "@ant-design/icons";
import { Avatar, Spin } from 'antd';
import {
    getLocalDataAsync
} from '../../helpers/storage';
import { getTransactionHistory } from '../../services/blockchain.service';
import {    ERROR_READING_WALLET_DETAILS,
    RECENT_ACTIVITIES,
    TRANSFER,
    WSO2_TOKEN
} from '../../constants/strings';
import { STORAGE_KEYS } from '../../constants/configs';

// --- recent activities component ---
const RecentActivities = () => {

    // --- states to store transaction history and loading status ---
    const [walletAddress, setWalletAddress] = useState('');
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [isRecentTransactionsLoading, setIsRecentTransactionsLoading] =
        useState(false);

    // --- fetch wallet address ---
    const fetchWalletAddress = async () => {
        try {
            const walletAddressResponse = await getLocalDataAsync(
                STORAGE_KEYS.WALLET_ADDRESS
            );
            setWalletAddress(walletAddressResponse);
        } catch (error) {
            console.log(ERROR_READING_WALLET_DETAILS);
        }
    };

    // --- fetch wallet address when page mounts ---
    useEffect(() => {
        fetchWalletAddress();
    }, []);

    // --- fetch transaction history ---
    const fetchTransactionHistory = async () => {
        try {
            setIsRecentTransactionsLoading(true);
            const transactionHistory = await getTransactionHistory(walletAddress);
            setRecentTransactions(transactionHistory);
        } catch (error) {
            console.log(error);
        } finally {
            setIsRecentTransactionsLoading(false);
        }
    };

    // --- fetch wallet address when page mounts ---
    useEffect(() => {   
        if(walletAddress){
            fetchTransactionHistory();
        }
    }, [walletAddress]);

    const fetchRecentTransactionsDoInBackground = async () => {
        try {
            const recentTransactions = await getTransactionHistory(walletAddress);
            setRecentTransactions(recentTransactions);
        } catch (error) {
            console.log("error while fetching recent transactions", error);
        }
    };

 // --- fetch wallet address when page mounts ---
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

   

    return (
        <div className="recent-activities-container">
            <div className="recent-activities-header">
                {RECENT_ACTIVITIES}
            </div>
            <div className="recent-activities-content">
                {isRecentTransactionsLoading ? (
                    <div className="recent-activities-loading">
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    </div>
                ) : (
                    recentTransactions.map((transaction, index) => (
                        <div key={index} className="recent-activity-item">
                            <div className="recent-activity-item-left">
                                <Avatar
                                    size={40}
                                    src={transaction.from === walletAddress ? transaction.to : transaction.from}
                                />
                            </div>
                            <div className="recent-activity-item-center">
                                <div className="recent-activity-item-center-top">
                                    <span>
                                        {transaction.from === walletAddress ? "Sent" : "Received"}
                                    </span>
                                    <span>
                                        {transaction.from === walletAddress ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                    </span>
                                </div>
                                <div className="recent-activity-item-center-bottom">
                                    <span>
                                        {transaction.from === walletAddress ? transaction.to : transaction.from}
                                    </span>
                                    <span>
                                        {transaction.amount} {WSO2_TOKEN}
                                    </span>
                                </div>
                            </div>
                            <div className="recent-activity-item-right">
                                <RightOutlined />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}


export default RecentActivities;