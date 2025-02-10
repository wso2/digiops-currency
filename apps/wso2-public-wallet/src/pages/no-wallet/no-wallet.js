import React from 'react';
import { WarningOutlined } from '@ant-design/icons';
import './no-wallet.css';

const NoWallet = () => {
    return (
        <div className="no-wallet-container">
            <WarningOutlined className="no-wallet-icon" />
            <h1 className="no-wallet-title">No Wallet Detected</h1>
            <p className="no-wallet-text">Please connect your wallet to proceed.</p>
        </div>
    );
};

export default NoWallet;
