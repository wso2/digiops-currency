import ballerina/sql;

# User wallet information.
public type UserWallet record {|
    # User email
    @sql:Column {name: "user_email"}
    string userEmail;
    # Wallet address
    @sql:Column {name: "wallet_address"}
    string walletAddress;
|};
