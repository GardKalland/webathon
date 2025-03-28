// src/components/layout/Header/F1Header.tsx
'use client';

import { FC, useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Container,
    Box,
    useScrollTrigger,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    useTheme,
    useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SpeedIcon from '@mui/icons-material/Speed';
import { Typography } from '@/app/ui/Typography';
import { Logo } from '@/app/ui/Logo';
import { Navigation } from '@/app/ui/Navigation';
import { HeaderProps } from './Header.types';
import Image from 'next/image';
import Link from 'next/link';

interface F1HeaderProps extends HeaderProps {
    showSpeedometer?: boolean;
}

export const F1Header: FC<F1HeaderProps> = ({
                                                navItems = [
                                                    { label: 'Home', href: '/', isActive: true },
                                                    { label: 'Teams', href: '/teams' },
                                                    { label: 'Drivers', href: '/drivers' },
                                                    { label: 'Calendar', href: '/calendar' },
                                                    { label: 'Results', href: '/results' },
                                                ],
                                                logoHeight = '40px',
                                                logoWidth = 'auto',
                                                logoAlt = 'F1 Racing',
                                                showAuthButtons = true,
                                                showSpeedometer = true,
                                                onLogin = () => console.log('Login clicked'),
                                                onSignup = () => console.log('Signup clicked'),
                                                ...props
                                            }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Animation effect for header on scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setDrawerOpen(open);
    };

    return (
        <AppBar
            position="fixed"
            elevation={trigger ? 4 : 0}
            sx={{
                backgroundColor: trigger ? theme.palette.secondary.main : 'transparent',
                transition: 'all 0.3s ease',
                borderBottom: trigger ? `1px solid ${theme.palette.primary.main}` : 'none',
                transform: isScrolled ? 'none' : 'translateY(10px)',
                padding: isScrolled ? '0' : '10px 0',
            }}
            {...props}
        >
            <Container>
                <Toolbar
                    disableGutters
                    sx={{
                        height: isScrolled ? '70px' : '80px',
                        transition: 'height 0.3s ease'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Replace with actual F1-style logo */}
                        <Link href="/" passHref>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        letterSpacing: '-0.05em',
                                        color: theme.palette.primary.main,
                                        display: 'flex',
                                        alignItems: 'center',
                                        mr: 1
                                    }}
                                >
                                    F1<span style={{ color: theme.palette.common.white }}>RACING</span>
                                </Typography>
                            </Box>
                        </Link>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    {!isMobile && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {navItems.map((item) => (
                                <Link href={item.href} key={item.label} passHref style={{ textDecoration: 'none' }}>
                                    <Button
                                        sx={{
                                            mx: 1,
                                            color: 'white',
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            opacity: item.isActive ? 1 : 0.7,
                                            '&:hover': {
                                                opacity: 1,
                                                backgroundColor: 'rgba(225, 6, 0, 0.1)'
                                            },
                                            borderBottom: item.isActive ? `2px solid ${theme.palette.primary.main}` : 'none',
                                            borderRadius: 0,
                                            padding: '6px 12px',
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                </Link>
                            ))}
                        </Box>
                    )}

                    {showSpeedometer && !isMobile && (
                        <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                            <IconButton
                                sx={{
                                    backgroundColor: theme.palette.primary.main,
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.dark,
                                    },
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <SpeedIcon sx={{ color: 'white' }} />
                            </IconButton>
                        </Box>
                    )}

                    {showAuthButtons && !isMobile && (
                        <Box sx={{ ml: 2 }}>
                            <Button
                                variant="outlined"
                                sx={{
                                    borderColor: theme.palette.primary.main,
                                    color: 'white',
                                    mr: 1,
                                    '&:hover': {
                                        borderColor: theme.palette.primary.light,
                                        backgroundColor: 'rgba(225, 6, 0, 0.05)',
                                    },
                                }}
                                onClick={onLogin}
                            >
                                Login
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                    '&:hover': {
                                        background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
                                    },
                                }}
                                onClick={onSignup}
                            >
                                Sign Up
                            </Button>
                        </Box>
                    )}

                    {/* Mobile menu */}
                    {isMobile && (
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer(true)}
                            sx={{ color: 'white' }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                </Toolbar>
            </Container>

            {/* Mobile drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 280,
                        backgroundColor: theme.palette.secondary.main,
                        color: 'white',
                    },
                }}
            >
                <Box
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                    sx={{ p: 3 }}
                >
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
                        F1<span style={{ color: 'white' }}>RACING</span>
                    </Typography>
                    <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)', mb: 2 }} />
                    <List>
                        {navItems.map((item) => (
                            <Link href={item.href} key={item.label} passHref style={{ textDecoration: 'none', color: 'white' }}>
                                <ListItem
                                          sx={{
                                              borderLeft: item.isActive ? `2px solid ${theme.palette.primary.main}` : 'none',
                                              pl: item.isActive ? 2 : 3,
                                              backgroundColor: item.isActive ? 'rgba(225, 6, 0, 0.1)' : 'transparent',
                                          }}
                                >
                                    <ListItemText primary={item.label} />
                                </ListItem>
                            </Link>
                        ))}
                    </List>

                    {showAuthButtons && (
                        <Box sx={{ mt: 4, px: 2 }}>
                            <Button
                                variant="outlined"
                                fullWidth
                                sx={{
                                    borderColor: theme.palette.primary.main,
                                    color: 'white',
                                    mb: 2,
                                }}
                                onClick={onLogin}
                            >
                                Login
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={onSignup}
                            >
                                Sign Up
                            </Button>
                        </Box>
                    )}
                </Box>
            </Drawer>
        </AppBar>
    );
};