// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import './NavBar.css';

import {
  useEffect,
  useState,
} from 'react';

import {
  Col,
  Row,
  Tag,
} from 'antd';
import { useThemeSwitcher } from 'react-css-theme-switcher';

import {
  CONNECTED,
  CONNECTING,
  NOT_CONNECTED,
  WSO2_WALLET,
} from '../../constants/strings';
import { getCurrentBlockNumber } from '../../services/blockchain.service.js';
import { waitForBridge, checkBridgeReady } from '../../helpers/bridge';

const NavBar = () => {
  const [currentBlockNumber, setCurrentBlockNumber] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(CONNECTING);
  const [bridgeReady, setBridgeReady] = useState(false);

  const getCurrentBlockStatus = async () => {
    setConnectionStatus(CONNECTING);

    try {
      const isBridgeReady = await waitForBridge();
      if (!isBridgeReady) {
        setConnectionStatus(NOT_CONNECTED);
        setCurrentBlockNumber(null);
        return;
      }
      const blockNumber = await getCurrentBlockNumber();
      if (blockNumber === null) {
        setConnectionStatus(NOT_CONNECTED);
        setCurrentBlockNumber(null);
      } else {
        setCurrentBlockNumber(blockNumber);
        setConnectionStatus(CONNECTED);
      }
    } catch (error) {
      console.error("error fetching block status:", error);
      setCurrentBlockNumber(null);
      setConnectionStatus(NOT_CONNECTED);
    }
  };


  useEffect(() => {
    const initializeWithBridgeCheck = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));

        const isBridgeReady = await waitForBridge();
        setBridgeReady(isBridgeReady);
        
        if (isBridgeReady) {
          await getCurrentBlockStatus();
        } else {
          setConnectionStatus(NOT_CONNECTED);
        }
      } catch (error) {
        console.error('Bridge initialization error:', error);
        setConnectionStatus(NOT_CONNECTED);
      }
    };

    initializeWithBridgeCheck();
  }, []);


// const toggleTheme = async () => {
  //   if (currentTheme === 'light') {
  //     switcher({ theme: 'dark' });
  //     saveLocalDataAsync(STORAGE_KEYS.THEME_MODE, 'dark')
  //   } else {
  //     saveLocalDataAsync(STORAGE_KEYS.THEME_MODE, 'light')
  //     switcher({ theme: 'light' });
  //   }
  // };

  return (
    <>
      <Row justify="space-between" align="middle" className="mt-4 mx-4">
        {/* <Col flex="none">
          {currentTheme === 'light' ? (
            <Sun size={18} onClick={toggleTheme} className='theme-icon' />
          ) : (
            <Moon size={18} onClick={toggleTheme} className='theme-icon' />
          )}
        </Col> */}
        <Col flex="auto">
          <span className="navbar-main-header">{WSO2_WALLET}</span>
        </Col>
        {/* <Col flex="none">
          <ScanOutlined style={{ fontSize: "18px", cursor: "pointer" }} className='scan-icon' />
        </Col> */}
      </Row>
      <div>
        {currentBlockNumber ? (
          <Tag>
            <span className="status-dot status-dot-connected" />
            {CONNECTED}
          </Tag>
        ) : (
          <Tag>
            <span className="status-dot status-dot-not-connected" />
            {connectionStatus === CONNECTING ? CONNECTING : NOT_CONNECTED}
          </Tag>
        )}
      </div>
    </>
  );
};

export default NavBar;
