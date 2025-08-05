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

# Check if this is the user's first wallet.
#
# + userEmail - User email
# + return - True if this is the first wallet, false if user already has wallets, error if error occurred
public isolated function isUserFirstWallet(string userEmail) returns boolean|sql:Error {
    record {int wallet_count;}|sql:Error result = dbClient->queryRow(getUserWalletCountQuery(userEmail));
    if result is sql:NoRowsError {
        return true;
    } else if result is sql:Error {
        log:printError("Error while checking user wallet count", result);
        return result;
    } else {
        return result.wallet_count == 0;
    }
}

# Get all wallet addresses for a user with default flag.
#
# + userEmail - The email address of the user whose wallets are listed.
# + return - An array of WalletAddressInfo records, or a sql:Error if the query fails.
public isolated function getWalletAddressesByEmail(string userEmail) returns types:WalletAddressInfo[]|sql:Error {
    
    stream<types:WalletAddressInfo, sql:Error?> walletListStream = dbClient->query(getWalletAddressesByEmailQuery(userEmail));
    
    return from types:WalletAddressInfo wallet in walletListStream
        select wallet;
}
