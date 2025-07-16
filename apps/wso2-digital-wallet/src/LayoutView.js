// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { Layout } from "antd";
import React, { useEffect, useState } from "react";
import NavBar from "./components/NavBar/NavBar";
import FooterBar from "./components/Footer/Footer";
import Pages from "./pages/Pages";
// import "./dark-theme.css";
// import "./light-theme.css";
import { useLocation } from "react-router-dom";

function LayoutView() {
  const { Content } = Layout;
  const location = useLocation();

  const [isShowNavBar, setIsShowNavBar] = useState(false);
  const [isShowFooter, setIsShowFooter] = useState(false);

  useEffect(() => {
    if (
      location.pathname === "/create-wallet" ||
      location.pathname === "/wallet-phrase" ||
      location.pathname === "/recover-wallet" ||
      location.pathname === "/history"
    ) {
      setIsShowNavBar(false);
    } else {
      setIsShowNavBar(true);
    }

    if (
      location.pathname === "/create-wallet" ||
      location.pathname === "/wallet-phrase" ||
      location.pathname === "/recover-wallet"
    ) {
      setIsShowFooter(false);
    } else {
      setIsShowFooter(true);
    }
  }, [location]);

  return (
    <div className="main-background">
      <div className="col-lg-3 col-md-3 col-sm-12">
        <Layout className="main-layout">
          {isShowNavBar ? <NavBar /> : <></>}

          <Layout className="site-layout">
            <Content className="layout-content">
              <div className="mt-3 mx-auto">
                <div>
                  <Pages />
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
        {isShowFooter ? (
          <div className="footer-wrapper">
            <FooterBar className="footer-bar" />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default LayoutView;
