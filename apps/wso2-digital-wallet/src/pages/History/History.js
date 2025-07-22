// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import React, { useEffect, useState } from "react";
import TransactionHistory from "../../components/History/TransactionHistory";
import { STORAGE_KEYS } from '../../constants/configs';
import { getLocalDataAsync } from '../../helpers/storage';

function History() {
  const [walletAddress, setWalletAddress] = useState("");
  useEffect(() => {
    document.body.classList.add('history-active');
    const fetchWalletAddress = async () => {
      const address = await getLocalDataAsync(STORAGE_KEYS.WALLET_ADDRESS);
      setWalletAddress(address || "");
    };
    fetchWalletAddress();
    return () => {
      document.body.classList.remove('history-active');
    };
  }, []);

  return (
    <div className="history-page">
      <div className="history-content">
        <TransactionHistory walletAddress={walletAddress} />
      </div>
    </div>
  );
}

export default History;
