import { AppBarProps } from '@mui/material';
import { NavItem } from '../../ui/Navigation/Navigation.types';

export interface HeaderProps extends AppBarProps {
    navItems?: NavItem[];
    logoHeight?: string | number;
    logoWidth?: string | number;
    logoAlt?: string;
    showAuthButtons?: boolean;
    onLogin?: () => void;
    onSignup?: () => void;
}
