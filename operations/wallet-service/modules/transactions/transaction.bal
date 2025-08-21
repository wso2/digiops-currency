// Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import ballerina/http;
import ballerina/log;

public configurable decimal initialCoins = 10.0;

# Allocate initial coins to a new wallet using transaction service.
#
# + walletAddress - Target wallet address
# + return - true if successful, error otherwise
public isolated function allocateInitialCoins(string walletAddress) returns boolean|error {
    TokenTransferRequest transferPayload = {
        recipientWalletAddress: walletAddress,
        amount: initialCoins
    };
    
    http:Response response = check transactionServiceClient->post("/api/v1/blockchain/transfer-token", transferPayload);
    
    if response.statusCode != 200 {
        string errorMessage = string `Error while transfering coins`;
        log:printError(string `${errorMessage} : ${(check response.getJsonPayload()).toString()}!`);
        return error(errorMessage);
    }
    
    return true;
}
