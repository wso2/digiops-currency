// Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
//
// This software is the property of WSO2 LLC. and its suppliers, if any.
// Dissemination of any information or reproduction of any material contained
// herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
// You may not alter or remove any copyright or other notice from copies of this content.

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { getLocalDataAsync } from "./helpers/storage";
import { STORAGE_KEYS } from "./constants/configs";

let themeState = "dark";

const fetchThemeStatus = async () => {
  const theme = await getLocalDataAsync(STORAGE_KEYS.THEME_MODE);
  themeState = theme || "dark";
};

fetchThemeStatus();

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`
};

ReactDOM.render(
  <React.StrictMode>
    <ThemeSwitcherProvider themeMap={themes} defaultTheme={themeState}>
      <App />
    </ThemeSwitcherProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
