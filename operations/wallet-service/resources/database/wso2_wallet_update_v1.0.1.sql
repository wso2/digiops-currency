-- Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
-- This software is the property of WSO2 LLC. and its suppliers, if any.
-- Dissemination of any information or reproduction of any material contained
-- herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
-- You may not alter or remove any copyright or other notice from copies of this content.
USE wso2_wallet;

ALTER TABLE user_wallet 
ADD COLUMN initial_coins_allocated DECIMAL(20,10) DEFAULT 0.0;
