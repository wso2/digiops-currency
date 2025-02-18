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
import { Empty, Button } from "antd";
import { NO_RECENT_ACTIVITIES } from "../../constants/Strings";

const NoRecentActivities = () => {

  return (
    <div
      className="no-recent-activities"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        color: "#ffffff",
        flexDirection: "column",
      }}
    >
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{ marginTop: "50px", marginBottom: "30px", color: "#ffffff" }}
        description={<span>{NO_RECENT_ACTIVITIES}</span>}
      />
    </div>
  );
};

export default NoRecentActivities;
