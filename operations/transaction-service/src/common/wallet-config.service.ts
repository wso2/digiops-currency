// Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export interface WalletConfig {
  WALLET_ADDRESS: string;
  WALLET_PRIVATE_KEY: string;
}

@Injectable()
export class WalletConfigService {
  private readonly logger = new Logger(WalletConfigService.name);
  private walletConfigs: Record<string, WalletConfig> = {};

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    try {
      const configPath = resolve(__dirname, '../config/wallet-config.json');
      const data = readFileSync(configPath, 'utf-8');
      this.walletConfigs = JSON.parse(data);
      this.logger.log('Wallet config loaded successfully');
    } catch (error) {
      this.logger.error('Failed to load wallet config', error);
    }
  }

  getWalletConfig(clientId: string): WalletConfig | undefined {
    return this.walletConfigs[clientId];
  }
}
