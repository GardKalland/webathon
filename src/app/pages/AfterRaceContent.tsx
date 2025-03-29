'use client';

import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    useTheme,
    alpha
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const LandingPageContent = () => {
    const theme = useTheme();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    // Data placeholders for landing page sections
    const landingPageData = [
        {
            id: 1,
            title: 'DRIVER PROFILES',
            description: 'Explore detailed profiles of all F1 drivers, including stats and career highlights.',
            image: '/post-race-imgs/driver_profiles.jpg',
            icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.primary.main
        },
        {
            id: 2,
            title: 'RACE CALENDAR',
            description: 'Stay updated with the latest race schedules, track details, and event timings.',
            image: '/post-race-imgs/race_calendar.jpg',
            icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
            color: '#0090D0'
        },
        {
            id: 3,
            title: 'STATISTICS & ANALYTICS',
            description: 'Dive into race statistics, driver performance, and team standings.',
            image: '/post-race-imgs/analytics_statistics.jpg',
            icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
            color: '#F596C8'
        }
    ];

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                minHeight: '100vh',
                pt: { xs: 16, md: 20 },
                pb: 10,
                position: 'relative',
            }}
        >
            {/* Header */}
            <Container maxWidth="xl">
                <Box sx={{ mb: 8, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '2.5rem', md: '4rem' },
                            mb: 3,
                            fontWeight: 800,
                            '& span': {
                                color: theme.palette.primary.main,
                                position: 'relative',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: '-5px',
                                    left: 0,
                                    width: '100%',
                                    height: '3px',
                                    backgroundColor: theme.palette.primary.main,
                                }
                            }
                        }}
                    >
                        F1 <span>OVERVIEW</span>
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: '1.2rem',
                            maxWidth: '800px',
                            mx: 'auto',
                            mb: 4,
                            color: alpha(theme.palette.text.primary, 0.8),
                        }}
                    >
                        Welcome to the ultimate F1 experience. Explore drivers, races, and in-depth analytics.
                    </Typography>
                </Box>

                {/* Cards */}
                <Grid container justifyContent={'space-evenly'}>
                    {landingPageData.map((item) => (
                        <Grid key={item.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    boxShadow: hoveredCard === item.id
                                        ? `0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)`
                                        : '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
                                    transform: hoveredCard === item.id ? 'translateY(-10px)' : 'none',
                                    '&:hover': {
                                        transform: 'translateY(-10px)',
                                    },
                                    backgroundColor: 'rgba(21,21,30,0.7)',
                                    backdropFilter: 'blur(10px)',
                                    border: `1px solid ${alpha(item.color, 0.3)}`,
                                    borderLeft: `5px solid ${item.color}`,
                                }}
                                onMouseEnter={() => setHoveredCard(item.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        width: '40%',
                                        height: '5px',
                                        backgroundColor: item.color,
                                    }}
                                />
                                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                    <CardMedia
                                        component="img"
                                        height="240"
                                        image={item.image}
                                        alt={item.title}
                                        sx={{
                                            transition: 'transform 0.5s ease',
                                            transform: hoveredCard === item.id ? 'scale(1.05)' : 'scale(1)',
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'rgba(0,0,0,0.3)',
                                            backgroundImage: 'linear-gradient(to bottom, transparent, rgba(21,21,30,0.8))',
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 20,
                                            right: 20,
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            backgroundColor: alpha(item.color, 0.2),
                                            backdropFilter: 'blur(5px)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: item.color,
                                            border: `2px solid ${alpha(item.color, 0.5)}`,
                                        }}
                                    >
                                        {item.icon}
                                    </Box>
                                </Box>

                                <CardContent sx={{ p: 3 }}>
                                    <Typography
                                        variant="h5"
                                        sx={{ mb: 1, fontWeight: 700, color: 'white' }}
                                    >
                                        {item.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mb: 2,
                                            color: alpha('#ffffff', 0.8),
                                            minHeight: '70px',
                                        }}
                                    >
                                        {item.description}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{
                                            borderColor: item.color,
                                            color: item.color,
                                            '&:hover': {
                                                borderColor: item.color,
                                                backgroundColor: alpha(item.color, 0.1),
                                            },
                                        }}
                                    >
                                        EXPLORE
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Visualization placeholders */}
                <Box
                    sx={{
                        mt: 8,
                        p: 4,
                        backgroundColor: alpha(theme.palette.background.paper, 0.5),
                        borderRadius: 2,
                        backdropFilter: 'blur(10px)',
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
                        ANALYTICS & VISUALIZATIONS
                    </Typography>

                    {/* Placeholder for driver stats */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Driver Statistics
                        </Typography>
                        {/* Insert driver stats visualization here */}
                        {/* e.g. <DriverStatsVisualization /> */}
                    </Box>

                    {/* Placeholder for race stats */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Race Statistics
                        </Typography>
                        {/* Insert race stats visualization here */}
                        {/* e.g. <RaceStatsVisualization /> */}
                    </Box>

                    {/* Placeholder for team standings */}
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Team Standings
                        </Typography>
                        {/* Insert team standings visualization here */}
                        {/* e.g. <TeamStandingsVisualization /> */}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default LandingPageContent;