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
        wallet_address,
        initial_coins_allocated
    FROM
        user_wallet
    WHERE
        wallet_address = ${walletAddress}`;

isolated function getWalletAddressesByEmailQuery(string userEmail) returns sql:ParameterizedQuery =>
    `SELECT
        wallet_address,
        default_wallet,
        created_on
    FROM
        user_wallet
    WHERE
        user_email = ${userEmail}
    ORDER by
        default_wallet DESC,
        created_on DESC`;

isolated function getDefaultWalletByEmailQuery(string userEmail) returns sql:ParameterizedQuery =>
    `SELECT
        wallet_address
    FROM
        user_wallet
    WHERE
        user_email = ${userEmail}
        AND default_wallet = 1`;

isolated function insertUserWalletQuery(types:UserWallet userWallet) returns sql:ParameterizedQuery =>
    `INSERT INTO user_wallet (
        user_email,
        wallet_address,
        initial_coins_allocated
    ) VALUES (
        ${userWallet.userEmail},
        ${userWallet.walletAddress},
        ${userWallet.initialCoinsAllocated ?: 0.0}
    )`;

isolated function getUserWalletCountQuery(string userEmail) returns sql:ParameterizedQuery =>
    `SELECT
        COUNT(*) as wallet_count
    FROM
        user_wallet
    WHERE
        user_email = ${userEmail}`;

isolated function setWalletAsPrimaryQuery(string userEmail, string walletAddress) returns sql:ParameterizedQuery =>
    `UPDATE
        user_wallet
    SET
        default_wallet = CASE 
            WHEN wallet_address = ${walletAddress} THEN true 
            ELSE false 
        END
    WHERE
        user_email = ${userEmail}`;
