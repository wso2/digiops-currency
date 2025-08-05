// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import React from 'react';

import { Layout } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  HistoryOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons';

import {
  HISTORY,
  PROFILE,
  WALLET,
} from '../../constants/strings';
import { COLORS } from '../../constants/colors';

const FooterBar = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const { Footer } = Layout;
  
  const activeColor = COLORS.ORANGE_PRIMARY;
  const inactiveColor = COLORS.GRAY_MEDIUM;

  const getIconColor = (path) => {
    return location.pathname === path ? activeColor : inactiveColor;
  };

  const handleHomeNavigation = () => {
    navigate('/');
  };

  const handleNavigateHistory = () => {
    navigate('/history');
  }

  const handleNavigateProfile = () => {
    navigate('/profile');
  };

  return (
    <Footer className="text-center" style={{ height: '85px', position: 'fixed', bottom: 0, width: '100%' }}>
      <div className="d-flex justify-content-between">
        <div className="d-flex flex-column">
          <span className="footer-icons" onClick={handleHomeNavigation}>
            <WalletOutlined style={{ fontSize: "20px", cursor: "pointer", color: getIconColor('/') }} />
          </span>
          <span className="footer-names" style={{ color: getIconColor('/') }}>{WALLET}</span>
        </div>
        <div className="d-flex flex-column">
          <span className="footer-icons" onClick={handleNavigateHistory}>
            <HistoryOutlined style={{ fontSize: "20px", cursor: "pointer", color: getIconColor('/history') }} />
          </span>
          <span className="footer-names" style={{ color: getIconColor('/history') }}>{HISTORY}</span>
        </div>
        <div className="d-flex flex-column">
          <span className="footer-icons mx-2" onClick={handleNavigateProfile}>
            <UserOutlined style={{ fontSize: "20px", cursor: "pointer", color: getIconColor('/profile') }} />
          </span>
          <span className="footer-names" style={{ color: getIconColor('/profile') }}>{PROFILE}</span>
        </div>
      </div>
    </Footer>
  );
};

export default FooterBar;
