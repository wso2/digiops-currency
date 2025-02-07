import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Row, Col, Tag, Switch } from 'antd';
import { HomeOutlined, HistoryOutlined, WalletOutlined, UserOutlined, ReloadOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Sun, Moon } from 'react-feather';
import { useThemeSwitcher } from "react-css-theme-switcher";
import { getCurrentBlockNumber } from '../../services/blockchain.service.js';
import { saveLocalDataAsync } from '../../helpers/storage.js';
import {
    WSO2_WALLET,
    CONNECTED,
    NOT_CONNECTED
} from '../../constants/strings.js';
import { STORAGE_KEYS } from '../../constants/configs.js';
import './navbar.css';

const { Header } = Layout;

const NavBar = () => {
    const location = useLocation();
    const [currentBlockNumber, setCurrentBlockNumber] = useState(null);
    const { switcher, currentTheme } = useThemeSwitcher();
    
    useEffect(() => {
        const fetchBlockNumber = async () => {
            const blockNumber = await getCurrentBlockNumber();
            setCurrentBlockNumber(blockNumber);
        };
        fetchBlockNumber();
    }, []);

    const toggleTheme = async () => {
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        switcher({ theme: newTheme });
        await saveLocalDataAsync(STORAGE_KEYS.THEME_MODE, newTheme);
    };

    return (
        <Header className="navbar-header">
            <Row justify="center" align="middle" className="navbar-container">
                <Col className="navbar-logo">
                    <h2 className="navbar-title">{WSO2_WALLET}</h2>
                </Col>
                
                <Col flex="auto" className="navbar-menu-container">
                    <Menu
                        mode="horizontal"
                        selectedKeys={[location.pathname]}
                        theme={currentTheme}
                        className="navbar-menu"
                    >
                        <Menu.Item key="/" icon={<HomeOutlined />}>
                            <Link to="/">Home</Link>
                        </Menu.Item>
                        <Menu.Item key="/history" icon={<HistoryOutlined />}>
                            <Link to="/history">History</Link>
                        </Menu.Item>
                        <Menu.Item key="/create-wallet" icon={<WalletOutlined />}>
                            <Link to="/create-wallet">Create Wallet</Link>
                        </Menu.Item>
                        <Menu.Item key="/profile" icon={<UserOutlined />}>
                            <Link to="/profile">Profile</Link>
                        </Menu.Item>
                        <Menu.Item key="/recover-wallet" icon={<ReloadOutlined />}>
                            <Link to="/recover-wallet">Recover Wallet</Link>
                        </Menu.Item>
                    </Menu>
                </Col>
                
                <Col className="navbar-controls">
                    <Switch
                        checked={currentTheme === 'dark'}
                        onChange={toggleTheme}
                        checkedChildren={<Moon size={16} />}
                        unCheckedChildren={<Sun size={16} />}
                        className="theme-switcher"
                    />
                    
                    {currentBlockNumber ? (
                        <Tag color="green" className="status-tag">
                            <span className="status-dot status-dot-connected" />
                            {CONNECTED} ({currentBlockNumber})
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