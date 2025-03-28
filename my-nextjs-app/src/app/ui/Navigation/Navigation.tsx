'use client';

import { FC, useState } from 'react';
import { Stack, useMediaQuery, IconButton, Drawer, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { NavigationProps } from './Navigation.types';
import { Typography } from '../Typography';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';

export const Navigation: FC<NavigationProps> = ({
                                                    items,
                                                    direction = 'row',
                                                    spacing = 4,
                                                    mobileBreakpoint = 'md',
                                                    ...props
                                                }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down(mobileBreakpoint));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const navItems = (
        <>
            {items.map((item) => (
                <Link
                    key={item.label}
                    href={item.href}
                    passHref
                    style={{ textDecoration: 'none' }}
                >
                    <Typography
                        variant="body1"
                        color={item.isActive ? 'primary' : 'inherit'}
                        sx={{
                            fontWeight: item.isActive ? 'medium' : 'regular',
                            '&:hover': {
                                color: theme.palette.primary.main,
                            },
                        }}
                    >
                        {item.label}
                    </Typography>
                </Link>
            ))}
        </>
    );

    if (isMobile) {
        return (
            <>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="end"
                    onClick={handleDrawerToggle}
                >
                    <MenuIcon />
                </IconButton>
                <Drawer
                    anchor="right"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                >
                    <Box sx={{ p: 2, width: 250 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                            <IconButton onClick={handleDrawerToggle}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Stack direction="column" spacing={2}>
                            {navItems}
                        </Stack>
                    </Box>
                </Drawer>
            </>
        );
    }

    return (
        <Stack
            direction={direction}
            spacing={spacing}
            {...props}
        >
            {navItems}
        </Stack>
    );
};
