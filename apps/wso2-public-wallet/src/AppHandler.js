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

import React, { useState, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LayoutView from "./LayoutView";
import Profile from "./pages/profile/profile";
import Error from "./pages/not-found/404";
import HistoryPage from "./pages/history/history";
import CreateWallet from "./pages/create-wallet/create-wallet";
import SendTokens from "./pages/send-tokens/send-tokens";
import ConfirmSendTokens from "./pages/confirm-token-send/confirm-token-send";
import RecoverWallet from "./pages/recover-wallet/recover-wallet";
import HomePage from "./pages/home/home";

// Simulate auth data, could be set from a context, or fetched from an API or localStorage
const AppHandler = () => {
  const [auth, setAuth] = useState({
    status: "loading", // 'loading', 'success', 'failed'
    mode: "active", // 'active', 'maintenance'
    roles: [], // user's roles
    statusMessage: "Loading...", // status message during loading
  });

  useEffect(() => {
    // Simulating the fetching of authentication data
    setTimeout(() => {
      // Simulate success auth state, change this as needed
      setAuth({
        status: "success",
        mode: "active",
        roles: ["user", "admin"], // Example roles
        statusMessage: "Authenticated successfully",
      });
    }, 2000); // Simulate a loading time
  }, []);

  // Setting up the router with the active routes
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LayoutView />,
      errorElement: <Error />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/history",
          element: <HistoryPage />,
        },
        {
          path: "/create-wallet",
          element: <CreateWallet />,
        },
        {
          path: "/send-tokens",
          element: <SendTokens />,
        },
        {
          path: "/confirm-tokens-send",
          element: <ConfirmSendTokens />,
        },
        {
          path: "/recover-wallet",
          element: <RecoverWallet />,
        },
      ],
    },
  ]);

  return (
    <>
      {auth.status === "loading" && <div>Loading...</div>}
      {auth.status === "success" && <RouterProvider router={router} />}
      {auth.status === "failed" && <div>Authentication failed</div>}
    </>
  );
};

export default AppHandler;
