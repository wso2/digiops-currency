// Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { Injectable, Logger } from '@nestjs/common';
import { readFileSync, existsSync } from 'fs';

export interface WalletConfig {
  PUBLIC_WALLET_ADDRESS: string;
  USE_CASE: string;
  CONTRACT_ADDRESS?: string;
}

@Injectable()
export class WalletConfigService {
  private readonly logger = new Logger(WalletConfigService.name);
  getWalletConfig(clientId: string): WalletConfig | undefined {
    try {
      const configPath = '/src/config/client-address-mapping.json';
      if (!existsSync(configPath)) {
        this.logger.warn(`Wallet config file not found at ${configPath}`);
        return undefined;
      }
      const data = readFileSync(configPath, 'utf-8');
      const mapping = JSON.parse(data);
      const walletConfig = mapping[clientId];
      if (!walletConfig) {
        this.logger.warn(`No wallet config found for clientId: ${clientId}`);
        return undefined;
      }
      this.logger.log(`Wallet config loaded for clientId: ${clientId}`);
      return walletConfig;
    } catch (error) {
      this.logger.error(`Failed to load wallet config for clientId: ${clientId}`, error);
      return undefined;
    }
  }
}
