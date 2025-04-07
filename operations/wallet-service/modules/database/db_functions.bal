// Copyright (c) 2024, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.
import wallet_service.types;

import ballerina/log;
import ballerina/sql;

# Check if wallet already exists or not.
#
# + walletAddress - Wallet address
# + return - True if wallet exists, false if not exists, error if error occurred
public isolated function isUserWalletExists(string walletAddress) returns boolean|sql:Error {
    types:UserWallet|sql:Error walletResponse = dbClient->queryRow(getUserWalletQuery(walletAddress));
    if walletResponse is sql:Error && walletResponse !is sql:NoRowsError {
        log:printError("Error while checking user wallet", walletResponse, info = walletResponse.toString());
        return walletResponse;
    }
    return walletResponse is types:UserWallet;
}

# Insert a user wallet.
#
# + userWallet - User wallet information
# + return - Error if error occurred
public isolated function insertUserWallet(types:UserWallet userWallet) returns sql:Error? {
    sql:ExecutionResult|sql:Error result = dbClient->execute(insertUserWalletQuery(userWallet));
    if result is error {
        log:printError("Error while inserting user wallet", result, info = result.toString());
        return result;
    }
}


# Description.
#
# + userEmail - parameter description
# + return - return value description
public isolated function getUserWallets(string userEmail) returns types:UserWallet[]|error {
    stream<types:UserWallet , error?> walletStream = dbClient->query(getUserWalletsQuery(userEmail));
    if (walletStream.next() is error) {
        log:printError("Error while getting user wallets");
        return error("Error while getting user wallets");
    }
    return from types:UserWallet wallet in walletStream 
        select wallet; 
}

# Description.
#
# + userWallet - parameter description
# + return - return value description
public isolated function updateUserWallet(types:UserWallet userWallet) returns sql:Error? {
    sql:ExecutionResult|sql:Error result = dbClient->execute(updateUserWalletQuery(userWallet));
    if result is error {
        log:printError("Error while inserting user wallet", result, info = result.toString());
        return result;
    }
}