// Copyright (c) 2024, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.
import wallet_service.types;

import ballerina/sql;

isolated function getUserWalletQuery(string walletAddress) returns sql:ParameterizedQuery =>
    `SELECT
        user_email,
        wallet_address
    FROM
        user_wallet
    WHERE
        wallet_address = ${walletAddress}`;

isolated function insertUserWalletQuery(types:UserWallet userWallet) returns sql:ParameterizedQuery =>
    `INSERT INTO user_wallet (
        user_email,
        wallet_address
    ) VALUES (
        ${userWallet.userEmail},
        ${userWallet.walletAddress}
    )`;

isolated function getUserWalletsQuery(string userEmail) returns sql:ParameterizedQuery =>
    `SELECT
        wallet_address
    FROM
        user_wallet
    WHERE
        user_email = ${userEmail}`;