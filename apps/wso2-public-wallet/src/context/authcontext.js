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

import React, { useContext, useEffect, useState, createContext } from "react";
import { Button, Modal, Spin } from "antd";
import { useAuthContext, SecureApp } from "@asgardeo/auth-react";

const AuthContext = createContext({});

const AppAuthProvider = (props) => {
  // --- Track the authentication state ---
  const [open, setOpen] = useState(false);
  const [appState, setAppState] = useState("loading");

  // --- Get the authentication context from asgardeo ---
  const {
    signIn,
    getIDToken,
    signOut,
    getDecodedIDToken,
    getBasicUserInfo,
    state,
  } = useAuthContext();

  // --- Track the authentication state ---
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userInfo: null,
    statusMessage: "",
  });

  // --- Initialize the authentication flow based on app state ---
  useEffect(() => {
    const appStatus = localStorage.getItem("app-state");

    if (!localStorage.getItem("app-redirect-url")) {
      localStorage.setItem(
        "app-redirect-url",
        window.location.href.replace(window.location.origin, "")
      );
    }

    if (appStatus && appStatus === "logout") {
      setAppState("logout");
    } else {
      setAppState("active");
    }
  }, []);

  // --- Handle sign-in and fetch user info ---
  useEffect(() => {
    const isSignInInitiated =
      localStorage.getItem("signInInitiated") === "true";

    if (state.isAuthenticated) {
      Promise.all([getBasicUserInfo(), getIDToken(), getDecodedIDToken()])
        .then(([userInfo, idToken, decodedIdToken]) => {
          if (!userInfo || !idToken || !decodedIdToken) {
            console.error("One or more of the required values are undefined:", {
              userInfo,
              idToken,
              decodedIdToken,
            });
            return;
          }
          console.log("Token: ", getDecodedIDToken());

          setAuthState({
            isAuthenticated: true,
            userInfo,
            statusMessage: "User authenticated",
          });
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else if (!isSignInInitiated) {
      localStorage.setItem("signInInitiated", "true");
      signIn();
    }
  }, [state.isAuthenticated]);

  // --- Handle the app state ---
  useEffect(() => {
    if (appState === "active") {
      if (!authState.isAuthenticated) {
        signIn();
      }
    } else if (appState === "loading") {
      // Show loading spinner while the app is loading
    }
  }, [authState.isAuthenticated, appState]);

  // --- Refresh the tokens ---
  const refreshTokens = async () => {
    const idToken = await getIDToken();
    return { idToken };
  };

  // --- Sign out the user ---
  const appSignOut = async () => {
    setAppState("loading");
    localStorage.setItem("app-state", "logout");
    await signOut();
    setAppState("logout");
    setAuthState({
      isAuthenticated: false,
      userInfo: null,
      statusMessage: "User signed out",
    });
  };

  // --- Sign in the user ---
  const appSignIn = async () => {
    setAppState("active");
    localStorage.setItem("app-state", "active");
  };

  // --- API Service ---
  const authContext = {
    appSignIn,
    appSignOut,
    authState,
  };

  return (
    <>
      {appState === "loading" ? (
        <Spin spinning={true} />
      ) : (
        <>
          <Modal
            title="Are you still there?"
            visible={open}
            onCancel={() => setOpen(false)}
            footer={[
              <Button key="continue" onClick={() => setOpen(false)}>
                Continue
              </Button>,
              <Button key="logout" onClick={() => appSignOut()} danger>
                Logout
              </Button>,
            ]}
          >
            <p>
              It looks like you've been inactive for a while. Would you like to
              continue?
            </p>
          </Modal>

          {appState === "active" ? (
            <AuthContext.Provider value={authContext}>
              <SecureApp>{props.children}</SecureApp>
            </AuthContext.Provider>
          ) : (
            <div>
              <Button type="primary" onClick={appSignIn}>
                Sign In
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

// --- Custom hook to use the authentication context ---
const useAppAuthContext = () => useContext(AuthContext);

export { useAppAuthContext };

export default AppAuthProvider;
