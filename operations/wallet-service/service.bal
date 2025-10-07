// Copyright (c) 2024, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.
import wallet_service.database;
import wallet_service.transactions;
import wallet_service.types;

import ballerina/http;
import ballerina/log;

@display {
    label: "Wallet Service",
    id: "currency/wallet-service"
}
service http:InterceptableService / on new http:Listener(9091) {

    public function createInterceptors() returns JwtInterceptor => new JwtInterceptor();

    # Add user wallet.
    #
    # + ctx - Request context
    # + payload - Request payload with walletAddress
    # + return - http:Created, http:Conflict, or http:InternalServerError
    resource function post wallets(http:RequestContext ctx, types:CreateWalletPayload payload)
        returns http:Created|http:Conflict|http:InternalServerError {

        string walletAddress = payload.walletAddress;

        string|error userEmail = ctx.getWithType(EMAIL);
        if userEmail is error {
            log:printError("Failed to get user email from context", userEmail);
            return <http:InternalServerError>{
                body: {
                    "message": "Failed to get user context"
                }
            };
        }

        boolean|error walletExists = database:isUserWalletExists(walletAddress);
        if walletExists is error {
            log:printError(string `Error checking if wallet exists: ${walletAddress}`, walletExists);
            return <http:InternalServerError>{
                body: {
                    "message": "Error while creating the wallet"
                }
            };
        }
        
        if walletExists {
            log:printInfo(string `Wallet ${walletAddress} already exists`);
            return http:CONFLICT;
        }

        transaction {
            types:UserWallet userWallet = {
                userEmail,
                walletAddress
            };
            boolean isFirstWallet = check database:isUserFirstWallet(userWallet.userEmail);
            if isFirstWallet {
                userWallet.initialCoinsAllocated = transactions:initialCoins;
                check database:insertUserWallet(userWallet);
                boolean coinsAllocated = check transactions:allocateInitialCoins(walletAddress);
                if !coinsAllocated {
                    log:printError(string `Failed to allocate initial coins to wallet ${walletAddress}`);
                    check error("Failed to allocate initial coins to wallet");
                }
                log:printInfo(string `Successfully allocated ${transactions:initialCoins} coins to wallet ${walletAddress}`);
            } else {
                userWallet.initialCoinsAllocated = 0.0;
                check database:insertUserWallet(userWallet);
            }
            check commit;
        } on fail error e {
            log:printError(string `Wallet creation failed for wallet ${walletAddress}`, e);
            return <http:InternalServerError>{
                body: {
                    "message": "Error while creating the wallet"
                }
            };
        }

        return http:CREATED;
    }

    # Get user wallets.
    #
    # + ctx - Request context
    # + return - List of wallet addresses and default flag, or http:InternalServerError
    resource function get wallets(http:RequestContext ctx) returns types:WalletAddressInfo[]|http:InternalServerError {

        string|error email = ctx.getWithType(EMAIL);
        if email is error {
            log:printError("Failed to get user email from context", email);
            return <http:InternalServerError>{
                body: {
                    "message": "Failed to get user context"
                }
            };
        }
        
        types:WalletAddressInfo[]|error walletList = database:getWalletAddressesByEmail(email);
        
        if walletList is error {
            log:printError(string `Failed to fetch wallet addresses for user ${email}`, walletList);
            return <http:InternalServerError>{
                body: {
                    "message": "Error while fetching wallets"
                }
            };
        }

        return walletList;
    }

    # Set wallet as primary.
    #
    # + ctx - Request context
    # + address - Wallet address to set as primary
    # + return - http:OK, http:NotFound, http:Forbidden, or http:InternalServerError
    resource function post wallets/[string address]/set\-primary(http:RequestContext ctx)
        returns http:Ok|http:NotFound|http:Forbidden|http:InternalServerError {

        string|error email = ctx.getWithType(EMAIL);
        if email is error {
            log:printError("Failed to get user email from context", email);
            return <http:InternalServerError>{
                body: {
                    "message": "Failed to get user context"
                }
            };
        }
        
        types:UserWallet|error? walletDetails = database:getUserWallet(address);
        if walletDetails is error {
            log:printError(string `Error getting wallet details for ${address}`, walletDetails);
            return <http:InternalServerError>{
                body: {
                    "message": "Error while setting wallet as primary"
                }
            };
        } else if walletDetails is () {
            log:printWarn(string `Wallet ${address} not found`);
            return http:NOT_FOUND;
        } else if walletDetails.userEmail != email {
            log:printError(string `Wallet ${address} does not belong to user ${email}.`);
            return http:FORBIDDEN;
        }
        
        error? result = database:setWalletAsPrimary(email, address);
        if result is error {
            log:printError(string `Failed to set wallet ${address} as primary for user ${email}`, result);
            return <http:InternalServerError>{
                body: {
                    "message": "Error while setting wallet as primary"
                }
            };
        }
        return http:OK;
    }
}
