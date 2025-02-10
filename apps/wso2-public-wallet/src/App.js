import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LayoutView from './LayoutView';
import { useAuthContext } from '@asgardeo/auth-react';
import { useEffect } from 'react';


function App() {

  // --- get the navigate function from useNavigate hook ---


  // --- get the sign in function from useAuthContext hook ---
  const { state, signIn } = useAuthContext();


  // --- check if the user is authenticated and wallet is already exist in wallet db ---
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
