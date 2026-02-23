import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#ff6c0e', // Euroleague Orange
        },
        secondary: {
            main: '#00ffb5', // Euroleague Teal
        },
        background: {
            default: '#f4f7f6',
            paper: '#ffffff',
        },
        text: {
            primary: '#1d1d1b',
            secondary: '#666666',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 800,
            fontSize: '2.5rem',
        },
        h2: {
            fontWeight: 700,
            fontSize: '1.25rem',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    padding: '8px 24px',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    border: '1px solid #e0e0e0',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                },
            },
        },
    },
});
