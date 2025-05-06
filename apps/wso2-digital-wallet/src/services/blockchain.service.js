// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.
import { ethers } from 'ethers';
import { DateTime } from 'luxon';

import {
  CHAIN_ID,
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  RPC_ENDPOINT,
  STORAGE_KEYS,
} from '../constants/configs';
import { getTokenAsync } from '../helpers/auth';
import { getLocalDataAsync } from '../helpers/storage';

export const getRPCProvider = async () => {
  /** we will need this authentication header if we are using a private RPC endpoint with authentication
   * get the API key form the local storage
   */
  const accessToken = await getTokenAsync();
  const headers = {
    Authorization: `Bearer ${accessToken}`
  };

  const provider = new ethers.providers.StaticJsonRpcProvider(
    { url: RPC_ENDPOINT, headers: headers },
    CHAIN_ID
  );
  return provider;
};

export const getCurrentBlockNumber = async (retryCount = 0) => {
  const maxRetryCount = 5; // Set max retry count to 5
  try {
    const provider = await getRPCProvider();
    const blockNumber = await provider.getBlockNumber();
    return blockNumber;
  } catch (error) {
    const statusMatch = error.message.match(/status=(\d+)/);
    const statusCode = statusMatch ? statusMatch[1] : null;

    if (retryCount < maxRetryCount) {
      return getCurrentBlockNumber(retryCount + 1);
    }
    if (statusMatch) {
      console.log("Status code:", statusCode);
    } else {
      console.error("Could not find status code in error message");
    }
    return null;
  }
};

export const getWalletBalanceByWalletAddress = async (walletAddress) => {
  const provider = await getRPCProvider();
  //create ERC20 contract instance
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    JSON.parse(CONTRACT_ABI),
    provider
  );
  const balance = await contract.balanceOf(walletAddress);

  //check contract decimals
  const decimals = await contract.decimals();

  //format the balance
  const formattedBalance = ethers.utils.formatUnits(balance, decimals);
  return formattedBalance;
};

export const transferToken = async (senderWalletAddress, transferAmount) => {
  const provider = await getRPCProvider();
  const privateKey = await getLocalDataAsync(STORAGE_KEYS.PRIVATE_KEY);
  let wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    JSON.parse(CONTRACT_ABI),
    wallet
  );
  const options = { gasPrice: 0, gasLimit: 5000000 };
  const decimals = await contract.decimals();
  const amount = ethers.utils.parseUnits(transferAmount, decimals);
  const tx = await contract.transfer(senderWalletAddress, amount, options);
  const receipt = await tx.wait();
  return receipt;
};

export const getRecentTransactions = async (walletAddress) => {
  const provider = await getRPCProvider();
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    JSON.parse(CONTRACT_ABI),
    provider
  );
  const filter = {
    address: contract.address,
    topics: [ethers.utils.id("Transfer(address,address,uint256)")]
  };

  const currentBlockNumber = await getCurrentBlockNumber();
  const startBlockNumber = currentBlockNumber - 10000;
  filter.fromBlock = startBlockNumber;
  filter.toBlock = currentBlockNumber;
  const events = await provider.getLogs(filter);
  const transactions = [];

  for (const log of events) {
    const parsedLog = contract.interface.parseLog(log);
    console.log("parsedLog", log);
    if (
      parsedLog.args.to.toLowerCase() === walletAddress.toLowerCase() ||
      parsedLog.args.from.toLowerCase() === walletAddress.toLowerCase()
    ) {
      const block = await provider.getBlock(log.blockHash);

      transactions.push({
        direction:
          parsedLog.args.to.toLowerCase() === walletAddress.toLowerCase()
            ? "receive"
            : "send",
        tokenAmount: ethers.utils.formatUnits(parsedLog.args.value, 9),
        timestamp: DateTime.fromSeconds(block.timestamp).toFormat(
          "dd LLL yy HH:mm"
        )
      });
    }
  }
  return transactions?.reverse();
};
