import { AppBarProps } from '@mui/material';
import { NavItem } from '@/app/components/Naviagation';

export interface HeaderProps extends AppBarProps {
    navItems?: NavItem[];
    logoHeight?: string | number;
    logoWidth?: string | number;
    logoAlt?: string;
    showAuthButtons?: boolean;
    onLogin?: () => void;
    onSignup?: () => void;
}
