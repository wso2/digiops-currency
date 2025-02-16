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