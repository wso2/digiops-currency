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

    # Get all wallet addresses.
    #
    # + ctx - Request context
    # + return - List of wallet addresses and default flag
    resource function get user\-wallets(http:RequestContext ctx) 
        returns http:Ok|http:NotFound|error {

        string email = check ctx.getWithType(EMAIL);
        types:WalletAddressInfo[]|error walletList = database:getWalletAddressesForUser(email);
        
        if walletList is error {
            log:printError(string `Failed to fetch wallet addresses for user ${email}`, walletList);
            return http:NOT_FOUND;
        }

        return <http:Ok> {body: walletList};
    }
}
