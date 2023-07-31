// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import CreateWallet from "./CreateWallet/CreateWallet";
import SendAssets from "./SendAssets/SendAssets";
import ConfirmSendAssets from "./SendAssets/ConfirmSendAssets";
import RecoverWallet from "./RecoverWallet/RecoverWallet";
import Profile from "./Profile/Profile";
import History from "./History/History";

function Pages() {
  return (
    <Routes>
      <Route path="/" exact element={<Home />} />
      <Route path="/create-wallet" exact element={<CreateWallet />} />
      <Route path="/send" exact element={<SendAssets />} />
      <Route
        path="/confirm-assets-send"
        exact
        element={<ConfirmSendAssets />}
      />
      <Route path="/recover-wallet" exact element={<RecoverWallet />} />
      <Route path="/profile" exact element={<Profile />} />
      <Route path="/history" exact element={<History />} />
    </Routes>
  );
}

export default Pages;
