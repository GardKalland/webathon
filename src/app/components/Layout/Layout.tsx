'use client';

import { FC } from 'react';
import { Box } from '@mui/material';
import { LayoutProps } from './Layout.types';
import { Header } from '../Header';
import {Footer} from "@/app/components/Footer";


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
