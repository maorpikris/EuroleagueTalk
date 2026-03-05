import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Stack, Link, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { login as loginApi, googleAuth as googleAuthApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await loginApi({ username, password });
            login(data.user, data.accessToken, data.refreshToken);
            navigate('/game-center');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            const decoded: any = jwtDecode(credentialResponse.credential);
            const data = await googleAuthApi({
                googleId: decoded.sub,
                username: decoded.name,
                email: decoded.email,
                avatarUrl: decoded.picture
            });
            login(data.user, data.tokens.accessToken, data.tokens.refreshToken);
            navigate('/game-center');
        } catch (err) {
            setError('Google login failed');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight={800}>
                    Login
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Welcome back to EuroleagueTalk
                </Typography>

                {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1rem' }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>

                    <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
                        <Typography variant="body2" color="text.secondary">OR</Typography>
                        <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Login Failed')}
                        />
                    </Box>

                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 3 }}>
                        <Typography variant="body2">Don't have an account?</Typography>
                        <Link component={RouterLink} to="/register" variant="body2" fontWeight={600}>
                            Register
                        </Link>
                    </Stack>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
