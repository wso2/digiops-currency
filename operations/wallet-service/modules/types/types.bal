// Copyright (c) 2024, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.
import ballerina/sql;

# User wallet information.
public type UserWallet record {|
    # User email
    @sql:Column {name: "user_email"}
    string userEmail;
    # Wallet address
    @sql:Column {name: "wallet_address"}
    string walletAddress;
    # Initial coins allocated amount
    @sql:Column {name: "initial_coins_allocated"}
    decimal initialCoinsAllocated?;
|};

# Wallet address information for user.
public type WalletAddressInfo record {| 
    # Wallet address
    @sql:Column {name: "wallet_address"}
    string walletAddress;
    # Default wallet flag
    @sql:Column {name: "default_wallet"}
    boolean defaultWallet;
|};
