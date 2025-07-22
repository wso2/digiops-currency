// Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getTransactionHistory } from '../services/blockchain.service';

export function useTransactionHistory({ walletAddress, pageSize = 20, filter = 'all', page = 1 }) {
  const queryClient = useQueryClient();
  const {
    data,
    error,
    isFetching,
    refetch,
    status
  } = useQuery({
    queryKey: ['transactions', walletAddress],
    queryFn: async () => {
      if (!walletAddress || walletAddress === '0x' || walletAddress.length !== 42) {
        return { transactions: [], totalCount: 0 };
      }
      const result = await getTransactionHistory(walletAddress, 0, 'latest', 1000, 0); // fetch all (up to 1000)
      return { ...result, totalCount: result.transactions.length };
    },
    enabled: !!walletAddress && walletAddress !== '0x' && walletAddress.length === 42,
    staleTime: 1000 * 60, // 1 minute
    cacheTime: 1000 * 60 * 5, // 5 minutes
  });

  const allTransactions = data?.transactions || [];
  let filtered = allTransactions;
  if (filter !== 'all') {
    const direction = filter === 'sent' ? 'send' : 'receive';
    filtered = allTransactions.filter(tx => tx.direction === direction);
  }
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const paginatedTransactions = filtered.slice((page - 1) * pageSize, page * pageSize);

  const refresh = () => {
    queryClient.removeQueries({ queryKey: ['transactions', walletAddress] });
    refetch();
  };

  return {
    transactions: paginatedTransactions,
    loading: isFetching,
    error,
    refetch,
    refresh,
    totalCount,
    totalPages,
    page,
    pageSize,
    status
  };
}
