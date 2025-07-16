// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import React, { useEffect } from "react";
import TransactionHistory from "../../components/History/TransactionHistory";

function History() {
  useEffect(() => {
    document.body.classList.add('history-active');
    
    return () => {
      document.body.classList.remove('history-active');
    };
  }, []);

  return (
    <div className="history-page">
      <div className="history-content">
        <TransactionHistory />
      </div>
    </div>
  );
}

export default History;
