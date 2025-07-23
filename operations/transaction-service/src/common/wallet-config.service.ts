// Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { Injectable, Logger } from '@nestjs/common';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export interface WalletConfig {
  WALLET_ADDRESS: string;
  WALLET_PRIVATE_KEY: string;
}

@Injectable()
export class WalletConfigService {
  private readonly logger = new Logger(WalletConfigService.name);
  getWalletConfig(clientId: string): WalletConfig | undefined {
    try {
      const configPath = resolve(__dirname, '../config/wallets', `wallet-config-${clientId}.json`);
      if (!existsSync(configPath)) {
        this.logger.warn(`Wallet config file not found for clientId: ${clientId}`);
        return undefined;
      }
      const data = readFileSync(configPath, 'utf-8');
      const config = JSON.parse(data);
      this.logger.log(`Wallet config loaded for clientId: ${clientId}`);
      return config;
    } catch (error) {
      this.logger.error(`Failed to load wallet config for clientId: ${clientId}`, error);
      return undefined;
    }
  }
}
