// Copyright (c) 2024, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.
import ballerina/http;
import ballerina/log;

const X_JWT_ASSERTION = "x-jwt-assertion";
const EMAIL = "email";

# Request Interceptor used to decode the JWT.
service class JwtInterceptor {
    *http:RequestInterceptor;
    isolated resource function 'default [string... path](http:RequestContext ctx, http:Request req)
    returns http:NextService|http:NotFound|http:Forbidden|error? {

        if req.method == http:OPTIONS {
            return ctx.next();
        }
        string|error jwtAssertion = req.getHeader(X_JWT_ASSERTION);

        if jwtAssertion is error {
            log:printError("Error in jwt assertion", jwtAssertion);
            return http:FORBIDDEN;
        }

        JwtPayload|error jwtInfo = jwtDecoder(jwtAssertion);
        if jwtInfo is error {
            log:printError("Error while decoding JWT", jwtInfo);
            return http:FORBIDDEN;
        }
        JwtPayload {email, sub} = jwtInfo;
        if isEmptyVal(email) && isEmptyVal(sub) {
            log:printWarn("Email is empty in the JWT");
            return http:FORBIDDEN;
        }
        ctx.set(EMAIL, sub is string ? sub : email);
        return ctx.next();
    }
}
