import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import GameCenter from './pages/GameCenter';
import GameDetails from './pages/GameDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
        <AuthProvider>
          <Router>
            <div className="app">
              <Header />
              <Routes>
                <Route path="/" element={<Navigate to="/game-center" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/game-center" element={<GameCenter />} />
                <Route path="/game/:seasonCode/:gameId" element={<GameDetails />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;
