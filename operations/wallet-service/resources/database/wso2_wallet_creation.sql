-- Copyright (c) 2024, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
-- This software is the property of WSO2 LLC. and its suppliers, if any.
-- Dissemination of any information or reproduction of any material contained
-- herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
-- You may not alter or remove any copyright or other notice from copies of this content.
CREATE DATABASE wso2_wallet;

USE wso2_wallet;

DROP TABLE IF EXISTS user_wallet;

CREATE TABLE user_wallet (
    wallet_address VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    default_wallet BOOLEAN DEFAULT false,
    initial_coins_allocated DECIMAL(20,10) DEFAULT 0.0,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (wallet_address)
);

DELIMITER //
-- Trigger to set default_wallet as true for the first wallet inserted against a particular user
CREATE TRIGGER set_default_wallet_on_first_insert
BEFORE INSERT ON user_wallet
FOR EACH ROW
BEGIN
    DECLARE count_wallets INT;
    SELECT COUNT(*) INTO count_wallets
    FROM user_wallet
    WHERE user_email = NEW.user_email;

    IF count_wallets = 0 THEN
        SET NEW.default_wallet = true;
    ELSE
        SET NEW.default_wallet = false;
    END IF;
END;
//
DELIMITER ;
