import React, { useEffect, useState } from 'react';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Input, Button } from 'antd';
import { showAlertBox } from '../../helpers/alerts';
import { COPIED, OK } from '../../constants/strings';
import { defaultIconPrefixCls } from 'antd/es/config-provider';


const WalletAddressCopy = (props) => {

    //---  get address , topic and  button text from props ---
    const { address, topic, buttonText = "Show Private Key" } = props;
    const [walletAddressCopied, setWalletAddressCopied] = useState(false);

    // state to store the copied status
    const [showPrivateKey, setShowPrivateKey] = useState(false);

    //--- set show private key to false when bundling ---
    useEffect(() => {
        setShowPrivateKey(false);
    }, []);

    //--- handle copy address ---
    const handleCopyAddress = async () => {
        await showAlertBox(COPIED, `${topic} ${COPIED}`, OK);
        setWalletAddressCopied(true);
        setTimeout(() => {
            setWalletAddressCopied(false);
        }, 2000)
    };
    

    // --- return the wallet address copy component ---
    return (
        <div>
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