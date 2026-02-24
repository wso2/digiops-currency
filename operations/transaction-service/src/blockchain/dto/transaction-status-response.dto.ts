// Copyright (c) 2026, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { ApiProperty } from '@nestjs/swagger';

class TransactionStatusDto {
  @ApiProperty({
    description: 'The transaction hash (0x-prefixed).',
  })
  txHash: string;

  @ApiProperty({
    description: 'Whether the transaction was found and mined.',
  })
  found: boolean;

  @ApiProperty({
    description: 'Whether the transaction executed successfully (receipt.status === 1).',
  })
  success: boolean;

  @ApiProperty({
    description: 'Human-readable status: SUCCESS, FAILED, or PENDING.',
    enum: ['SUCCESS', 'FAILED', 'PENDING'],
  })
  status: string;

  @ApiProperty({
    description: 'Block number the transaction was mined in, or null if pending.',
    nullable: true,
  })
  blockNumber: number | null;

  @ApiProperty({
    description: 'Number of blocks mined after this transaction (0 if pending).',
  })
  confirmations: number;
}

export class TransactionStatusResponseDto {
  @ApiProperty({
    description:
      'A message indicating the result of the API request, e.g., "success" or "error".',
  })
  message: string;

  @ApiProperty({ description: 'HTTP status code of the response.' })
  httpCode: number;

  @ApiProperty({
    description: 'Transaction confirmation status.',
    type: TransactionStatusDto,
  })
  payload: TransactionStatusDto;
}
