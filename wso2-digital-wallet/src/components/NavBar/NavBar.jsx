// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import React, { useState, useEffect } from 'react';
import { Row, Col, Tag } from 'antd';
import { ScanOutlined } from "@ant-design/icons";
import './NavBar.css';
import { getCurrentBlockNumber } from '../../services/blockchain.service.js';
import { saveLocalDataAsync } from '../../helpers/storage';
import { Sun, Moon } from 'react-feather'
import { useThemeSwitcher } from "react-css-theme-switcher";
import {
  WSO2_WALLET,
  CONNECTED,
  NOT_CONNECTED
} from '../../constants/strings'
import { STORAGE_KEYS } from '../../constants/configs';

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

  const toggleTheme = async () => {
    if (currentTheme === 'light') {
      switcher({ theme: 'dark' });
      saveLocalDataAsync(STORAGE_KEYS.THEME_MODE, 'dark')
    } else {
      saveLocalDataAsync(STORAGE_KEYS.THEME_MODE, 'light')
      switcher({ theme: 'light' });
    }
  };


  return (
    <>
      <Row justify="space-between" align="middle" className="mt-4 mx-4">
        <Col flex="none">
          {currentTheme === 'light' ? (
            <Sun size={18} onClick={toggleTheme} className='theme-icon' />
          ) : (
            <Moon size={18} onClick={toggleTheme} className='theme-icon' />
          )}
        </Col>
        <Col flex="auto">
          <span className="navbar-main-header">{WSO2_WALLET}</span>
        </Col>
        <Col flex="none">
          <ScanOutlined style={{ fontSize: "18px", cursor: "pointer" }} className='scan-icon' />
        </Col>
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
