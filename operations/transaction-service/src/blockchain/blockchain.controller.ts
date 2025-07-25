// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { HttpResponseService } from '../common/http-response.service';
import {
  Get,
  Controller,
  HttpStatus,
  Req,
  Res,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { TransferTokenDto } from './dto/transfer-token.dto';
import { MasterWalletBalanceResponseDto } from './dto/master-wallet-balance-response.dto';
import { WalletBalanceByAddressResponseDto } from './dto/wallet-balance-response.dto';
import { TokenTransferResponseDto } from './dto/token-transfer-response.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('blockchain')
@ApiTags('Transactional')
export class BlockchainController {
  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly httpResponseService: HttpResponseService,
  ) {}

  @Get('master-wallet-balance')
  @ApiOperation({
    summary: 'Get master wallet balance',
    description:
      'This endpoint will return master wallet balance in wso2 tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieve master wallet balance.',
    type: MasterWalletBalanceResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 500, description: 'Server Error.' })
  async getMasterWalletBalance(@Req() req, @Res() response) {
    try {
      const clientId = (req as any).clientId;
      const result = await this.blockchainService.getMasterWalletTokenBalance(clientId);
      return response
        .status(HttpStatus.OK)
        .json(
          this.httpResponseService.send(
            this.httpResponseService.SUCCESS,
            HttpStatus.OK,
            result,
          ),
        );
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json(
          this.httpResponseService.send(
            error.message || this.httpResponseService.ERROR,
            HttpStatus.BAD_REQUEST,
            null,
          ),
        );
    }
  }

  @ApiOperation({ summary: 'Retrieve wso2 token balance by wallet address' })
  @ApiParam({
    name: 'walletAddress',
    description: 'Address of the wallet',
    required: true,
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved balance.',
    type: WalletBalanceByAddressResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request or wallet address not found.',
  })
  @ApiResponse({ status: 500, description: 'Server Error.' })
  @Get('get-balance/:walletAddress')
  async getBalanceByWalletAddress(
    @Param('walletAddress') walletAddress: string,
    @Res() response,
  ) {
    try {
      const result = await this.blockchainService.getWalletTokenBalance(
        walletAddress,
      );
      return response
        .status(HttpStatus.OK)
        .json(
          this.httpResponseService.send(
            this.httpResponseService.SUCCESS,
            HttpStatus.OK,
            result,
          ),
        );
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json(
          this.httpResponseService.send(
            error.message || this.httpResponseService.ERROR,
            HttpStatus.BAD_REQUEST,
            null,
          ),
        );
    }
  }

  @Post('transfer-token')
  @ApiOperation({ summary: 'Transfer tokens to a specified wallet address' })
  @ApiBody({
    type: TransferTokenDto,
    description:
      'Recipient wallet address and amount are required for token transfer',
  })
  @ApiResponse({
    status: 200,
    description: 'Token successfully transferred.',
    type: TokenTransferResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request or transfer failed.' })
  @ApiResponse({ status: 500, description: 'Server Error.' })
  async transferTokens(
    @Body() transferTokenDto: TransferTokenDto,
    @Req() req,
    @Res() response,
  ) {
    try {
      const clientId = (req as any).clientId;
      const result = await this.blockchainService.transferTokens(
        clientId,
        transferTokenDto.recipientWalletAddress,
        transferTokenDto.amount,
      );
      return response
        .status(HttpStatus.OK)
        .json(
          this.httpResponseService.send(
            this.httpResponseService.SUCCESS,
            HttpStatus.OK,
            result,
          ),
        );
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json(
          this.httpResponseService.send(
            error.message || this.httpResponseService.ERROR,
            HttpStatus.BAD_REQUEST,
            null,
          ),
        );
    }
  }

  @Get('get-transaction-details/:txHash')
  @ApiOperation({
    summary: 'Get the full transaction details of the given tx hash',
  })
  @ApiParam({
    name: 'txHash',
    description: 'Transaction hash of the transaction start with 0x',
    required: true,
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved balance.',
    type: WalletBalanceByAddressResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request or wallet address not found.',
  })
  @ApiResponse({ status: 500, description: 'Server Error.' })
  async getTransactionDetailsByTxHash(
    @Param('txHash') txHash: string,
    @Res() response,
  ) {
    try {
      const result = await this.blockchainService.getTransactionDetailsByTxHash(
        txHash,
      );
      return response
        .status(HttpStatus.OK)
        .json(
          this.httpResponseService.send(
            this.httpResponseService.SUCCESS,
            HttpStatus.OK,
            result,
          ),
        );
    } catch (error) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json(
          this.httpResponseService.send(
            error.message || this.httpResponseService.ERROR,
            HttpStatus.BAD_REQUEST,
            null,
          ),
        );
    }
  }
}
