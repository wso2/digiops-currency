// Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { useQuery } from '@tanstack/react-query';
import { getWalletBalanceByWalletAddress, getCurrentBlockNumber } from '../services/blockchain.service';

export function useWalletBalance(walletAddress, options = {}) {
  const isValidAddress = typeof walletAddress === 'string' && walletAddress.startsWith('0x') && walletAddress.length === 42;
  return useQuery({
    queryKey: ['walletBalance', walletAddress],
    queryFn: () => getWalletBalanceByWalletAddress(walletAddress, { timeout: 5000 }),
    enabled: isValidAddress,
    staleTime: 30_000, // Data is considered fresh for 30 seconds; avoids refetching if still fresh
    retry: 2,
    retryDelay: attemptIndex => 1000 * (attemptIndex + 1), // Wait 1s, then 2s between retries
    ...options,
  });
}

export function useBlockNumber(options = {}) {
  return useQuery({
    queryKey: ['blockNumber'],
    queryFn: getCurrentBlockNumber,
    staleTime: 10_000, // Data is considered fresh for 10 seconds
    ...options,
  });
}
