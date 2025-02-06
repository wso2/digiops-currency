// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import React, { useState, useEffect } from 'react';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Input, Button } from 'antd';
import { showAlertBox } from '../../helpers/alerts';
import { COPIED, OK } from '../../constants/strings';

function WalletAddressCopy(props) {
  const { address, topic, buttonText = 'Show Private Key' } = props;

  const [walletAddressCopied, setWalletAddressCopied] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);  

  useEffect(() => {
    setShowPrivateKey(false);
  }, []);

  const handleCopyWalletAddress = async () => {

    await showAlertBox(COPIED, `${topic} ${COPIED}`, OK);
    setWalletAddressCopied(true);
    setTimeout(() => {
      setWalletAddressCopied(false);
    }, 2000)
  };

  return (
    <>
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
              <CopyToClipboard text={address} onCopy={handleCopyWalletAddress}>
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
    </>
  );
}

export default WalletAddressCopy;
