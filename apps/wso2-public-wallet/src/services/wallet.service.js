// Copyright (c) 2025 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

// get tokens using storage keys...
// import { getTokenAsync } from "../helpers/auth";

export const updateUserWalletAddress = async (walletAddress) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_WALLET_SERVICE_BASE_URL}/user-wallet?walletAddress=${walletAddress}`,
      {
        method: "POST",
        headers: {
          //   Authorization: `Bearer ${await getTokenAsync()}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || "Unknown error";
      throw new Error(
        `Failed to update user wallet address: ${response.status} - ${errorMessage}`
      );
    }
  } catch (error) {
    console.error("Error while updating user wallet address: ", error);
    throw error;
  }
};
