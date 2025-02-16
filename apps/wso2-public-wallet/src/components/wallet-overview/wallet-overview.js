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
import { Card, Button, Typography, Spin, message, Row, Col } from "antd";
import {
  CopyOutlined,
  ArrowRightOutlined,
  WalletOutlined,
  CheckOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const WalletOverview = ({
  walletAddress,
  tokenBalance,
  isTokenBalanceLoading,
  handleSendClick,
  handleCopy,
  isAccountCopied,
}) => {
  const handleCopyClick = () => {
    handleCopy();
    message.success("Wallet address copied!");
  };

  return (
    <Card
      style={{
        background: "#000",
        color: "#fff",
        borderRadius: 20,
        margin: 20,
      }}
    >
      <Row gutter={16} align="middle">
        {/* Balance Section */}
        <Col span={12}>
          <Title level={4} style={{ color: "#fff" }}>
            Overview
          </Title>
          <Title level={2} style={{ color: "#fff" }}>
            {isTokenBalanceLoading ? <Spin /> : `${tokenBalance} WSO2Coins`}
          </Title>
          <Text style={{ color: "#bbb" }}>{walletAddress}</Text>
        </Col>

        {/* Action Buttons Section */}
        <Col
          span={10}
          style={{ display: "flex", justifyContent: "center", gap: 40 }}
        >
          <Button
            shape="circle"
            size="large"
            icon={<ArrowRightOutlined color="orange" />}
            onClick={handleSendClick}
          />
          <Button shape="circle" size="large" icon={<WalletOutlined />} />
          <Button
            shape="circle"
            size="large"
            icon={isAccountCopied ? <CheckOutlined /> : <CopyOutlined />}
            onClick={handleCopyClick}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default WalletOverview;
