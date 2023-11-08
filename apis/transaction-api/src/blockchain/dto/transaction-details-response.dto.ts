
// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { ApiProperty } from '@nestjs/swagger';

class TransactionDetailsDto {
  @ApiProperty({
    description:
      'The unique identifier for this specific transaction on the blockchain.',
  })
  hash: string;

  @ApiProperty({ description: 'The type of transaction.' })
  type: number;

  @ApiProperty({
    description: 'Access list associated with the transaction.',
    nullable: true,
  })
  accessList: any;

  @ApiProperty({
    description: 'Unique identifier for the block containing the transaction.',
  })
  blockHash: string;

  @ApiProperty({
    description:
      'The number of the block in which this transaction is included.',
  })
  blockNumber: number;

  @ApiProperty({
    description: 'Index position of the transaction in the block.',
  })
  transactionIndex: number;

  @ApiProperty({
    description: 'The number of confirmations received for the transaction.',
  })
  confirmations: number;

  @ApiProperty({ description: 'Wallet address initiating the transaction.' })
  from: string;

  @ApiProperty({
    description: 'The price of gas required for the transaction.',
  })
  gasPrice: any;

  @ApiProperty({
    description: 'The maximum gas that the transaction can consume.',
  })
  gasLimit: any;

  @ApiProperty({
    description: 'Recipient address of the transaction.',
    nullable: true,
  })
  to: string;

  @ApiProperty({ description: 'Value associated with the transaction.' })
  value: any;

  @ApiProperty({ description: 'The transaction count for the sender.' })
  nonce: number;

  @ApiProperty({ description: 'Input data for the transaction.' })
  data: string;

  @ApiProperty({ description: 'ECDSA recovery id.' })
  v: number;

  @ApiProperty({ description: 'ECDSA signature r.' })
  r: string;

  @ApiProperty({ description: 'ECDSA signature s.' })
  s: string;

  @ApiProperty({
    description:
      'Address of the contract created, if the transaction was a contract creation, otherwise null.',
    nullable: true,
  })
  creates: any;

  @ApiProperty({ description: 'Chain ID identifying the current network.' })
  chainId: number;

  // If there are more properties in txDetails, continue in the same format

  @ApiProperty({
    description:
      'Decoded version of the input data, providing more human-readable information.',
  })
  decodedData: {
    args: any[];
    functionFragment: any;
    name: string;
    signature: string;
    sighash: string;
    value: any;
  };
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
