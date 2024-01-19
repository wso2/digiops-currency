// Copyright (c) 2024, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

# MySQL database configurations.
type Database record {|
    # Database host
    string host;
    # Database user
    string user;
    # Database password
    string password;
    # Database name
    string database;
    # Database port
    int port = 3306;
|};
