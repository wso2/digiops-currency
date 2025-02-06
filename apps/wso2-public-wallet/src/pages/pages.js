import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LayoutView from '../LayoutView';
import LoginPage from './login/login';
import HomePage from './home/home';
import HistoryPage from './history/history';
import CreateWallet from './create-wallet/create-wallet';
import ProfilePage from './profile/profile';

function Pages() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/create-wallet" element={<CreateWallet />} />
            <Route path= "/profile" element={<ProfilePage />} />
        </Routes>
    );
}

export default Pages;