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