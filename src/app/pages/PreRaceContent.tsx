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

const PreRaceContent = () => {
    const theme = useTheme();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    // Data placeholders for landing page sections
    const preRaceData = [
        {
            id: 1,
            title: 'DRIVER LINEUPS',
            description: 'Explore the latest driver lineups, team changes, and driver profiles.',
            image: '/pre-race-imgs/driver_lineups.jpg',
            icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.primary.main
        },
        {
            id: 2,
            title: 'TRACK ANALYSIS',
            description: 'Get insights into the track layout, weather conditions, and team strategies.',
            image: '/pre-race-imgs/track_analysis.jpg',
            icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
            color: '#0090D0'
        },
        {
            id: 3,
            title: 'QUALIFYING RESULTS',
            description: 'Stay updated with the latest qualifying results and grid positions.',
            image: '/pre-race-imgs/qualifying_results.jpg',
            icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
            color: '#F596C8'
        },
        {
            id: 4,
            title: 'EXPERT PREDICTIONS',
            description: 'Get insights from F1 analysts and predictions for the upcoming race weekend.',
            image: '/pre-race-imgs/expert_predictions.jpg',
            icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
            color: '#E10600'
        }
    ];

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.default,
                minHeight: '100vh',
                pt: { xs: 16, md: 5 },
                pb: 10,
                position: 'relative',
            }}
        >
            {/* Header */}
            <Container maxWidth="xl">
                {/* Cards */}
                <Grid container justifyContent={'space-evenly'} rows={2} spacing={4}>
                    {preRaceData.map((item) => (
                        <Grid key={item.id}>
                            <Card
                                sx={{
                                    width: '30vw',
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
            </Container>
        </Box>
    );
};

export default PreRaceContent;