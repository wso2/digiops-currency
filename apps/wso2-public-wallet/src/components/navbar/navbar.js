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

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Row, Col, Tag, Switch, Button } from "antd";
import { Sun, Moon } from "react-feather";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { getCurrentBlockNumber } from "../../services/blockchain.service.js";
import { saveLocalDataAsync } from "../../helpers/storage.js";
import Wso2MainImg from "../../assets/images/wso2_main.png";
import {
  WSO2_WALLET,
  CONNECTED,
  NOT_CONNECTED,
} from "../../constants/strings.js";
import { STORAGE_KEYS } from "../../constants/configs.js";
import "./navbar.css";

const { Header } = Layout;

const NavBar = () => {
  const location = useLocation();
  const [currentBlockNumber, setCurrentBlockNumber] = useState(null);
  const { switcher, currentTheme } = useThemeSwitcher();

  useEffect(() => {
    const fetchBlockNumber = async () => {
      const blockNumber = await getCurrentBlockNumber();
      console.log("Current block number: ", blockNumber);
      setCurrentBlockNumber(blockNumber);
    };
    fetchBlockNumber();
  }, []);

  const toggleTheme = async () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    switcher({ theme: newTheme });
    await saveLocalDataAsync(STORAGE_KEYS.THEME_MODE, newTheme);
  };

  useEffect(() => {
    switcher({ theme: "light" });
  }, []);

  return (
    <Header className="navbar-header">
      <Row justify="center" align="middle" className="navbar-container">
        <Col className="navbar-logo">
          <img
            src={Wso2MainImg}
            alt="WSO2 Wallet"
            className="navbar-logo-img"
            style={{ width: 100 }}
          />
          <h2 className="navbar-title">{WSO2_WALLET}</h2>
        </Col>

        <Col flex="auto" className="navbar-menu-container">
          <Button type="text" style={{ color: "orange", fontSize: "16px" }}>
            <Link to="/" style={{ color: "orange" }}>
              Home
            </Link>
          </Button>
          <Button type="text" style={{ color: "orange", fontSize: "16px" }}>
            <Link to="/history" style={{ color: "orange" }}>
              History
            </Link>
          </Button>
          <Button type="text" style={{ color: "orange", fontSize: "16px" }}>
            <Link to="/profile" style={{ color: "orange" }}>
              Profile
            </Link>
          </Button>
        </Col>

        <Col className="navbar-controls">
          <Switch
            className="theme-switcher"
            checked={currentTheme === "dark"}
            onChange={toggleTheme}
            checkedChildren={<Moon size={16} />}
            unCheckedChildren={<Sun size={16} />}
          />
          {currentBlockNumber ? (
            <Tag color="green" className="status-tag">
              <span className="status-dot status-dot-connected" />
              {CONNECTED}
            </Tag>
          ) : (
            <Tag color="red" className="status-tag">
              <span className="status-dot status-dot-not-connected" />
              {NOT_CONNECTED}
            </Tag>
          )}
        </Col>
      </Row>
    </Header>
  );
};

export default NavBar;
