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

import React from "react";
import { BrowserRouter as Routes, Route } from "react-router-dom";
import HomePage from "./home/home";
import HistoryPage from "./history/history";
import CreateWallet from "./create-wallet/create-wallet";
import ProfilePage from "./profile/profile";
import RecoverWallet from "./recover-wallet/recover-wallet";
import SendTokens from "./send-tokens/send-tokens";
import ConfirmSendTokens from "./confirm-token-send/confirm-token-send";

const Pages = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/create-wallet" element={<CreateWallet />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/recover-wallet" element={<RecoverWallet />} />
      <Route path="/send-tokens" element={<SendTokens />} />
      <Route path="/confirm-tokens-send" element={<ConfirmSendTokens />} />
    </Routes>
  );
};

export default Pages;
