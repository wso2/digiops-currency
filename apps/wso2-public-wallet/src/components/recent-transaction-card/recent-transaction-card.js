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
import { Card, Row, Col, Avatar, Typography } from "antd";
import {
  ArrowUpOutlined,
  WalletOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import moment from "moment";

const { Text } = Typography;

const RecentTransactionCard = ({ transaction }) => {
  const isSent = transaction.direction === "send";

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: "12px",
        backgroundColor: isSent ? "#F3F5FA" : "#FFFFFF",
        padding: "12px",
        marginBottom: "8px",
        marginHorizontal: "100x",
      }}
    >
      <Row align="middle" gutter={[16, 16]}>
        <Col>
          <Avatar
            size={40}
            style={{
              backgroundColor: isSent ? "#E0EAFB" : "#DFFFE2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isSent ? (
              <SwapOutlined style={{ color: "#3969B2", fontSize: "18px" }} />
            ) : (
              <WalletOutlined style={{ color: "#147A3D", fontSize: "18px" }} />
            )}
          </Avatar>
        </Col>
        <Col flex="auto">
          <Text strong>
            {isSent ? "Send to" : "Received from"} {transaction.address}
          </Text>
          <br />
          <Text type="secondary">
            {moment(transaction.timestamp).format("MMMM Do YYYY, h:mm A")}
          </Text>
        </Col>
        <Col>
          <Text
            strong
            style={{
              color: isSent ? "#3969B2" : "#147A3D",
              fontSize: "16px",
            }}
          >
            {isSent ? "-" : "+"} {transaction.tokenAmount.toLocaleString()}{" "}
            {transaction.token}
          </Text>
        </Col>
      </Row>
    </Card>
  );
};

export default RecentTransactionCard;
