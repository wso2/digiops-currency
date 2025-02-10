import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LayoutView from './LayoutView';
import { useAuthContext } from '@asgardeo/auth-react';
import { useEffect, useState } from 'react';
import "./App.css";

function App() {
  const { state, signIn } = useAuthContext();
  const [loading, setLoading] = useState(true); // State to manage loading state

  // --- Sign in only if the user is not authenticated ---
  useEffect(() => {
    const authenticateUser = async () => {
      if (!state.isAuthenticated) {
        await signIn();
      }
      setLoading(false); // Set loading to false after authentication check
    };

    authenticateUser();
  }, [state.isAuthenticated, signIn]);

  // Show loading state while authentication is being checked
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/*" element={state.isAuthenticated ? <LayoutView /> : <div>Unauthorized Access</div>} />
      </Routes>
    </Router>
  );
}

export default App;
