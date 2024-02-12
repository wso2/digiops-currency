// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
@Controller()
@ApiTags('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check of WSO2 transactional api',
  })
  @ApiResponse({
    status: 200,
    description: 'Get welcome message.',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request or wallet address not found.',
  })
  @ApiResponse({ status: 500, description: 'Server Error.' })
  getHealth(): string {
    return this.appService.getHealth();
  }
}
