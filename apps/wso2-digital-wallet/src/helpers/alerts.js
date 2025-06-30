// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import { showAlert } from "../microapp-bridge";
import { message } from "antd";

export function showAlertBox(title, message, buttonText) {
  showAlert(title, message, buttonText, () => {}, () => {});
}

export function showToast(type, content, duration = 5) {
  if (type.toLowerCase() === "success") {
    message.success(content, duration);
  } else if (type === "error") {
    message.error(content, duration);
  } else if (type === "info") {
    message.info(content, duration);
  } else if (type === "warning") {
    message.warning(content, duration);
  }
}
