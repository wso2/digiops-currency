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
  useRef,
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
import { COLORS } from '../../constants/colors';
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
  const recentActivitiesRef = useRef();

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
  const [tokenBalance, setTokenBalance] = useState("0");
  const [isTokenBalanceLoading, setIsTokenBalanceLoading] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const fetchingRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  useEffect(() => {
    setIsInitialLoadComplete(false);
    setIsTokenBalanceLoading(false);
    fetchingRef.current = false;
    retryCountRef.current = 0;
    
    fetchWalletAddress();
  }, []);

  useEffect(() => {
    if (walletAddress && 
        walletAddress !== DEFAULT_WALLET_ADDRESS && 
        walletAddress !== "0x" && 
        walletAddress.length === 42) {
      
      loadInitialData();
    }
  }, [walletAddress]);

  useEffect(() => {
    if (!isInitialLoadComplete) return;

    const interval = setInterval(() => {
      if (!fetchingRef.current) {
        fetchTokenBalanceQuietly();
      }
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [isInitialLoadComplete, walletAddress]);

  const loadInitialData = async () => {
    if (fetchingRef.current) {
      return;
    }
    
    if (retryCountRef.current >= maxRetries) {
      setIsInitialLoadComplete(true);
      return;
    }
    
    retryCountRef.current += 1;
    
    try {
      fetchingRef.current = true;
      setIsTokenBalanceLoading(true);

      let isBridgeReady = false;
      let bridgeRetries = 0;
      const maxBridgeRetries = 5;
      
      while (!isBridgeReady && bridgeRetries < maxBridgeRetries) {
        isBridgeReady = await waitForBridge(3000);
        if (!isBridgeReady) {
          bridgeRetries++;
          if (bridgeRetries < maxBridgeRetries) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      }
      
      if (!isBridgeReady) {
        console.error(ERROR_BRIDGE_NOT_READY + " - Max retries exceeded");
        if (retryCountRef.current >= maxRetries) {
          setIsInitialLoadComplete(true);
        }
        return;
      }

      const timeouts = [5000, 8000, 12000];
      const currentTimeout = timeouts[Math.min(retryCountRef.current - 1, timeouts.length - 1)];
      
      const balancePromise = getWalletBalanceByWalletAddress(walletAddress);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Balance fetch timeout')), currentTimeout)
      );
      
      const tokenBalance = await Promise.race([balancePromise, timeoutPromise]);
      
      if (tokenBalance === null || tokenBalance === undefined || isNaN(parseFloat(tokenBalance))) {
        throw new Error('Invalid balance response');
      }
      
      setTokenBalance(tokenBalance);
      setIsInitialLoadComplete(true);
      retryCountRef.current = 0;
      
      setTimeout(() => {
        recentActivitiesRef.current?.refreshTransactions();
      }, 200);
      
    } catch (error) {
      console.error("Error during initial data load:", error);
      
      const shouldRetry = retryCountRef.current < maxRetries && (
        error.message.includes('timeout') ||
        error.message.includes('Invalid balance') ||
        error.message.includes('network') ||
        error.message.includes('bridge')
      );
      
      if (!shouldRetry) {
        setIsInitialLoadComplete(true);
      }
    } finally {
      setIsTokenBalanceLoading(false);
      fetchingRef.current = false;
    }
  };

  const fetchTokenBalanceQuietly = async () => {
    if (fetchingRef.current) return;
    
    try {
      fetchingRef.current = true;

      const tokenBalance = await getWalletBalanceByWalletAddress(walletAddress);
      
      if (tokenBalance !== null && tokenBalance !== undefined) {
        const numBalance = parseFloat(tokenBalance);
        if (!isNaN(numBalance)) {
          setTokenBalance(tokenBalance);
        }
      }
    } catch (error) {
      console.error("Background balance fetch error:", error);
    } finally {
      fetchingRef.current = false;
    }
  };

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

  const refreshAllData = async () => {
    if (!fetchingRef.current && isInitialLoadComplete) {
      try {
        await fetchTokenBalanceQuietly();
        recentActivitiesRef.current?.refreshTransactions();
      } catch (error) {
        console.error("Error refreshing data:", error);
      }
    }
  };

  return (
    <div className="home-container ">
      {contextHolder}
      <div className="wallet-balance-details mt-4">
        <span className="total-balance-tag">{TOTAL_BALANCE}</span>
        <span className="total-balance-value">
          {isTokenBalanceLoading ? (
            <Spin
              indicator={<LoadingOutlined style={{ color: COLORS.ORANGE_PRIMARY }} />}
              style={{ margin: "10px " }}
            />
          ) : (
            <NumericFormat
              value={tokenBalance}
              displayType={"text"}
              thousandSeparator={true}
              decimalScale={6}
              fixedDecimalScale={false}
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
      <RecentActivities ref={recentActivitiesRef} walletAddress={walletAddress} />
    </div>
  );
}

export default Home;
