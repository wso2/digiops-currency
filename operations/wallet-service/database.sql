-- Copyright (c) 2024, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
-- This software is the property of WSO2 LLC. and its suppliers, if any.
-- Dissemination of any information or reproduction of any material contained
-- herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
-- You may not alter or remove any copyright or other notice from copies of this content.
CREATE DATABASE wso2_wallet;

DROP TABLE IF EXISTS user_wallet;

CREATE TABLE user_wallet (
    wallet_address VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    default_wallet BOOLEAN DEFAULT false,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (wallet_address)
);
