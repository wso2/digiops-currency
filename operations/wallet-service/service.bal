// Copyright (c) 2024, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.
import wallet_service.database;
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

        types:UserWallet userWallet = {
            userEmail: check ctx.getWithType(EMAIL),
            walletAddress
        };

        if check database:isUserWalletExists(walletAddress) {
            log:printInfo(string `Wallet ${walletAddress} already exists`);
            return http:CONFLICT;
        }
        check database:insertUserWallet(userWallet);
        return http:OK;
    }
}
