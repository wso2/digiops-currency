import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LayoutView from './LayoutView';
import { useAuthContext } from '@asgardeo/auth-react';
import { useEffect } from 'react';
import "./App.css";

function App() {
  const { state, signIn } = useAuthContext();

  // --- Sign in only if the user is not authenticated ---
  useEffect(() => {
    const authenticateUser = async () => {
      if (!state.isAuthenticated) {
        await signIn();
      }
    };

    authenticateUser();
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
