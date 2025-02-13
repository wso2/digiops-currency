import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LayoutView from '../LayoutView';
import LoginPage from './login/login';
import HomePage from './home/home';
import HistoryPage from './history/history';
import CreateWallet from './create-wallet/create-wallet';
import ProfilePage from './profile/profile';
import RecoverWallet from './recover-wallet/recover-wallet';
import SendTokens from '../modals/send-tokens/send-tokens';
import ConfirmSendTokens from '../modals/confirm-token-send/confirm-token-send';

const Pages = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/create-wallet" element={<CreateWallet />} />
            <Route path= "/profile" element={<ProfilePage />} />
            <Route path="/recover-wallet" element={<RecoverWallet />} />
            <Route path="/send-tokens" element={<SendTokens />} />
            <Route path="/confirm-tokens-send" element={<ConfirmSendTokens />} />
        </Routes>
    );
}

export default Pages;