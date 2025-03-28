'use client';

import { FC } from 'react';
import { Box } from '@mui/material';
import { LayoutProps } from './Layout.types';
import { Header } from '../Header';

// Note: We'll create a simple Footer placeholder since we haven't defined it yet
const Footer = () => (
    <Box component="footer" sx={{ py: 4, textAlign: 'center' }}>
        © {new Date().getFullYear()} Your Company Name
    </Box>
);

export const Layout: FC<LayoutProps> = ({
                                            children,
                                            headerProps = {},
                                            footerProps = {},
                                            showHeader = true,
                                            showFooter = true,
                                            ...props
                                        }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            minHeight="100vh"
            {...props}
        >
            {showHeader && <Header {...headerProps} />}

            <Box component="main" flexGrow={1}>
                {children}
            </Box>

            {showFooter && <Footer {...footerProps} />}
        </Box>
    );
};
