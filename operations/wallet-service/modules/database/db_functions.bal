// Copyright (c) 2024, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.
import wallet_service.types;

import ballerina/sql;

# Check if wallet already exists or not.
#
# + walletAddress - Wallet address
# + return - True if wallet exists, false if not exists, sql:Error if error occurred
public isolated function isUserWalletExists(string walletAddress) returns boolean|sql:Error {
    types:UserWallet|sql:Error walletResponse = dbClient->queryRow(getUserWalletQuery(walletAddress));
    
    if walletResponse is sql:NoRowsError {
        return false;
    }
    if walletResponse is sql:Error {
        return walletResponse;
    }
    return true;
}

# Check if this is the user's first wallet.
#
# + userEmail - User email
# + return - True if this is the first wallet, false if user already has wallets, sql:Error if error occurred
public isolated function isUserFirstWallet(string userEmail) returns boolean|sql:Error {
    WalletCountResult|sql:Error result = dbClient->queryRow(getUserWalletCountQuery(userEmail));
    
    if result is sql:NoRowsError {
        return true;
    }
    if result is sql:Error {
        return result;
    }
    return result.walletCount == 0;
}

# Get wallet details by wallet address.
#
# + walletAddress - Wallet address
# + return - UserWallet details if found, null if not found, sql:Error if database error occurred
public isolated function getUserWallet(string walletAddress) returns types:UserWallet|sql:Error? {
    types:UserWallet|sql:Error walletResponse = dbClient->queryRow(getUserWalletQuery(walletAddress));
    if walletResponse is sql:NoRowsError {
        return ();
    }
    return walletResponse;
}

# Get all wallet addresses with default flag for a user.
#
# + userEmail - The email address of the user whose wallets are listed
# + return - An array of WalletAddressInfo records, or sql:Error if the query fails
public isolated function getWalletAddressesByEmail(string userEmail) returns types:WalletAddressInfo[]|sql:Error {
    stream<types:WalletAddressInfo, sql:Error?> walletListStream = dbClient->query(getWalletAddressesByEmailQuery(userEmail));
    
    return from types:WalletAddressInfo wallet in walletListStream
        select wallet;
}

# Insert a user wallet.
#
# + userWallet - User wallet information
# + return - sql:Error if error occurred
public isolated function insertUserWallet(types:UserWallet userWallet) returns sql:Error? {
    _ = check dbClient->execute(insertUserWalletQuery(userWallet));
}

# Set a wallet as primary for a user.
#
# + userEmail - The email address of the user
# + walletAddress - The wallet address to set as primary
# + return - sql:Error if error occurred, otherwise nothing
public isolated function setWalletAsPrimary(string userEmail, string walletAddress) returns sql:Error? {
    _ = check dbClient->execute(setWalletAsPrimaryQuery(userEmail, walletAddress));
}
