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
import { Form, Input, Button, Card } from 'antd';
import { useAuthContext } from '@asgardeo/auth-react';

const LoginPage = () => {

    const { signIn, state, getAccessToken , getBasicUserInfo} = useAuthContext();
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // need to remove this after testing ------------>>>>>>
    const authenticatieNow = async () => {
        console.log("check");
        await signIn();
        console.log({ Authenicated: state.isAuthenticated });
        console.log({ AccessToken: getAccessToken().then((res) => console.log("Access Token: ", res)) });
        console.log({ BasicUserInfo: getBasicUserInfo().then((res) => console.log("Basic User Info: ", res)) });
    }


    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>

            <Button type="primary" onClick={authenticatieNow}>Sign In</Button>
        </div>
    );
};

export default LoginPage;