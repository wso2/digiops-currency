// Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import React from 'react';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import { WSO2_TOKEN } from '../../constants/strings';
import { formatWalletAddress, copyToClipboard } from '../../utils/transactionUtils';

const TransactionItem = ({ transaction, index }) => {
  const addressToCopy = transaction.direction === "send" ? transaction.to : transaction.from;

  return (
    <div 
      key={index} 
      className="transaction-item mt-4" 
      onClick={() => copyToClipboard(addressToCopy, transaction.direction)}
      style={{ cursor: 'pointer' }}
    >
      <div className="d-flex justify-content-between w-100">
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', flexShrink: 0 }}>
            {transaction.direction === "send" ? (
              <ArrowUpOutlined
                className="red-text"
                style={{ fontSize: 24 }}
              />
            ) : (
              <ArrowDownOutlined
                className="green-text"
                style={{ fontSize: 24 }}
              />
            )}
          </div>
          <div className="d-flex flex-column mx-3 text-start">
            <span className="recent-activity-topic fw-normal">
              {transaction.direction === "send" ? "Sent" : "Received"}
            </span>
            <span className="recent-activity-address text-muted">
              {transaction.direction === "send" 
                ? `${formatWalletAddress(transaction.to)}`
                : `${formatWalletAddress(transaction.from)}`
              }
            </span>
            <span className="recent-activity-time">
              {transaction.timestamp}
            </span>
          </div>
        </div>
        <span
          className={`recent-activity-value ${
            transaction.direction === "send" ? "red-text" : "green-text"
          }`}
        >
          {transaction.direction === "send" ? "-" : "+"}
          {transaction.value} {WSO2_TOKEN}
        </span>
      </div>
    </div>
  );
};

export default TransactionItem;
