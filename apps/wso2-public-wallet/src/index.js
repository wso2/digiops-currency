// Copyright (c) 2025 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import { AuthProvider } from "@asgardeo/auth-react";
import { ASGARDEO_CONFIG } from './constants/configs';

const config = {
  signInRedirectURL: ASGARDEO_CONFIG.SIGN_IN_URL,
  signOutRedirectURL: ASGARDEO_CONFIG.SIGN_OUT_URL,
  clientID: ASGARDEO_CONFIG.CLIENT_ID,
  baseUrl: ASGARDEO_CONFIG.BASE_URL,
  scope: ASGARDEO_CONFIG.SCOPES,
};


let themeSatate  = "dark";

// need to mention theme details here 
const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider config={config}>
    <ThemeSwitcherProvider   themeMap={themes} defaultTheme={themeSatate}>
    <App />
    </ThemeSwitcherProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
