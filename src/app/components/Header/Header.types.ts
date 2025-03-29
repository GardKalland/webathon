import { AppBarProps } from '@mui/material';
import { NavItem } from '@/app/ui/Navigation';

export interface HeaderProps extends AppBarProps {
    navItems?: NavItem[];
    logoHeight?: string | number;
    logoWidth?: string | number;
    logoAlt?: string;
    showAuthButtons?: boolean;
    onLogin?: () => void;
    onSignup?: () => void;
}
