// src/theme/theme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';

// Define custom theme options with TypeScript
const themeOptions: ThemeOptions = {
    typography: {
        fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        body1: {
            fontSize: '1rem',
        },
    },
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
};

// Create and export the theme
export const theme = createTheme(themeOptions);

// Export the type of the theme for proper typing in components
export type Theme = typeof theme;