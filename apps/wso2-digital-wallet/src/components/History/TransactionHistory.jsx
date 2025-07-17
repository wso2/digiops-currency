// Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Spin, Button, Input, Space } from 'antd';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';

import { STORAGE_KEYS } from '../../constants/configs';
import {
  ERROR_READING_WALLET_DETAILS,
} from '../../constants/strings';
import { getLocalDataAsync } from '../../helpers/storage';
import { useTransactionHistory } from '../../hooks/useTransactionHistory';
import TransactionItem from '../shared/TransactionItem';

function TransactionHistory() {
  const [walletAddress, setWalletAddress] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);
  const orangeColor = "#ff7300";

  const {
    transactions,
    allTransactions,
    loading,
    hasMore,
    filter,
    setFilter,
    sentinelRef,
    error,
    totalCount,
    currentCount,
    loadMore,
    setupObserver
  } = useTransactionHistory({
    walletAddress,
    pageSize: 10,
    autoRefresh: false, // No auto-refresh for history page
  });

  useEffect(() => {
    if (transactions.length > 0 && hasMore && !loading) {
      setTimeout(() => {
        setupObserver();
      }, 100);
    }
  }, [transactions.length, hasMore, loading, setupObserver]);

  const fetchWalletAddress = async () => {
    try {
      const walletAddressResponse = await getLocalDataAsync(
        STORAGE_KEYS.WALLET_ADDRESS
      );
      setWalletAddress(walletAddressResponse);
    } catch (error) {
      console.error(`${ERROR_READING_WALLET_DETAILS}: ${error}`);
      setWalletAddress("");
    }
  };

  useEffect(() => {
    fetchWalletAddress();
  }, []);

  // Filter transactions based on search term while respecting the active filter
  const filteredTransactions = useMemo(() => {
    // Always use the transactions that are already filtered by the hook (all/sent/received)
    const sourceTransactions = transactions;
    
    if (!searchTerm) {
      return sourceTransactions;
    }
    
    const filtered = sourceTransactions.filter(transaction => {
      const currentWallet = walletAddress?.toLowerCase();
      const fromAddress = transaction.from.toLowerCase();
      const toAddress = transaction.to.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      let otherPartyAddress = '';
      if (fromAddress === currentWallet) {
        otherPartyAddress = toAddress;
      } else if (toAddress === currentWallet) {
        otherPartyAddress = fromAddress;
      } else {
        return fromAddress.includes(searchLower) || toAddress.includes(searchLower);
      }
      
      return otherPartyAddress.includes(searchLower);
    });
    
    return filtered;
  }, [transactions, searchTerm, walletAddress]);

  // Memoized search input handler
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const FilterButtons = () => {
    const sentCount = allTransactions.filter(tx => tx.direction === 'send').length;
    const receivedCount = allTransactions.filter(tx => tx.direction === 'receive').length;
    
    return (
      <div className="mb-3">
        <div 
          className="d-flex justify-content-between"
          style={{ gap: '8px' }}
        >
          <Button 
            onClick={() => setFilter('all')}
            size="large"
            className={`history-filter-button ${filter === 'all' ? 'active' : ''}`}
          >
            <span>All</span>
            <span className={`history-filter-count ${filter === 'all' ? 'active' : 'inactive'}`}>
              {allTransactions.length}
            </span>
          </Button>
          <Button 
            onClick={() => setFilter('sent')}
            size="large"
            className={`history-filter-button ${filter === 'sent' ? 'active' : ''}`}
          >
            <span>Sent</span>
            <span className={`history-filter-count ${filter === 'sent' ? 'active' : 'inactive'}`}>
              {sentCount}
            </span>
          </Button>
          <Button 
            onClick={() => setFilter('received')}
            size="large"
            className={`history-filter-button ${filter === 'received' ? 'active' : ''}`}
          >
            <span>Received</span>
            <span className={`history-filter-count ${filter === 'received' ? 'active' : 'inactive'}`}>
              {receivedCount}
            </span>
          </Button>
        </div>
      </div>
    );
  };

  function TransactionList({ transactions }) {
    if (error) {
      return (
        <div className="mt-5 text-center">
          <p className="text-danger">Error loading transactions: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      );
    }

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
          {hasMore && !searchTerm && (
            <div 
              ref={sentinelRef} 
              className="mt-4 d-flex justify-content-center"
              style={{ 
                minHeight: '60px',
              }}
            >
              {loading && (
                <div className="text-center">
                  <Spin
                    indicator={<LoadingOutlined style={{ color: orangeColor }} />}
                    size="small"
                  />
                  <div className="mt-2 text-muted">Loading more transactions...</div>
                </div>
              )}
            </div>
          )}

          {/* Load More button as fallback when searching */}
          {hasMore && searchTerm && !loading && (
            <div className="mt-4 text-center">
              <Button 
                onClick={() => {
                  loadMore();
                }}
                size="medium"
                type="primary"
              >
                Load More Transactions
              </Button>
            </div>
          )}

          {/* Show total count when filtered */}
          {searchTerm && (
            <div className="mt-4 text-center text-muted">
              Showing {filteredTransactions.length} of {transactions.length} filtered transactions
            </div>
          )}
        </>
      );
    } else {
      return (
        <div className="mt-5 text-center">
          <p className="text-muted">
            {searchTerm ? 'No transactions match your search' : 'No transaction history found'}
          </p>
          {searchTerm && (
            <Button 
              size="medium" 
              onClick={() => {
                setSearchTerm('');
              }}
            >
              Clear Search
            </Button>
          )}
        </div>
      );
    }
  }

  return (
    <div className="transaction-history-widget">
      <div className="transaction-history-widget-inner">
        <div>
          <h4>Transaction History</h4>
          
          {/* Filter Buttons */}
          <FilterButtons />
          
          {/* Search and Date Filters */}
          <div className="mb-2">
            <Input
              ref={searchInputRef}
              placeholder="Search by wallet address..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={handleSearchChange}
              size="large"
              allowClear
            />
          </div>
        </div>

        {loading && transactions.length === 0 ? (
          <div className="mt-5 text-center">
            <Spin
              indicator={<LoadingOutlined style={{ color: orangeColor }} />}
              style={{ margin: "10px " }}
            />
            <div className="mt-2">Loading transaction history...</div>
          </div>
        ) : (
          <div className="transaction-history-container">
            <TransactionList transactions={filteredTransactions} />
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionHistory;
