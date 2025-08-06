// Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Spin, Button, Input, Pagination } from 'antd';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { COLORS } from '../../constants/colors';

import { useTransactionHistory } from '../../hooks/useTransactionHistory';
import TransactionItem from '../shared/TransactionItem';

import { useQueryClient } from '@tanstack/react-query';

function TransactionHistory({ walletAddress }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const searchInputRef = useRef(null);

  const queryClient = useQueryClient();
  const allData = queryClient.getQueryData(['transactions', walletAddress]);
  const allTransactions = allData?.transactions || [];

  const {
    transactions,
    loading,
    error,
    refetch,
    totalCount  } = useTransactionHistory({ walletAddress, pageSize: 15, filter, page });

  useEffect(() => {
    setPage(1);
  }, [filter, searchTerm, walletAddress]);

  const filteredTransactions = useMemo(() => {
    if (!searchTerm) return transactions;
    return transactions.filter(transaction => {
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
  }, [transactions, searchTerm, walletAddress]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const sentCount = allTransactions.filter(tx => tx.direction === 'send').length;
  const receivedCount = allTransactions.filter(tx => tx.direction === 'receive').length;
  const allCount = allTransactions.length;

  const FilterButtons = () => (
    <div className="mb-3">
      <div className="d-flex justify-content-between" style={{ gap: '8px' }}>
        <Button onClick={() => setFilter('all')} size="large" className={`history-filter-button ${filter === 'all' ? 'active' : ''}`}>
          <span>All</span>
          <span className={`history-filter-count ${filter === 'all' ? 'active' : 'inactive'}`}>{allCount}</span>
        </Button>
        <Button onClick={() => setFilter('sent')} size="large" className={`history-filter-button ${filter === 'sent' ? 'active' : ''}`}>
          <span>Sent</span>
          <span className={`history-filter-count ${filter === 'sent' ? 'active' : 'inactive'}`}>{sentCount}</span>
        </Button>
        <Button onClick={() => setFilter('received')} size="large" className={`history-filter-button ${filter === 'received' ? 'active' : ''}`}>
          <span>Received</span>
          <span className={`history-filter-count ${filter === 'received' ? 'active' : 'inactive'}`}>{receivedCount}</span>
        </Button>
      </div>
    </div>
  );


  function TransactionList({ transactions }) {
    if (error) {
      return (
        <div className="mt-5 text-center">
          <p className="text-danger">Error loading transactions: {error.message || error}</p>
          <Button onClick={() => refetch()}>Retry</Button>
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
            <Button size="medium" onClick={() => setSearchTerm('')}>Clear Search</Button>
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
          <FilterButtons />
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
              indicator={<LoadingOutlined style={{ color: COLORS.ORANGE_PRIMARY }} />}
              style={{ margin: "10px " }}
            />
            <div className="mt-2">Loading transaction history...</div>
          </div>
        ) : (
          <>
            <div className="transaction-history-container">
              <TransactionList transactions={filteredTransactions} />
            </div>
            <div className="d-flex justify-content-center mt-4">
              <Pagination
                current={page}
                pageSize={15}
                total={totalCount}
                onChange={setPage}
                showSizeChanger={false}
                hideOnSinglePage
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TransactionHistory;
