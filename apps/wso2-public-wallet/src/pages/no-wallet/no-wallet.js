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
