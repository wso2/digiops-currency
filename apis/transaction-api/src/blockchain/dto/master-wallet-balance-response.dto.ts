// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { ApiProperty } from '@nestjs/swagger';

class MasterWalletBalanceDto {
  @ApiProperty({ description: 'The wallet address of the ws02 master wallet' })
  masterWalletAddress: string;

  @ApiProperty({ description: 'WSO2 Token balance' })
  balance: string;

  @ApiProperty({
    description:
      "This value represents the balance of WSO2 tokens in Solidity's format. Solidity doesn't support floating-point numbers, so values are represented by multiplying with 10 raised to the power of the decimal precision defined in our smart contract Example: 1.5 WSO2 tokens will be represented as 1500000000000000000.",
  })
  tokenBalanceUnFormatted: string;

  @ApiProperty({
    description: "The token's decimal precision defined in our smart contract.",
  })
  decimals: number;
}

export class MasterWalletBalanceResponseDto {
  @ApiProperty({
    description:
      'A message indicating the result of the API request, e.g., "success" or "error".',
  })
  message: string;

  @ApiProperty({ description: 'HTTP status code of the response.' })
  httpCode: number;

  @ApiProperty({
    description: 'WSO2 token balance of the master wallet and its details.',
    type: MasterWalletBalanceDto,
  })
  payload: MasterWalletBalanceDto;
}
