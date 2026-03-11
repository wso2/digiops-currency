// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { blockchainConfigs } from '../config/blockchain.config';
import { WalletConfigService } from '../common/wallet-config.service';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);

  constructor(private walletConfigService: WalletConfigService) {}

  getWeb3Provider = async () => {
    /** Depending on choreo configurations you may need to use authentication header
     * to communicate with blockchain network.
     * 'User-Agent': 'PostmanRuntime/7.26.8' added due to choreo has protection mechanism for unknown user agents.
     **/
    const connection = {
      url: blockchainConfigs.rpcUrl,
      headers: {
        'User-Agent': 'PostmanRuntime/7.26.8',
        Authorization: 'Bearer ' + '',
      },
    };
    const provider = new ethers.JsonRpcProvider(connection.url, blockchainConfigs.chainID);

    return provider;
  };

  getMasterWalletTokenBalance = async (clientId: string) => {
    const walletConfig = this.walletConfigService.getWalletConfig(clientId);
    if (!walletConfig) {
      throw new Error(`Wallet config not found for clientId: ${clientId}`);
    }
    const provider = await this.getWeb3Provider();
    const contractAddress = walletConfig.CONTRACT_ADDRESS || blockchainConfigs.contractAddress;
    const contract = new ethers.Contract(
      contractAddress,
      blockchainConfigs.contractAbi,
      provider,
    );
    const decimals = Number(await contract.decimals());
    const balance = await contract.balanceOf(walletConfig.PUBLIC_WALLET_ADDRESS);
    const formattedValue = ethers.formatUnits(balance, decimals);
    return {
      masterWalletAddress: walletConfig.PUBLIC_WALLET_ADDRESS,
      balance: formattedValue.toString(),
      tokenBalanceUnFormatted: balance.toString(),
      decimals: decimals,
    };
  };

  getWalletTokenBalance = async (walletAddress: string) => {
    const provider = await this.getWeb3Provider();
    const contract = new ethers.Contract(
      blockchainConfigs.contractAddress,
      blockchainConfigs.contractAbi,
      provider,
    );
    const decimals = Number(await contract.decimals());
    const balance = await contract.balanceOf(walletAddress);
    const formattedValue = ethers.formatUnits(balance, decimals);

    return {
      balance: formattedValue.toString(),
      tokenBalanceUnFormatted: balance.toString(),
      decimals: decimals,
    };
  };

  getTransactionDetailsByTxHash = async (txHash: string) => {
    const provider = await this.getWeb3Provider();
    const txDetails = await provider.getTransaction(txHash);

    if (!txDetails) {
      return {
        txHash,
        found: false,
        success: false,
        status: 'NOT_FOUND',
        timestamp: null,
        decodedData: null,
        amountFormatted: null,
        txDetails: null,
      };
    }

    const contractInterface = new ethers.Interface(blockchainConfigs.contractAbi);
    const decodedData = contractInterface.parseTransaction({
      data: txDetails.data,
    });

    let amountFormatted: string | null = null;
    try {
      if (decodedData?.args?.length >= 2) {
        const raw = decodedData.args[1];
        const amountBigInt = BigInt(raw.toString());
        const contract = new ethers.Contract(
          blockchainConfigs.contractAddress,
          blockchainConfigs.contractAbi,
          provider,
        );
        const decimals = Number(await contract.decimals());
        amountFormatted = ethers.formatUnits(amountBigInt, decimals).toString();
      }
    } catch (e) {
      this.logger.warn(`Failed to derive amount for tx ${txHash}: ${e}`);
    }

    const receipt = await provider.getTransactionReceipt(txHash);

    // Pending: transaction known but not yet mined / no receipt.
    if (!receipt || receipt.blockNumber == null) {
      return {
        txHash,
        found: true,
        success: false,
        status: 'PENDING',
        timestamp: null,
        decodedData,
        amountFormatted,
        txDetails,
      };
    }

    const success = receipt.status === 1;

    const block = await provider.getBlock(receipt.blockNumber);
    const timestamp =
      block && typeof block.timestamp === 'number'
        ? new Date(block.timestamp * 1000).toISOString()
        : null;
    return {
      txHash,
      found: true,
      success,
      status: success ? 'SUCCESS' : 'FAILED',
      timestamp,
      decodedData,
      amountFormatted,
      txDetails,
    };
  };

  transferTokens = async (clientId: string, recipientWalletAddress: string, amount: number) => {
    const walletConfig = this.walletConfigService.getWalletConfig(clientId);
    if (!walletConfig) {
      throw new Error(`Wallet config not found for clientId: ${clientId}`);
    }
    const provider = await this.getWeb3Provider();
    const envVar = `WALLET_PRIVATE_KEY_${clientId}`;
    const privateKey = process.env[envVar];
    if (!privateKey) {
      throw new Error(`Private key not set in env for clientId: ${clientId}`);
    }
    const wallet = new ethers.Wallet(privateKey);
    const signer = wallet.connect(provider);
    const contractAddress = walletConfig.CONTRACT_ADDRESS || blockchainConfigs.contractAddress;
    const contract = new ethers.Contract(
      contractAddress,
      blockchainConfigs.contractAbi,
      signer,
    );
    const decimals = await contract.decimals();
    const transferAmount = ethers.parseUnits(amount.toString(), decimals);
    const options = {
      gasPrice: '0',
    };
    const tx = await contract.transfer(
      recipientWalletAddress,
      transferAmount,
      options,
    );
    this.logger.log(`Transaction hash: ${tx.hash}`);
    const receipt = await tx.wait();
    this.logger.log(`Transaction was mined in block: ${receipt.blockNumber}`);
    return {
      txHash: tx.hash,
      status: receipt.status,
      committedBlockNumber: receipt.blockNumber,
    };
  };
}
