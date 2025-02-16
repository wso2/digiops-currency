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

import { useAuthContext } from '@asgardeo/auth-react';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import "./App.css";
import AppAuthProvider from './context/authcontext';
import AppHandler from './AppHandler';

// other imports
function App() {

  // --- set the document title ---
  document.title = "Public Wallet App";

  // ---  states to handle the loading state ---
  const { state, signIn } = useAuthContext();
  const [loading, setLoading] = useState(true);

  // --- authenticate the user ---
  useEffect(() => {
    const authenticateUser = async () => {
      if (!state?.isAuthenticated) {
        try {
          await new Promise(resolve => setTimeout(resolve, 3000)); // Add delay
          await signIn();
        } catch (error) {
          console.error("Authentication failed:", error);
        }
      }
      setLoading(false);
    };

    authenticateUser();
  }, [state?.isAuthenticated, signIn]);

  // --- show loading screen --- need to change this after testing ------------>>>>>>
  if (loading) {
    return < div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }} ><Spin size="large" />
    </  div>;
  }

  return (
    <div className="App">
    <AppAuthProvider>
        <AppHandler />
    </AppAuthProvider>
    </div>
  );
}

export default App;
