CREATE DATABASE wso2_wallet;

DROP TABLE IF EXISTS user_wallet;

CREATE TABLE user_wallet (
    wallet_address VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    default_wallet BOOLEAN DEFAULT false,
    PRIMARY KEY (wallet_address)
);