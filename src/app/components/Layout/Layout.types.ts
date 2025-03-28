import { BoxProps } from '@mui/material';
import { ReactNode } from 'react';
import { HeaderProps } from '../Header/Header.types';

// Create a placeholder for FooterProps since we haven't defined it yet
export interface FooterProps {
    [key: string]: any;
}

export interface LayoutProps extends Omit<BoxProps, 'children'> {
    children: ReactNode;
    headerProps?: Partial<HeaderProps>;
    footerProps?: Partial<FooterProps>;
    showHeader?: boolean;
    showFooter?: boolean;
}
