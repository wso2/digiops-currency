// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import React from 'react';
import { Layout } from 'antd';
import { UserOutlined, HistoryOutlined } from "@ant-design/icons";
import FooterWallet from '../../assets/images/footer-wallet.svg';
import FooterApps from '../../assets/images/footer-apps.svg';
import { useNavigate } from "react-router-dom";
import {
  WALLET,
  APPS,
  PROFILE,
  HISTORY
} from '../../constants/strings'

const FooterBar = () => {

  const navigate = useNavigate();

  const { Footer } = Layout;

  const handleNavigateApps = () => {
    navigate('api-key-updater');
  };

  const handleHomeNavigation = () => {
    navigate('/');
  };

  const handleNavigateProfile = () => {
    navigate('/profile');
  };

  const handleNavigateHistory = () => {
    navigate('/history');
  }

  return (
    <Footer className="text-center" style={{ height: '75px' }}>
      <div className="d-flex justify-content-between">
        <div className="d-flex flex-column">
          <span className="footer-icons" onClick={handleHomeNavigation}>
            <img src={FooterWallet} alt="Wallet" />
          </span>
          <span className="footer-names">{WALLET}</span>
        </div>
        <div className="d-flex flex-column">
          <span className="footer-icons mx-2" onClick={handleNavigateApps}>
            <img src={FooterApps} alt="Apps" />
          </span>
          <span className="footer-names">{APPS}</span>
        </div>
        <div className="d-flex flex-column">
          {/* <Dropdown overlay={menu} placement="topCenter"> */}
          <span className="footer-icons mx-2" onClick={handleNavigateProfile}>
            <UserOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
          </span>
          {/* </Dropdown> */}
          <span className="footer-names">{PROFILE}</span>
        </div>
        <div className="d-flex flex-column">
          <span className="footer-icons" onClick={handleNavigateHistory}>
            <HistoryOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
          </span>
          <span className="footer-names">{HISTORY}</span>
        </div>
      </div>
    </Footer>
  );
};

export default FooterBar;
