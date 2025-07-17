// Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { useState, useEffect, useCallback, useRef } from 'react';
import { getTransactionHistory } from '../services/blockchain.service';
import { waitForBridge } from '../helpers/bridge';
import { ERROR_BRIDGE_NOT_READY } from '../constants/strings';

export const useTransactionHistory = ({
  walletAddress,
  pageSize = 20,
  autoRefresh = false,
  refreshInterval = 5000
}) => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  
  const observerRef = useRef();
  const sentinelRef = useRef();
  const isInitializedRef = useRef(false);
  const isFetchingRef = useRef(false);
  const fetchTransactionsRef = useRef();
  const currentOffsetRef = useRef(0);

  const fetchTransactions = useCallback(async (isLoadMore = false) => {
    if (!walletAddress || 
        isFetchingRef.current || 
        walletAddress === "0x" || 
        walletAddress.length !== 42) {
      return;
    }
    
    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      const isBridgeReady = await waitForBridge();
      if (!isBridgeReady) {
        throw new Error(ERROR_BRIDGE_NOT_READY);
      }

      const offset = isLoadMore ? currentOffsetRef.current : 0;
      const result = await getTransactionHistory(walletAddress, 0, 'latest', pageSize, offset);
      
      if (isLoadMore) {
        setTransactions(prev => [...prev, ...result.transactions]);
        currentOffsetRef.current += pageSize;
      } else {
        setTransactions(result.transactions);
        currentOffsetRef.current = pageSize;
        isInitializedRef.current = true;
      }
      
      setHasMore(result.hasMore);
      setTotalCount(result.totalCount);
      
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [walletAddress, pageSize]);

  fetchTransactionsRef.current = fetchTransactions;

  // Apply filters to transactions
  useEffect(() => {
    if (filter === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(
        transactions.filter(tx => {
          const direction = filter === 'sent' ? 'send' : 'receive';
          return tx.direction === direction;
        })
      );
    }
  }, [transactions, filter]);

  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    if (!sentinelRef.current) {
      return false;
    }

    const currentSentinel = sentinelRef.current;
    
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingRef.current && hasMore) {
          fetchTransactionsRef.current?.(true);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '20px'
      }
    );

    observerRef.current.observe(currentSentinel);
    return true;
  }, [hasMore]);

  useEffect(() => {
    // Disable automatic observer setup since components call setupObserver manually
    // This prevents conflicts between manual and automatic observers
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore]);

  // Auto refresh for home page
  useEffect(() => {
    if (!autoRefresh || !walletAddress || !isInitializedRef.current) return;

    const interval = setInterval(() => {
      if (!isFetchingRef.current) {
        fetchTransactionsRef.current?.(false);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, walletAddress, refreshInterval, transactions.length > 0]);

  useEffect(() => {
    if (walletAddress && 
        walletAddress !== "0x" && 
        walletAddress.length === 42) {
      isInitializedRef.current = false;
      isFetchingRef.current = false;
      currentOffsetRef.current = 0;
      setTransactions([]);
      setLoading(false);
      setError(null);
      setHasMore(true);
      fetchTransactionsRef.current?.(false);
    }
  }, [walletAddress]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchTransactions(true);
    }
  }, [hasMore, loading, fetchTransactions]);

  const refresh = useCallback(() => {
    setTransactions([]);
    currentOffsetRef.current = 0;
    isInitializedRef.current = false;
    isFetchingRef.current = false;
    setLoading(false);
    setError(null);
    setHasMore(true);
    fetchTransactionsRef.current?.(false);
  }, []);

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    loading,
    hasMore,
    error,
    filter,
    setFilter,
    loadMore,
    refresh,
    sentinelRef,
    setupObserver,
    totalCount,
    currentCount: transactions.length
  };
};
