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
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Input, Button, message } from 'antd';
import { COPIED, OK } from '../../constants/strings';
import { defaultIconPrefixCls } from 'antd/es/config-provider';

const WalletAddressCopy = (props) => {

    //---  get address , topic and  button text from props ---
    const { address, topic, buttonText = "Show Private Key" } = props;
    const [walletAddressCopied, setWalletAddressCopied] = useState(false);

    // --- message api to show alerts ---   
    const [messageApi, contextHolder] = message.useMessage();

    // state to store the copied status
    const [showPrivateKey, setShowPrivateKey] = useState(false);

    //--- set show private key to false when bundling ---
    useEffect(() => {
        setShowPrivateKey(false);
    }, []);

    //--- handle copy address ---
    const handleCopyAddress = async () => {
        await messageApi.success(COPIED);
        setWalletAddressCopied(true);
        setTimeout(() => {
            setWalletAddressCopied(false);
        }, 2000)
    };


    // --- return the wallet address copy component ---
    return (
        <div>
            {contextHolder}
            <div className="d-flex justify-content-start">
                <span className="wallet-copy-topic mb-2">{topic}</span>
            </div>
            {!showPrivateKey ? (
                <Button className='w-100 primary-button' onClick={() => setShowPrivateKey(true)}>{buttonText}</Button>
            ) : (
                <Input
                    id="inputField"
                    value={address}
                    addonAfter={
                        <CopyToClipboard text={address} onCopy={handleCopyAddress}>
                            <Button
                                size="small"
                                className="copy-button"
                                icon={
                                    !walletAddressCopied ? <CopyOutlined /> : <CheckOutlined />
                                }
                            />
                        </CopyToClipboard>
                    }
                    readOnly
                />
            )}
        </div>
    );
}

export default WalletAddressCopy;
