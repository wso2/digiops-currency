import React, { useEffect, useState } from 'react';
import { RightOutlined, ArrowUpOutlined, ArrowDownOutlined, LoadingOutlined } from "@ant-design/icons";
import { Avatar, Spin, Card, Col, Row, Tag } from 'antd';
import { getLocalDataAsync } from '../../helpers/storage';
import { getTransactionHistory } from '../../services/blockchain.service';
import { ERROR_READING_WALLET_DETAILS, RECENT_ACTIVITIES, WSO2_TOKEN } from '../../constants/strings';
import { STORAGE_KEYS } from '../../constants/configs';
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
                                            <Tag
                                                className="transaction-tag"
                                                style={{
                                                    backgroundColor: transaction.direction === 'send' ? '#FFE5D1' : '#DFFFE2',
                                                    border: `2px solid ${transaction.direction === 'send' ? '#B6551A' : '#147A3D'}`,
                                                    borderRadius: '50%',
                                                    padding: '6px',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '32px',
                                                    height: '32px'
                                                }}
                                            >
                                                {transaction.direction === 'send' ? (
                                                    <ArrowUpOutlined style={{ color: '#B6551A', fontSize: '18px' }} />
                                                ) : (
                                                    <ArrowDownOutlined style={{ color: '#147A3D', fontSize: '18px' }} />
                                                )}
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
