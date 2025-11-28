import { defaultTheme } from 'react-admin';
import { createTheme } from '@mui/material/styles';

/**
 * Custom theme for the Admin interface
 * Aligned with the project's "Natural agricultural palette" defined in index.css
 */
export const adminTheme = createTheme({
    ...defaultTheme,
    palette: {
        mode: 'light',
        primary: {
            main: 'hsl(140, 40%, 25%)', // --primary
            light: 'hsl(140, 35%, 35%)', // --primary-glow
            contrastText: 'hsl(0, 0%, 98%)', // --primary-foreground
        },
        secondary: {
            main: 'hsl(25, 20%, 88%)', // --secondary
            contrastText: 'hsl(25, 15%, 25%)', // --secondary-foreground
        },
        background: {
            default: 'hsl(45, 20%, 97%)', // --background
            paper: 'hsl(0, 0%, 100%)', // --card
        },
        error: {
            main: 'hsl(0, 75%, 55%)', // --destructive
            contrastText: 'hsl(0, 0%, 98%)', // --destructive-foreground
        },
        text: {
            primary: 'hsl(20, 15%, 15%)', // --foreground
            secondary: 'hsl(40, 8%, 45%)', // --muted-foreground
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        h6: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 8, // --radius (0.5rem = 8px)
    },
    components: {
        ...defaultTheme.components,
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'hsl(140, 40%, 25%)', // --primary
                    color: 'hsl(0, 0%, 98%)', // --primary-foreground
                    boxShadow: '0 4px 20px -2px hsl(140 40% 25% / 0.15)', // --shadow-farm
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // More modern look
                    fontWeight: 500,
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 2px 10px -1px hsl(20 15% 15% / 0.1)', // --shadow-card
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                elevation1: {
                    boxShadow: '0 2px 10px -1px hsl(20 15% 15% / 0.1)', // --shadow-card
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    backgroundColor: 'hsl(45, 20%, 97%)', // --background (subtle header bg)
                },
            },
        },
    },
});
