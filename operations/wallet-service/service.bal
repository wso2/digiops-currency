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
    # TODO: Refactor to POST /wallets with walletAddress in request body
    #
    # + ctx - Request context
    # + walletAddress - Wallet address
    # + return - http:OK if user wallet added successfully, http:Conflict if user wallet already exists
    resource function post user\-wallet(http:RequestContext ctx, string walletAddress)
        returns http:Ok|http:Conflict|error {

        if check database:isUserWalletExists(walletAddress) {
            log:printInfo(string `Wallet ${walletAddress} already exists`);
            return http:CONFLICT;
        }

        transaction {
            types:UserWallet userWallet = {
                userEmail: check ctx.getWithType(EMAIL),
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
            return e;
        }

        return http:OK;
    }

    # Get user wallets.
    # TODO: Refactor to GET /wallets
    #
    # + ctx - Request context
    # + return - List of wallet addresses and default flag
    resource function get user\-wallets(http:RequestContext ctx) returns types:WalletAddressInfo[]|error {

        string email = check ctx.getWithType(EMAIL);
        types:WalletAddressInfo[]|error walletList = database:getWalletAddressesByEmail(email);
        
        if walletList is error {
            log:printError(string `Failed to fetch wallet addresses for user ${email}`, walletList);
            return error("Failed to fetch user wallets.");
        }

        return error("Failed to fetch user wallets.");
    }

    # Set wallet as primary.
    #
    # + ctx - Request context
    # + address - Wallet address to set as primary
    # + return - http:OK if wallet set as primary successfully, http:NotFound if wallet not found, http:Forbidden if wallet doesn't belong to user
    resource function post wallets/[string address]/set\-primary(http:RequestContext ctx)
        returns http:Ok|http:NotFound|http:Forbidden|error {

        string email = check ctx.getWithType(EMAIL);
        
        types:UserWallet|error? walletDetails = database:getUserWallet(address);
        
        if walletDetails is error {
            log:printError(string `Error getting wallet details for ${address}`, walletDetails);
            return error("Failed to get wallet details.");
        } else if walletDetails is () {
            log:printWarn(string `Wallet ${address} not found`);
            return http:NOT_FOUND;
        } else if walletDetails.userEmail != email {
            log:printWarn(string `Wallet ${address} does not belong to user ${email}.`);
            return http:FORBIDDEN;
        }
        
        error? result = database:setWalletAsPrimary(email, address);
        
        if result is error {
            log:printError(string `Failed to set wallet ${address} as primary for user ${email}`, result);
            return error("Failed to set wallet as primary.");
        }
        return http:OK;
    }
}
