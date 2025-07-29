// Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.
import ballerina/http;

configurable string baseUrl = ?;
configurable Oauth2Config authConfig = ?;

@display {
    label: "Transaction Service",
    id: "currency/transaction-service"
}
final http:Client transactionServiceClient = check new (baseUrl, {
    auth: {
        ...authConfig
    },
    httpVersion: http:HTTP_1_1,
    http1Settings: {
        keepAlive: http:KEEPALIVE_NEVER
    }
});
