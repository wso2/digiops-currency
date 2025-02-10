import React, { useEffect, useState } from 'react';
import { RightOutlined, ArrowUpOutlined, ArrowDownOutlined, LoadingOutlined } from "@ant-design/icons";
import { Avatar, Spin, Card, Col, Row, Tag } from 'antd';
import { getLocalDataAsync } from '../../helpers/storage';
import { getTransactionHistory } from '../../services/blockchain.service';
import { ERROR_READING_WALLET_DETAILS, RECENT_ACTIVITIES, WSO2_TOKEN } from '../../constants/strings';
import { STORAGE_KEYS } from '../../constants/configs';
import moment from 'moment';
import './recent-activities.css';
// --- recent activities component ---
const RecentActivities = () => {
    const [walletAddress, setWalletAddress] = useState('');
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [isRecentTransactionsLoading, setIsRecentTransactionsLoading] = useState(false);

    // --- fetch wallet address ---
    const fetchWalletAddress = async () => {
        try {
            const walletAddressResponse = await getLocalDataAsync(STORAGE_KEYS.WALLET_ADDRESS);
            setWalletAddress(walletAddressResponse);
        } catch (error) {
            console.log(ERROR_READING_WALLET_DETAILS);
        }
    };

    useEffect(() => {
        fetchWalletAddress();
    }, []);

    // --- fetch transaction history ---
    const fetchTransactionHistory = async () => {
        try {
            setIsRecentTransactionsLoading(true);
            const transactionHistory = await getTransactionHistory(walletAddress);
            setRecentTransactions(transactionHistory);
            console.log("this is the transation history --- > **" ,transactionHistory);
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

    // Fetch recent transactions in background
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
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                    </div>
                ) : (
                    recentTransactions.map((transaction, index) => (
                        <Card key={index} className="recent-activity-item" bordered={false}>
                            <Row gutter={[16, 16]} align="middle">
                                <Col>
                                    <Avatar
                                        size={50}
                                        src={transaction.direction === "send" ? transaction.to : transaction.from}
                                    />
                                </Col>
                                <Col flex="auto">
                                    <div className="transaction-info">
                                        <div className="transaction-header">
                                            <span className="transaction-direction">
                                                {transaction.direction === 'send' ? "Sent" : "Received"}
                                            </span>
                                            <Tag color={transaction.from === walletAddress ? "green" : "blue"}>
                                                {transaction.direction === 'send' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                                            </Tag>
                                        </div>
                                        <div className="transaction-footer">
                                            <span className="transaction-address">
                                                {transaction.direction === 'send' ? transaction.to : transaction.from}
                                            </span>
                                            <span className="transaction-amount">
                                                {transaction.tokenAmount} {WSO2_TOKEN}
                                            </span>
                                        </div>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="transaction-time">
                                        {moment(transaction.timestamp).format('MMM DD, hh:mm A')}
                                    </div>
                                </Col>
                                <Col>
                                    <RightOutlined />
                                </Col>
                            </Row>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentActivities;
