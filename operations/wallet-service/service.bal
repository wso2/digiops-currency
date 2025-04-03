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
    resource function post user\-wallet(http:RequestContext ctx, string walletAddress, int? defaultWallet)
        returns http:Ok|http:Conflict|error|http:InternalServerError? {

        types:UserWallet userWallet = {
            userEmail: check ctx.getWithType(EMAIL),
            walletAddress: walletAddress,
            defaultWallet: defaultWallet is int ? defaultWallet : 0
        };
        if check database:isUserWalletExists(walletAddress) && defaultWallet is int && defaultWallet == 0 {
            log:printInfo(string `Wallet ${walletAddress} already exists`);
            return http:CONFLICT;
        }

        types:UserWallet[]|error walletResponse = database:getUserWallets(userWallet.userEmail);

        if walletResponse is error {
            log:printError("Error while getting user wallets", walletResponse);
            return http:INTERNAL_SERVER_ERROR;
        }

        boolean isDefaultWallet = false;

        if walletResponse is types:UserWallet[] && walletResponse.length() > 0 {
            foreach types:UserWallet wallet in walletResponse {
                if (wallet.walletAddress.toString() != userWallet.walletAddress.toString()) {
                    wallet.defaultWallet = 0;
                    check database:updateUserWallet(wallet);
                } else {
                    isDefaultWallet = true;
                }
            }
            log:printInfo("Updating default wallet");
        }
        
        log:printInfo("Inserting user wallet");

        if isDefaultWallet {
            check database:updateUserWallet(userWallet);
            return http:OK;
        }
        check database:insertUserWallet(userWallet);
        return http:OK;
    }

    # Get user wallets.
    # + ctx - Request context
    # + return - Wallet addresses of the user
    # + return - Error if error occurred
    resource function get user\-wallets(http:RequestContext ctx)
        returns types:UserWallet[]|error? {

        log:printInfo("Getting user wallets");
        string userEmail = check ctx.getWithType(EMAIL);
        types:UserWallet[]|error walletAddresses = check database:getUserWallets(userEmail);
        if walletAddresses is error {
            log:printError("Error while getting user wallets", walletAddresses);
            return walletAddresses;
        }
        return walletAddresses;
    }

}
