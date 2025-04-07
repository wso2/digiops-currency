// Copyright (c) 2024, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { getTokenAsync } from "../helpers/auth";
import { logService } from "./log.service";

export const updateUserWalletAddress = async ({walletAddress, defaultWallet}) => {
  const token = await getTokenAsync();

  logService({
    type : 'info',
    message : 'creating wallet '
  }

  )

  try {
    const response = await fetch(
      `${process.env.REACT_APP_WALLET_SERVICE_BASE_URL}/user-wallet?walletAddress=${walletAddress}&defaultWallet=${defaultWallet || 0}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'x-jwt-assertion': token,
        },
      }
    );


    
    
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || "Unknown error";
      logService(
        {
          type : 'error',
          message : `${errorMessage}`
        }
      )
      throw new Error(
        `Failed to update user wallet address: ${response.status} - ${errorMessage}`
      );
    }
  } catch (error) {
    console.error("Error while updating user wallet address: ", error);
    throw error;
  }
};

export const getUserWallets = async () => {
  const token = await getTokenAsync();

  logService(
    {
      type: "INFO",
      message: `Fetching user wallets with token: ${process.env.REACT_APP_WALLET_SERVICE_BASE_URL}/user-wallets`,
    }
  )
  const response = await fetch(
    `${process.env.REACT_APP_WALLET_SERVICE_BASE_URL}/user-wallets`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        'x-jwt-assertion': token,
      },
    }
  );

  logService({
    type: "INFO",
    message: `Fetching user wallets with token: ${response.status}`,
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || "Unknown error";
    throw new Error(
      `Failed to fetch user wallets: ${response.status} - ${errorMessage}`
    );
  }

  return await response.json();
};
