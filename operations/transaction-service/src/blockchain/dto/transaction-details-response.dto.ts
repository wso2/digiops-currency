// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { ApiProperty } from '@nestjs/swagger';

class TransactionDetailsDto {
  @ApiProperty({
    description: 'The transaction hash (0x-prefixed).',
  })
  txHash: string;

  @ApiProperty({
    description: 'Whether the transaction was found on-chain.',
  })
  found: boolean;

  @ApiProperty({
    description: 'Whether the transaction executed successfully (receipt.status === 1).',
  })
  success: boolean;

  @ApiProperty({
    description: 'Human-readable status of the transaction.',
    enum: ['SUCCESS', 'FAILED', 'PENDING', 'NOT_FOUND'],
  })
  status: string;

  @ApiProperty({
    description: 'ISO-8601 timestamp of the block containing the transaction, or null if unknown.',
    nullable: true,
  })
  timestamp: string | null;

  @ApiProperty({
    description:
      'Formatted transferred token amount using the token decimals (human-readable), or null if not applicable/unavailable.',
    nullable: true,
  })
  amountFormatted: string | null;

  @ApiProperty({
    description: 'Raw transaction details returned by the provider, or null if not found.',
    nullable: true,
  })
  txDetails: any | null;

  @ApiProperty({
    description:
      'Decoded version of the input data, providing more human-readable information about the call, or null if not found.',
    nullable: true,
  })
  decodedData:
    | {
        args: any[];
        functionFragment: any;
        name: string;
        signature: string;
        sighash: string;
        value: any;
      }
    | null;
}

export class TransactionDetailsResponseDto {
  @ApiProperty({
    description:
      'A message indicating the result of the API request, e.g., "success" or "error".',
  })
  message: string;

  @ApiProperty({ description: 'HTTP status code of the response.' })
  httpCode: number;

  @ApiProperty({
    description: 'Detailed information about the transaction.',
    type: TransactionDetailsDto,
  })
  payload: TransactionDetailsDto;
}
