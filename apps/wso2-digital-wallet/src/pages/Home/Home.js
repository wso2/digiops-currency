// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import './Home.css';

import {
  useEffect,
  useState,
} from 'react';

import {
  Button,
  message,
  Spin,
} from 'antd';
import { NumericFormat } from 'react-number-format';
import { useNavigate } from 'react-router-dom';

import { LoadingOutlined } from '@ant-design/icons';

import RecentActivities from '../../components/Home/RecentActivities';
import {
  DEFAULT_WALLET_ADDRESS,
  STORAGE_KEYS,
} from '../../constants/configs';
import {
  ERROR_RETRIEVE_WALLET_ADDRESS,
  ERROR_BRIDGE_NOT_READY,
  SEND_TOKENS,
  SUCCESS,
  TOTAL_BALANCE,
  WALLET_ADDRESS_COPIED,
} from '../../constants/strings';
import { showToast } from '../../helpers/alerts';
import { getLocalDataAsync } from '../../helpers/storage';
import {
  getWalletBalanceByWalletAddress,
} from '../../services/blockchain.service';
import { waitForBridge } from '../../helpers/bridge';

function Home() {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState(DEFAULT_WALLET_ADDRESS);

  const [messageApi, contextHolder] = message.useMessage();

  const fetchWalletAddress = async () => {
    try {
      const walletAddressResponse = await getLocalDataAsync(
        STORAGE_KEYS.WALLET_ADDRESS
      );
      if (walletAddressResponse !== walletAddress) {
        setWalletAddress(walletAddressResponse);
      }
    } catch (error) {
      console.log(`${ERROR_RETRIEVE_WALLET_ADDRESS} - ${error}`);
      messageApi.error(ERROR_RETRIEVE_WALLET_ADDRESS);
    }
  };

  const [isAccountCopied, setIsAccountCopied] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [isTokenBalanceLoading, setIsTokenBalanceLoading] = useState(false);
  const [isFetchingInBackground, setIsFetchingInBackground] = useState(false);
  const [recentActivitiesKey, setRecentActivitiesKey] = useState(0);

  const refreshRecentActivities = () => {
    setRecentActivitiesKey(prev => prev + 1);
  };

  useEffect(() => {
    fetchWalletAddress();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (walletAddress !== DEFAULT_WALLET_ADDRESS && walletAddress) {
      fetchCurrentTokenBalance();
      refreshRecentActivities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (walletAddress !== DEFAULT_WALLET_ADDRESS && walletAddress && !isFetchingInBackground) {
        fetchCurrentTokenBalanceDoInBackground();
      }
    }, 5000);

    // This is important, as it clears the interval when the component is unmounted.
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, isFetchingInBackground]);

  const handleCopyAccount = async () => {
    showToast(SUCCESS, WALLET_ADDRESS_COPIED);
    setIsAccountCopied(true);
    setTimeout(() => {
      setIsAccountCopied(false);
    }, 2000);
  };

  const handleSend = () => {
    navigate("/send");
  };

  useEffect(() => {
    if (!walletAddress || walletAddress?.length === 0) {
      navigate("/create-wallet");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  const fetchCurrentTokenBalance = async () => {
    try {
      const isBridgeReady = await waitForBridge();
      if (!isBridgeReady) {
        console.error(ERROR_BRIDGE_NOT_READY);
        return;
      }
      
      setIsTokenBalanceLoading(true);
      const tokenBalance = await getWalletBalanceByWalletAddress(walletAddress);
      setTokenBalance(tokenBalance);
      setIsTokenBalanceLoading(false);
      refreshRecentActivities();
    } catch (error) {
      console.debug("DEBUG: error while fetching token balance", error);
      setIsTokenBalanceLoading(false);
      setTokenBalance(0);
    }
  };

  const fetchCurrentTokenBalanceDoInBackground = async () => {
    if (isFetchingInBackground) return;
    
    setIsFetchingInBackground(true);
    try {
      const isBridgeReady = await waitForBridge();
      if (!isBridgeReady) {
        console.error(ERROR_BRIDGE_NOT_READY);
        return;
      }

      const tokenBalance = await getWalletBalanceByWalletAddress(walletAddress);
      setTokenBalance(tokenBalance);
    } catch (error) {
      setTokenBalance(0);
      console.debug("DEBUG: error while fetching token balance", error);
    } finally {
      setIsFetchingInBackground(false);
    }
  };

  const orangeColor = "#ff7300";

  return (
    <div className="home-container ">
      {contextHolder}
      <div className="wallet-balance-details mt-4">
        <span className="total-balance-tag">{TOTAL_BALANCE}</span>
        <span className="total-balance-value">
          {isTokenBalanceLoading ? (
            <Spin
              indicator={<LoadingOutlined style={{ color: orangeColor }} />}
              style={{ margin: "10px " }}
            />
          ) : (
            <NumericFormat
              value={tokenBalance}
              displayType={"text"}
              thousandSeparator={true}
            />
          )}
        </span>
        {/* <CopyToClipboard text={walletAddress} onCopy={handleCopyAccount}>
          <Tooltip title={isAccountCopied ? "Copied" : "Copy to Clipboard"}>
            <Tag className="total-balance-wallet-address mt-2">
              {getEllipsisTxt(walletAddress, 13)}{" "}
              {!isAccountCopied ? (
                <CopyOutlined style={{ marginLeft: "5px" }} />
              ) : (
                <CheckOutlined style={{ marginLeft: "5px" }} />
              )}
            </Tag>
          </Tooltip>
        </CopyToClipboard> */}
        <div className="send-button pt-3">
          <Button className="primary-button container" onClick={handleSend}>{SEND_TOKENS}</Button>
        </div>
        {/* <div className="d-flex justify-content-between mt-4">
          <div>
            <div className="total-balance-icons mx-5">
              <div style={{ marginTop: "-2px", marginBottom: "-2px" }}>
                <DownloadOutlined
                  style={{ fontSize: "18px", cursor: "pointer" }}
                />
              </div>
            </div>
            <div className="total-balance-action">{REQUEST}</div>
          </div>
          <div>
            <div className="total-balance-icons">
              <div style={{ marginTop: "-2px", marginBottom: "-2px" }}>
                <WalletOutlined
                  style={{ fontSize: "18px", cursor: "pointer" }}
                />
              </div>
            </div>
            <div className="total-balance-action">{BUY}</div>
          </div>
        </div> */}
      </div>
      <RecentActivities key={recentActivitiesKey}/>
    </div>
  );
}

export default Home;
