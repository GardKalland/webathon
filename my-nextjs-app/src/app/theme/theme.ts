// src/theme/f1-theme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        f1Red: Palette['primary'];
        asphalt: Palette['primary'];
        speed: Palette['primary'];
    }
    interface PaletteOptions {
        f1Red?: PaletteOptions['primary'];
        asphalt?: PaletteOptions['primary'];
        speed?: PaletteOptions['primary'];
    }
}

// A theme inspired by Formula 1 racing
export const f1ThemeOptions: ThemeOptions = {
    palette: {
        primary: {
            main: '#E10600', // F1 red
            light: '#FF3B33',
            dark: '#B30500',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#15151E', // F1 dark blue/black
            light: '#2E2E3A',
            dark: '#0A0A0F',
            contrastText: '#FFFFFF',
        },
        f1Red: {
            main: '#E10600',
            light: '#FF3B33',
            dark: '#B30500',
            contrastText: '#FFFFFF',
        },
        asphalt: {
            main: '#1E1E1E',
            light: '#2E2E2E',
            dark: '#0A0A0A',
            contrastText: '#FFFFFF',
        },
        speed: {
            main: '#0090D0', // Accent blue similar to F1 teams
            light: '#33B1E6',
            dark: '#00689A',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#15151E',
            paper: '#1E1E26',
        },
        text: {
            primary: '#FFFFFF',
            secondary: '#CCCCCC',
        },
    },
    typography: {
        fontFamily: '"Titillium Web", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '3.5rem',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2.5rem',
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
        },
        h3: {
            fontWeight: 600,
            fontSize: '2rem',
            letterSpacing: 0,
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
        },
        h6: {
            fontWeight: 600,
            fontSize: '1rem',
        },
        button: {
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
        },
    },
    shape: {
        borderRadius: 4,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    padding: '12px 24px',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, #E10600, transparent)',
                        transition: 'transform 0.3s ease',
                        transform: 'scaleX(0)',
                        transformOrigin: 'center',
                    },
                    '&:hover::after': {
                        transform: 'scaleX(1)',
                    },
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 8px rgba(225, 6, 0, 0.3)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage: 'linear-gradient(90deg, #15151E, #15151E)',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'linear-gradient(145deg, #1E1E26, #15151E)',
                    borderLeft: '3px solid #E10600',
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
                    },
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: '#E10600',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    color: '#FFFFFF',
                    fontWeight: 600,
                },
            },
        },
    },
};

export const theme = createTheme(f1ThemeOptions);