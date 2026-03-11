// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { Injectable } from '@nestjs/common';

const normalizeBigInt = (value: any): any => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeBigInt(item));
  }
  if (value && typeof value === 'object') {
    const normalized: any = {};
    for (const [key, val] of Object.entries(value)) {
      normalized[key] = normalizeBigInt(val);
    }
    return normalized;
  }
  return value;
};

@Injectable()
export class HttpResponseService {
  SUCCESS = 'success';
  ERROR = 'error';
  send(message: string, httpCode: number, payload: any) {
    const safePayload = payload ? normalizeBigInt(payload) : null;
    return { message: message, httpCode: httpCode, payload: safePayload };
  }
}
