// src/components/layout/Footer/F1Footer.tsx
'use client';

import { FC } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    IconButton,
    Divider,
    List,
    ListItem,
    Link as MuiLink,
    useTheme
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Link from 'next/link';

export interface FooterProps {
    showSocialLinks?: boolean;
}

export const Footer: FC<FooterProps> = ({
                                                showSocialLinks = true
                                            }) => {
    const theme = useTheme();

    const footerLinks = [
        {
            title: 'About',
            links: [
                { label: 'About F1', href: '/about' },
                { label: 'Our History', href: '/history' },
                { label: 'Sustainability', href: '/sustainability' },
                { label: 'Corporate Info', href: '/corporate' }
            ]
        },
        {
            title: 'Racing',
            links: [
                { label: 'Drivers', href: '/drivers' },
                { label: 'Teams', href: '/teams' },
                { label: 'Calendar', href: '/calendar' },
                { label: 'Standings', href: '/standings' }
            ]
        },
        {
            title: 'Media',
            links: [
                { label: 'News', href: '/news' },
                { label: 'Video', href: '/video' },
                { label: 'Photos', href: '/photos' },
                { label: 'Live Timing', href: '/live-timing' }
            ]
        }
    ];

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: theme.palette.secondary.dark,
                color: theme.palette.text.primary,
                pt: 8,
                pb: 4,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                }
            }}
        >
            {/* Subtle racing line graphic */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '-10%',
                    width: '120%',
                    height: '1px',
                    background: 'rgba(255,255,255,0.05)',
                    transform: 'rotate(-5deg)',
                }}
            />

            <Container>
                <Grid container spacing={6}>
                    {/* Logo and social section */}
                    <Grid>
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    letterSpacing: '-0.05em',
                                    color: theme.palette.primary.main,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                F1<span style={{ color: theme.palette.common.white }}>RACING</span>
                            </Typography>
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{
                                color: 'rgba(255,255,255,0.7)',
                                mb: 4,
                                maxWidth: '300px'
                            }}
                        >
                            The ultimate destination for Formula 1 fans. Get the latest news, race results, and exclusive content.
                        </Typography>

                        {showSocialLinks && (
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="subtitle2" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)' }}>
                                    FOLLOW US
                                </Typography>
                                <Box sx={{ display: 'flex' }}>
                                    {[
                                        { icon: <FacebookIcon />, href: 'https://facebook.com' },
                                        { icon: <TwitterIcon />, href: 'https://twitter.com' },
                                        { icon: <InstagramIcon />, href: 'https://instagram.com' },
                                        { icon: <YouTubeIcon />, href: 'https://youtube.com' },
                                    ].map((social, index) => (
                                        <IconButton
                                            key={index}
                                            component="a"
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{
                                                color: 'rgba(255,255,255,0.7)',
                                                mr: 1,
                                                '&:hover': {
                                                    color: theme.palette.primary.main,
                                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                                }
                                            }}
                                        >
                                            {social.icon}
                                        </IconButton>
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Grid>

                    {/* Footer links */}
                    {footerLinks.map((section, index) => (
                        <Grid key={index}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    mb: 3,
                                    fontWeight: 600,
                                    color: theme.palette.primary.main
                                }}
                            >
                                {section.title}
                            </Typography>

                            <List disablePadding>
                                {section.links.map((link, linkIndex) => (
                                    <ListItem
                                        key={linkIndex}
                                        disablePadding
                                        sx={{ mb: 1 }}
                                    >
                                        <Link href={link.href} passHref>
                                            <MuiLink
                                                sx={{
                                                    color: 'rgba(255,255,255,0.7)',
                                                    textDecoration: 'none',
                                                    fontSize: '0.9rem',
                                                    transition: 'color 0.2s ease',
                                                    '&:hover': {
                                                        color: 'white',
                                                        textDecoration: 'none',
                                                    }
                                                }}
                                            >
                                                {link.label}
                                            </MuiLink>
                                        </Link>
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                    ))}

                    {/* Partners section */}
                    <Grid>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                mb: 3,
                                fontWeight: 600,
                                color: theme.palette.primary.main
                            }}
                        >
                            OFFICIAL PARTNERS
                        </Typography>

                        <Grid container spacing={2}>
                            {[1, 2, 3, 4, 5, 6].map((partner) => (
                                <Grid>
                                    <Box
                                        sx={{
                                            height: '40px',
                                            width: '100%',
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                            }
                                        }}
                                    >
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                            Partner {partner}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

                {/* Bottom footer */}
                <Grid container spacing={2} alignItems="center">
                    <Grid>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            © {new Date().getFullYear()} F1 Racing. All rights reserved.
                        </Typography>
                    </Grid>
                    <Grid>
                        <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                            {['Privacy Policy', 'Terms of Use', 'Cookie Policy', 'Contact Us'].map((item, index) => (
                                <Typography
                                    key={index}
                                    variant="caption"
                                    component="a"
                                    href="#"
                                    sx={{
                                        color: 'rgba(255,255,255,0.5)',
                                        ml: index > 0 ? 3 : 0,
                                        textDecoration: 'none',
                                        '&:hover': {
                                            color: theme.palette.primary.main,
                                            textDecoration: 'underline',
                                        }
                                    }}
                                >
                                    {item}
                                </Typography>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};
