import { StackProps } from '@mui/material';

export interface NavItem {
    label: string;
    href: string;
    isActive?: boolean;
}

export interface NavigationProps extends StackProps {
    items: NavItem[];
    direction?: 'row' | 'column';
    spacing?: number;
    mobileBreakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}