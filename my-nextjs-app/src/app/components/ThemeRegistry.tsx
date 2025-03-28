// src/components/ThemeRegistry.tsx
'use client';

import { FC, ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/app/theme/theme';

interface ThemeRegistryProps {
    children: ReactNode;
}

export const ThemeRegistry: FC<ThemeRegistryProps> = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};