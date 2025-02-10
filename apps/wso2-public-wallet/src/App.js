import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LayoutView from './LayoutView';
import { useAuthContext } from '@asgardeo/auth-react';
import { useEffect } from 'react';

function App() {
    const { state, signIn } = useAuthContext();

    useEffect(() => {
        if (!state.isAuthenticated) {
            signIn();
        }
    }, [state.isAuthenticated, signIn]);

    return (
        <Router>
            <Routes>
                {state.isAuthenticated ? (
                    <Route path="/*" element={<LayoutView />} />
                ) : (
                    <Route path="/*" element={<div>Loading...</div>} />
                )}
            </Routes>
        </Router>
    );
}

export default App;
