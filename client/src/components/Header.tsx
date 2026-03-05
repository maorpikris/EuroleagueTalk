import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logout as logoutApi } from '../services/api';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try {
                await logoutApi(refreshToken);
            } catch (error) {
                console.error('Logout failed:', error);
            }
        }
        logout();
        handleMenuClose();
        navigate('/login');
    };

    const handleProfile = () => {
        handleMenuClose();
        navigate('/profile');
    };

    return (
        <AppBar position="static" color="inherit" elevation={1} sx={{ bgcolor: 'white' }}>
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            flexGrow: 1,
                            textDecoration: 'none',
                            color: 'primary.main',
                            fontWeight: 900,
                            letterSpacing: '-1px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <Box component="span" sx={{ bgcolor: 'primary.main', color: 'white', px: 1, borderRadius: 1 }}>E</Box>
                        EuroleagueTalk
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {user ? (
                            <>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2" fontWeight={600} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                        {user.username}
                                    </Typography>
                                    <IconButton onClick={handleMenuOpen} size="small">
                                        <Avatar
                                            src={user.avatarUrl?.startsWith('/') ? `${serverUrl}${user.avatarUrl}` : user.avatarUrl}
                                            alt={user.username}
                                            sx={{ width: 35, height: 35, border: '2px solid', borderColor: 'primary.main' }}
                                        >
                                            {user.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </IconButton>
                                </Box>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem onClick={handleProfile}>Profile</MenuItem>
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <Button component={RouterLink} to="/login" color="inherit">Login</Button>
                                <Button component={RouterLink} to="/register" variant="contained">Register</Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

import { Container } from '@mui/material';
export default Header;
