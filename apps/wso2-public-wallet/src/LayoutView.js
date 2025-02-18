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

import { Layout } from "antd";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./components/navbar/NavBar";

function LayoutView() {
  const { Content } = Layout;
  const location = useLocation();
  const [isShowNavBar, setIsShowNavBar] = useState(true);

  useEffect(() => {
    if (
      location.pathname === "/wallet-phrase"
      // || location.pathname === '/create-wallet'
    ) {
      setIsShowNavBar(false);
    } else {
      setIsShowNavBar(true);
    }
  }, [location]);
  return (
    <Layout>
      {isShowNavBar && <NavBar />}
      <Content>
        <div>
            <Outlet />
        </div>
      </Content>
    </Layout>
  );
}

export default LayoutView;
