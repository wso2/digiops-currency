import React, { useEffect, useState } from 'react';
import RecentActivities from '../../components/home/recent-activities';
import { getLocalDataAsync } from '../../helpers/storage';
import { STORAGE_KEYS } from '../../constants/configs';
import { ERROR_RETRIEVE_WALLET_ADDRESS } from '../../constants/strings';
import { message } from 'antd';
import NoWallet from '../no-wallet/no-wallet';

const HistoryPage = () => {

  // --- states to store wallet address ---
  const [walletAddress, setWalletAddress] = useState('');

  // --- message api to show alerts ---
  const [messageApi, contextHolder] = message.useMessage();


  // --- fetch wallet address ---
  const fetchWalletAddress = async () => {
    try {
      const walletAddressResponse = await getLocalDataAsync(
        STORAGE_KEYS.WALLET_ADDRESS
      );


      if (walletAddressResponse) {
        setWalletAddress(walletAddressResponse);
      }

      console.log("this is wallet address response --- > ", walletAddressResponse);
      console.log("this is wallet address availability --- > ", walletAddress == null);

      console.log("this is wallet address --- > ", walletAddress);
    } catch (error) {
      messageApi.error(ERROR_RETRIEVE_WALLET_ADDRESS);
    }
  };

  // --- fetch wallet address when page mounts ---
  useEffect(() => {
    fetchWalletAddress();
  }, []);

  return (
    (walletAddress) ? <NoWallet /> :
      <div>
        <RecentActivities />
      </div>
  );
}

export default HistoryPage;