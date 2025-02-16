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
    <Card style={{ background: "#000", color: "#fff", borderRadius: 20, margin: 20 }}> 
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
            icon= {isAccountCopied ?  <CheckOutlined />: <CopyOutlined />}
            onClick={handleCopyClick}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default WalletOverview;
