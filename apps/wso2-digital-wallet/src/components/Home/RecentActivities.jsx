// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { useEffect, useState, memo, forwardRef, useImperativeHandle } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { STORAGE_KEYS } from '../../constants/configs';
import {
  ERROR_READING_WALLET_DETAILS,
  RECENT_ACTIVITIES,
} from '../../constants/strings';
import { getLocalDataAsync } from '../../helpers/storage';
import { useTransactionHistory } from '../../hooks/useTransactionHistory';
import TransactionItem from '../shared/TransactionItem';
import { COLORS } from '../../constants/colors';

const RecentActivities = forwardRef(({ walletAddress: propWalletAddress }, ref) => {
  const [walletAddress, setWalletAddress] = useState(propWalletAddress || "");

  useEffect(() => {
    if (propWalletAddress) {
      setWalletAddress(propWalletAddress);
    } else {
      const fetchWalletAddress = async () => {
        try {
          const address = await getLocalDataAsync(STORAGE_KEYS.WALLET_ADDRESS);
          setWalletAddress(address || "");
        } catch (error) {
          console.error('RecentActivities: Error fetching wallet address:', error);
        }
      };
      fetchWalletAddress();
    }
  }, [propWalletAddress]);

  const {
    transactions,
    loading,
    hasMore,
    sentinelRef,
    refresh,
    totalCount,
    currentCount,
    loadMore,
    setupObserver
  } = useTransactionHistory({
    walletAddress,
    pageSize: 5,
    autoRefresh: false,
    refreshInterval: 30000
  });

  useImperativeHandle(ref, () => ({
    refreshTransactions: () => {
      refresh();
    }
  }), [refresh]);

  useEffect(() => {
    if (walletAddress && walletAddress !== "") {
      refresh();
    }
  }, [walletAddress, refresh]);

  useEffect(() => {
    if (transactions.length > 0 && hasMore && !loading) {
      setTimeout(() => {
        setupObserver();
      }, 100);
    }
  }, [transactions.length, hasMore, loading, setupObserver]);

  function TransactionList({ transactions }) {
    if (transactions.length > 0) {
      return (
        <>
          {transactions.map((transaction, index) => (
            <TransactionItem 
              key={`${transaction.txHash}-${index}`} 
              transaction={transaction} 
              index={index} 
            />
          ))}
          
          {/* Sentinel element for intersection observer */}
          {hasMore && (
            <div 
              ref={sentinelRef} 
              className="mt-4 d-flex justify-content-center"
              style={{ minHeight: '40px' }}
            >
              {loading && (
                <Spin
                  indicator={<LoadingOutlined style={{ color: COLORS.ORANGE_PRIMARY }} />}
                  size="small"
                />
              )}
            </div>
          )}
        </>
      );
    } else {
      return (
        <div className="mt-5">
          <p className="text-muted">no recent activities</p>
        </div>
      );
    }
  }

  return (
    <div className="recent-activities-widget">
      <div className="recent-activities-widget-inner">
        <div className="mt-1">
          <div className="d-flex justify-content-between">
            <div className="sub-heading">
              <h4>{RECENT_ACTIVITIES}</h4>
            </div>
          </div>
        </div>

        {loading && transactions.length === 0 ? (
          <div className="mt-5">
            <Spin
              indicator={<LoadingOutlined style={{ color: orangeColor }} />}
              style={{ margin: "10px " }}
            />
          </div>
        ) : (
          <div className="recent-activity-container">
            <TransactionList transactions={transactions} />
          </div>
        )}
      </div>
    </div>
  );
});

RecentActivities.displayName = 'RecentActivities';

export default memo(RecentActivities);
