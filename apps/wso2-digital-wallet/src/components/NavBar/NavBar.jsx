// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import './NavBar.css';

import React, {
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
  NOT_CONNECTED,
  WSO2_WALLET,
} from '../../constants/strings';
import { getCurrentBlockNumber } from '../../services/blockchain.service.js';

const NavBar = () => {
  const [currentBlockNumber, setCurrentBlockNumber] = useState(null);
  const { switcher, currentTheme } = useThemeSwitcher();

  const getCurrentBlockStatus = async () => {
    const blockNumber = await getCurrentBlockNumber();
    if (blockNumber === null) {
      console.log("Error in fetching block number");
    } else {
      setCurrentBlockNumber(blockNumber);
    }
    console.log("current block number: ", blockNumber);
  };

  useEffect(() => {
    getCurrentBlockStatus();
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
          <Tag className="status-tag">
            <span className="status-dot status-dot-connected" />
            {CONNECTED}
          </Tag>
        ) : (
          <Tag className="status-tag">
            <span className="status-dot status-dot-not-connected" />
            {NOT_CONNECTED}
          </Tag>
        )}
      </div>
    </>
  );
};

export default NavBar;
