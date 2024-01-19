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
