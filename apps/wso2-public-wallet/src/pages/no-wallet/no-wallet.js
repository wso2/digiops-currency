import React from 'react';
import { WarningOutlined } from '@ant-design/icons';
import './no-wallet.css';
import { useNavigate } from 'react-router-dom';

const NoWallet = () => {

    // --- navigate to create wallet page ---
    const navigate = useNavigate();


    // --- handle navigation to create wallet page ---

    const handledNavigation = () => {
        navigate('/create-wallet');
    }
    
    return (
        <div className="no-wallet-container">
            <WarningOutlined className="no-wallet-icon" />
            <h1 className="no-wallet-title">No Wallet Detected</h1>
            <p className="no-wallet-text">Please connect your wallet to proceed.</p>

            {/* button to navigate to the create wallet page */}   
            <button className="no-wallet-button" onClick={handledNavigation}>Create Wallet</button>
        </div>
    );
};

export default NoWallet;
