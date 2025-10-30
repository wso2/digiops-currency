// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { Input, Button } from 'antd';
import React, { useState } from 'react';
import { ArrowRightOutlined, UndoOutlined } from '@ant-design/icons';
import { Col, Row } from 'reactstrap';
import { ethers } from 'ethers';
import WalletAddressCopy from '../../components/Home/WalletAddressCopy'
import { useNavigate } from "react-router-dom";
import './RecoverWallet.css'
import {
  RECOVER_WALLET,
  PASTE_PHRASE_HERE,
  RECOVER_YOUR_WALLET,
  CONTINUE,
  WALLET_ADDRESS,
  WALLET_PRIVATE_KEY,
  OK,
  ERROR,
  RECOVER_WALLET_ERROR,
  SHOW_WALLET_ADDRESS
} from '../../constants/strings'
import { PASS_PHRASE_LENGTH, STORAGE_KEYS } from '../../constants/configs';
import { saveLocalDataAsync } from '../../helpers/storage';
import { showAlertBox } from '../../helpers/alerts';

export default function RecoverWallet() {

  const navigate = useNavigate();

  const [wordList, setWordList] = useState(Array(12).fill(''));
  const [walletAddress, setWalletAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [continueRecover, setContinueRecover] = useState(false)
  const [walletRecovered, setWalletRecovered] = useState(false)
  const [loading, setLoading] = useState(false);

  const handleInputChange = (index, value) => {
    let newWordList = [...wordList];
    if (value && value.trim().split(' ').length === PASS_PHRASE_LENGTH) {
      const words = value.trim().split(' ');
      for (let i = 0; i < Math.min(words.length, 12); i++) {
        newWordList[i] = words[i];
      }
    } else {
      newWordList[index] = value;
    }
    setWordList(newWordList);
    const allWordsFilled = newWordList.filter(word => word && word.trim()).length === PASS_PHRASE_LENGTH;
    setContinueRecover(allWordsFilled);
  };

  const handleRecover = () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const phrase = wordList.join(' ');
        const wallet = ethers.Wallet.fromMnemonic(phrase);

        setWalletAddress(wallet.address);
        setPrivateKey(wallet.privateKey);

        //save wallet address and private key to local storage
        await saveLocalDataAsync(STORAGE_KEYS.WALLET_ADDRESS, wallet.address)
        await saveLocalDataAsync(STORAGE_KEYS.PRIVATE_KEY, wallet.privateKey)

        if (wallet.address) {
          setWalletRecovered(true)
        }
      } catch (error) {
        setWalletRecovered(false);
        showAlertBox(ERROR, RECOVER_WALLET_ERROR, OK);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  const renderInputs = () => {
    const inputs = [];
    for (let i = 0; i < 12; i++) {
      const formattedNumber = (i + 1 < 10) ? `${i + 1}&nbsp;` : (i + 1).toString();
      inputs.push(
        <Col md="6" sm="6" xs="6" key={i}>
          <div className="input-container mt-2">
            <label className="input-label" dangerouslySetInnerHTML={{ __html: formattedNumber }} />
            <Input
              value={wordList[i]}
              onChange={(event) => handleInputChange(i, event.target.value)}
            />
          </div>
        </Col>
      );
    }
    return inputs;
  };

  const handleContinue = () => {
    navigate("/");
  }

  return (
    <div className="mx-3">
      <div className='mt-5 d-flex justify-content-center'>
        <h3>{RECOVER_YOUR_WALLET}</h3>
      </div>
      <div className="text-sm">
        {PASTE_PHRASE_HERE}
      </div>

      <div className='recover-wallet-content container'>
        <Row className='mt-3'>{renderInputs()}</Row>

        <div className='mb-5'>
          {
            !walletRecovered ? (
              <Button 
                className={`mt-5 primary-button${!continueRecover ? ' disabled' : ''}`} 
                block 
                onClick={handleRecover} 
                disabled={!continueRecover} 
                loading={loading}
                icon={<UndoOutlined />}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {RECOVER_WALLET}
              </Button>
            ) : (
              <>
                {walletAddress && (
                  <div>
                    <div className='mt-3'>
                      <WalletAddressCopy address={walletAddress} topic={WALLET_ADDRESS} buttonText={SHOW_WALLET_ADDRESS} />
                    </div>
                  </div>
                )}
                {privateKey && (
                  <div className='mt-3'>
                    <WalletAddressCopy address={privateKey} topic={WALLET_PRIVATE_KEY} />
                  </div>
                )}
                <Button 
                  className="primary-button mt-5" 
                  block 
                  onClick={handleContinue}
                  icon={<ArrowRightOutlined />}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {CONTINUE}
                </Button>
              </>
            )
          }
        </div>
      </div>
    </div>
  );
}
