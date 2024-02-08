// Copyright (c) 2024, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.
import ballerina/jwt;

# Decoding JSON Web Token
#
# + jwt - JSON Web Token
# + return - Return JWT info or error
public isolated function jwtDecoder(string jwt) returns JwtPayload|error {
    [jwt:Header, jwt:Payload] [_, payload] = check jwt:decode(jwt);
    return payload.cloneWithType();
}

# Check if string is empty or not.
#
# + val - String parameter
# + return - If empty return TRUE, else return FALSE
public isolated function isEmptyVal(string? val) returns boolean =>
    val is () || val.trim().length() == 0;
