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

//--- footer component ---
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
