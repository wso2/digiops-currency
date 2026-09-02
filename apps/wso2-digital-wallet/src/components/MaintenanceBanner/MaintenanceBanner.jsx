// Copyright (c) 2026 WSO2 LLC. (https://www.wso2.com).
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
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "react-feather";
import { fetchAppConfigs } from "../../services/wallet.service";
import { requestNavigateToMyApps } from "../../microapp-bridge";
import "./MaintenanceBanner.css";

export const MaintenanceBanner = () => {
  const { data } = useQuery({
    queryKey: ["app-configs"],
    queryFn: fetchAppConfigs,
    refetchInterval: 30000,
  });

  const isMaintenanceMode = !!data?.isMaintenanceMode;

  if (!isMaintenanceMode) {
    return null;
  }

  return (
    <div className="maintenance-overlay">
      <div 
        className="maintenance-card" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="maintenance-title"
      >
        <div className="maintenance-icon-wrapper">
          <AlertTriangle color="#ff7300" size={36} />
        </div>
        <h2 id="maintenance-title" className="maintenance-title">
          Under Maintenance
        </h2>
        <p className="maintenance-text">
          The app is currently undergoing maintenance and is temporarily unavailable. We apologize for any inconvenience caused. Please check back later.
        </p>
        <button
          type="button"
          onClick={() => requestNavigateToMyApps()}
          className="maintenance-button"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};
