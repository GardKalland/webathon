'use client';

import React, { FC } from 'react';
import {
    AppBar,
    Toolbar,
    Container,
    Box,
    useScrollTrigger,
    Slide
} from '@mui/material';
import { HeaderProps } from './Header.types';
import { Logo } from '../Logo';
import { Navigation } from '../Naviagation';
import { Button } from '@/app/components/Button';

interface ElevationScrollProps {
    window?: () => Window;
    children: React.ReactElement;
}

function ElevationScroll(props: ElevationScrollProps) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
        sx: {
            backgroundColor: trigger ? 'background.paper' : 'transparent',
            transition: '0.3s',
        },
    });
}

export const Header: FC<HeaderProps> = ({
                                            navItems = [
                                                { label: 'Home', href: '/', isActive: true },
                                                { label: 'About', href: '/about' },
                                                { label: 'Services', href: '/services' },
                                                { label: 'Contact', href: '/contact' },
                                            ],
                                            logoHeight = '40px',
                                            logoWidth = 'auto',
                                            logoAlt = 'Company Logo',
                                            showAuthButtons = true,
                                            onLogin = () => console.log('Login clicked'),
                                            onSignup = () => console.log('Signup clicked'),
                                            ...props
                                        }) => {
    return (
        <ElevationScroll>
            <AppBar
                position="sticky"
                color="transparent"
                {...props}
            >
                <Container>
                    <Toolbar disableGutters sx={{ py: 1 }}>
                        <Logo
                            height={logoHeight}
                            width={logoWidth}
                            alt={logoAlt}
                        />

                        <Box sx={{ flexGrow: 1 }} />

                        <Navigation
                            items={navItems}
                            sx={{ mr: showAuthButtons ? 4 : 0 }}
                        />

                        {showAuthButtons && (
                            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={onLogin}
                                    sx={{ mr: 2 }}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={onSignup}
                                >
                                    Sign Up
                                </Button>
                            </Box>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
        </ElevationScroll>
    );
};