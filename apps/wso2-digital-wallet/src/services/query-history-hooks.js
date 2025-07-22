// Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { useQuery } from '@tanstack/react-query';
import { getTransactionHistory } from '../services/blockchain.service';

export function useWalletTransactionHistory(walletAddress, { pageSize = 20, offset = 0, enabled = true } = {}) {
  return useQuery({
    queryKey: ['walletTransactionHistory', walletAddress, pageSize, offset],
    queryFn: () => getTransactionHistory(walletAddress, 0, 'latest', pageSize, offset),
    enabled: !!walletAddress && enabled,
    staleTime: 60_000, // Data is considered fresh for 1 minute
    refetchInterval: false, // No automatic polling/refetching
  });
}
