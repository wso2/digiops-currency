import React from "react";
import { Button, Typography, Row, Col } from "antd";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <Row
      justify="center"
      align="middle"
      style={{
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <Col>
        <Typography.Title level={1} style={{ color: "gray" }}>
          404
        </Typography.Title>
        <Typography.Text style={{ color: "gray" }}>
          The page you’re looking for doesn’t exist.
        </Typography.Text>
        <div style={{ marginTop: "20px" }}>
          <Button type="primary" size="large" href="/">
            Back Home
          </Button>
        </div>
      </Col>
    </Row>
  );
}

export default Error;