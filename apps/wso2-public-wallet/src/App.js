import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LayoutView from './LayoutView';
import LoginPage from './pages/login/login';
import { useAuthContext } from '@asgardeo/auth-react';



function App() {

  const { state } = useAuthContext();


  return (
    <Router>
      <Routes>
        {state.isAuthenticated ? <Route path="/*" element={<LayoutView />} /> : <Route path="/" element={<LoginPage />} />}
      </Routes>
    </Router>
  );
}
export default App;
