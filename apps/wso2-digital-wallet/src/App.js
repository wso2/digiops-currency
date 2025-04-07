// Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import "./App.css";
import { HashRouter as Router } from "react-router-dom";
import LayoutView from "./LayoutView";
import { useEffect } from "react";
import { logService } from "./services/wallet.service";
import { ModalProvider } from "./context/WalletsContext";

function App() {
  return (
    <ModalProvider>
      <Router>
        <div className="App">
          <LayoutView />
        </div>
      </Router>
    </ModalProvider>
  );
}

export default App;
