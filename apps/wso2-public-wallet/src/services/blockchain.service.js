import { ethers } from "ethers";
import {
    RPC_ENDPOINT,
    CHAIN_ID,
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    STORAGE_KEYS
} from "../constants/configs";
import { DateTime } from 'luxon';
import { getLocalDataAsync, saveLocalDataAsync} from '../helpers/storage';


// ---- get rpc provider ----
export const getRpcProvider = async () => {
    console.log("getRpcProvider ---- > " ,  RPC_ENDPOINT, CHAIN_ID);
    const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT, CHAIN_ID);
    console.log("provider ---- > " , provider);
    return provider;
}

// ---- get current block number ----
export const getCurrentBlockNumber = async (retryCount = 0) => {
    const maxRetryCount = 5;
    try {
        const provider = getRpcProvider();
        
        const blockNumber = (await provider).getBlockNumber();
        console.log("blockNumber ---- > " , blockNumber);
        return blockNumber;
    } catch (error) {
        if (retryCount < maxRetryCount) {
            console.log("Retrying to get block number");
            return getCurrentBlockNumber(retryCount + 1);
        } else {
            console.log("Error in getting block number");
            return null;
        }
    }
}

// ----- get wallet balance by wallet address ----
export const getWalletBalanceByWalletAddress = async (walletAddress) => {
    const provider = await getRpcProvider();
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
  

// ----- get wallet balance by wallet address ----
export const transferTokens = async (receiverWalletAddress, transferAmount) => {

    // -- provider and private key --   
    const provider = await getRpcProvider();
    const privateKey = await getLocalDataAsync(STORAGE_KEYS.PRIVATE_KEY);

    let wallet = new ethers.Wallet(privateKey, provider);

    // contract instance 

    let contract = new ethers.Contract(CONTRACT_ADDRESS, JSON.parse(CONTRACT_ABI), wallet);

    //options 
    const options = {
        gasPrice: 0,
        gasLimit: 5000000
    }

    const decimals = await contract.decimals();
    const amount = ethers.utils.parseUnits(transferAmount, decimals);
    const tx = await contract.transfer(receiverWalletAddress, amount, options);
    const receipt = await tx.wait();
    return receipt;

}


// ----- get recent transactions ----
export const getTransactionHistory = async (walletAddress) => {
    const provider = await getRpcProvider();

    // create new ERC-20 contract instance
    const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        JSON.parse(CONTRACT_ABI),
        provider
    );

    // filter for Transfer event
    const filter = contract.filters.Transfer(walletAddress, null);  
    const currentBlockNumber = await getCurrentBlockNumber();
    const startBlockNumber = currentBlockNumber - 10000;
    filter.fromBlock = startBlockNumber;
    filter.toBlock = currentBlockNumber;
    const events = await provider.getLogs(filter);
    const transactions = [];

    for (const log of events) {
        const parsedLog = contract.interface.parseLog(log);
    
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

}


