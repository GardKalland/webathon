'use client';

import React from 'react';
import {
    Box,
    Container,
    Typography,
    useTheme,
    alpha,
    Grid,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Link as MUILink,
} from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import GroupsIcon from '@mui/icons-material/Groups';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AlarmIcon from '@mui/icons-material/Alarm';
import Link from 'next/link'


const AboutUsContent = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                minHeight: '100vh',
                pt: { xs: 6, md: 8 },
                pb: 10,
                position: 'relative',
            }}
        >
            <Container maxWidth="xl">
                {/* Section Header */}
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography
                        variant="h2"
                        sx={{
                            mb: 2,
                            fontWeight: 700,
                            '& span': {
                                color: theme.palette.primary.main,
                            }
                        }}
                    >
                        ABOUT <span>US</span>
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            maxWidth: '800px',
                            mx: 'auto',
                            color: alpha(theme.palette.text.primary, 0.7),
                            fontSize: '1.2rem'
                        }}
                    >
                        Delivering smart, fast, and comprehensive Formula 1 data visualization
                    </Typography>
                </Box>

                {/* Main content */}
                <Grid container spacing={6}>
                    {/* Our Story */}
                    <Grid size={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                backgroundColor: 'rgba(21,21,30,0.7)',
                                backdropFilter: 'blur(10px)',
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                borderLeft: `4px solid ${theme.palette.primary.main}`,
                                height: '100%'
                            }}
                        >
                            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: theme.palette.primary.main }}>
                                Our Story
                            </Typography>

                            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                                We started on <strong>Friday, March 27, 2025</strong>, driven by our passion for Formula 1 and a vision to create a smart, fast platform that makes race data easy to access and understand. Our team of many talented developers and designers are all dedicated F1 enthusiasts who bring both technical expertise and genuine passion to this project.
                            </Typography>

                            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                                Using the latest technologies, we've built a quick and responsive platform that delivers real-time race information with smart visualization tools. Our many features help both casual fans and serious analysts get insights faster than ever before.
                            </Typography>

                            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                                We're proud members of the <MUILink component={Link} href={"https://echo.uib.no/for-studenter/gruppe/echopitstop"}><strong>echo Pit Stop interest group</strong></MUILink>,
                                a community of passionate F1 technologists dedicated to creating smart solutions for the racing world.
                                This partnership has allowed us to leverage many specialized resources to build a platform that's not just informative, but blazingly fast and intuitive.
                            </Typography>

                            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                                Our quick development cycles and smart architecture ensure we can rapidly adapt to the fast-paced world of Formula 1, bringing you many updates and features throughout the racing season.
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Our Values */}
                    <Grid size={6}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                backgroundColor: 'rgba(21,21,30,0.7)',
                                backdropFilter: 'blur(10px)',
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                borderLeft: `4px solid ${theme.palette.primary.main}`,
                                height: '100%'
                            }}
                        >
                            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: theme.palette.primary.main }}>
                                Our Values
                            </Typography>

                            <List sx={{ mb: 3 }}>
                                <ListItem sx={{ px: 0, py: 1.5 }}>
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <SpeedIcon sx={{ color: theme.palette.primary.main }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                Quick Performance
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                                                We deliver fast, responsive data visualization that keeps pace with the lightning-quick world of Formula 1.
                                            </Typography>
                                        }
                                    />
                                </ListItem>

                                <Divider sx={{ my: 1, borderColor: alpha('#ffffff', 0.1) }} />

                                <ListItem sx={{ px: 0, py: 1.5 }}>
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <TipsAndUpdatesIcon sx={{ color: theme.palette.primary.main }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                Smart Solutions
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                                                Our smart data processing and intelligent UI design make complex race information accessible to all fans.
                                            </Typography>
                                        }
                                    />
                                </ListItem>

                                <Divider sx={{ my: 1, borderColor: alpha('#ffffff', 0.1) }} />

                                <ListItem sx={{ px: 0, py: 1.5 }}>
                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                        <GroupsIcon sx={{ color: theme.palette.primary.main }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                Many Perspectives
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                                                We offer many ways to explore F1 data, catering to casual fans and technical experts alike.
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                </Grid>

                {/* What We Offer */}
                <Box sx={{ mt: 8 }}>
                    <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
                        What We Offer
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid size={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    backgroundColor: 'rgba(21,21,30,0.7)',
                                    backdropFilter: 'blur(10px)',
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                    borderTop: `3px solid ${theme.palette.primary.main}`,
                                    height: '100%',
                                    textAlign: 'center'
                                }}
                            >
                                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                                    <DirectionsCarIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
                                </Box>

                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                                    Smart Race Analytics
                                </Typography>

                                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                                    Our smart data visualization makes it quick and easy to understand complex race strategies and performance metrics. With many customizable views, you can analyze races from any perspective.
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid size={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    backgroundColor: 'rgba(21,21,30,0.7)',
                                    backdropFilter: 'blur(10px)',
                                    border: `1px solid ${alpha('#0090D0', 0.3)}`,
                                    borderTop: `3px solid #0090D0`,
                                    height: '100%',
                                    textAlign: 'center'
                                }}
                            >
                                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                                    <AlarmIcon sx={{ fontSize: 48, color: '#0090D0' }} />
                                </Box>

                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                                    Fast Live Updates
                                </Typography>

                                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                                    Get lightning-fast updates during races with our quick data processing system. We deliver many real-time insights faster than standard broadcasts, keeping you ahead of the action.
                                </Typography>
                            </Paper>
                        </Grid>

                        <Grid size={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    backgroundColor: 'rgba(21,21,30,0.7)',
                                    backdropFilter: 'blur(10px)',
                                    border: `1px solid ${alpha('#F596C8', 0.3)}`,
                                    borderTop: `3px solid #F596C8`,
                                    height: '100%',
                                    textAlign: 'center'
                                }}
                            >
                                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                                    <EmojiEventsIcon sx={{ fontSize: 48, color: '#F596C8' }} />
                                </Box>

                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                                    Comprehensive Stats
                                </Typography>

                                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.7) }}>
                                    Explore many detailed statistics with our smart filters and quick search tools. Our platform provides fast access to driver histories, team performances, and many technical insights.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                {/* Team note */}
                <Paper
                    elevation={0}
                    sx={{
                        mt: 8,
                        p: 4,
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        borderRadius: 2,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        Join Our Fast-Growing Community
                    </Typography>

                    <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto' }}>
                        We're a smart team of many passionate F1 enthusiasts working together to create the quickest and most comprehensive racing data platform. If you love Formula 1 and share our vision for fast, intelligent data visualization, we'd love to hear from you!
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default AboutUsContent;