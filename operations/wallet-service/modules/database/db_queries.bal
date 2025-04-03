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
        wallet_address,
        default_wallet
    ) VALUES (
        ${userWallet.userEmail},
        ${userWallet.walletAddress},
        ${userWallet.defaultWallet}
    )`;

isolated function getUserWalletsQuery(string userEmail) returns sql:ParameterizedQuery =>
    `SELECT
        wallet_address,
        user_email,
        default_wallet
    FROM
        user_wallet
    WHERE
        user_email = ${userEmail}`;

isolated function getUserWalletsByDefaultWalletQuery(string userEmail, int defaultWallet) returns sql:ParameterizedQuery =>
    `SELECT
        wallet_address,
        user_email,
        default_wallet
    FROM
        user_wallet
    WHERE
        user_email = ${userEmail} AND default_wallet = ${defaultWallet}`;

isolated function updateUserWalletQuery(types:UserWallet userWallet) returns sql:ParameterizedQuery =>
    `UPDATE user_wallet
    SET default_wallet = ${userWallet.defaultWallet}
    WHERE user_email = ${userWallet.userEmail} AND wallet_address = ${userWallet.walletAddress}`;