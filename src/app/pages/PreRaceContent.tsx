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
    alpha,
    Divider
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ResultPageContent from './ResultPageContent';

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
                pt: { xs: 16, md: 8 },
                pb: 12,
                position: 'relative',
            }}
        >
            {/* Header - Japan Grand Prix */}
            <Container maxWidth="xl">
                {/* Race Title */}
                <Box sx={{ 
                    mb: 6, 
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3
                }}>
                    <Typography 
                        variant="h2" 
                        component="h1"
                        sx={{ 
                            fontWeight: 800, 
                            color: '#E10600',
                            textTransform: 'uppercase',
                            borderBottom: '4px solid #E10600',
                            pb: 1,
                            mb: 2
                        }}
                    >
                        Next Race: Japan Grand Prix
                    </Typography>
                    
                    <Typography 
                        variant="h5" 
                        component="h2"
                        sx={{ 
                            fontWeight: 500, 
                            color: 'white',
                            mb: 3,
                            opacity: 0.9
                        }}
                    >
                        Suzuka Circuit • 4-6 April, 2025
                    </Typography>
                    
                    {/* Track Image */}
                    <Box 
                        sx={{
                            maxWidth: '800px',
                            width: '100%',
                            border: '3px solid rgba(225, 6, 0, 0.6)',
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                            mb: 3
                        }}
                    >
                        <img 
                            src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Japan_Circuit.png" 
                            alt="Suzuka Circuit Layout"
                            style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block'
                            }}
                        />
                    </Box>
                </Box>
                
                {/* Current Standings */}
                <Box sx={{ mt: 8, mb: 6 }}>
                    <ResultPageContent sectionTitle="Current F1 2025 Standings" />
                </Box>
                
                <Divider sx={{ my: 5, borderColor: 'rgba(255,255,255,0.1)' }} />
                
                {/* Pre-Race Coverage */}
                <Typography 
                    variant="h3" 
                    component="h2" 
                    sx={{ 
                        textAlign: 'center', 
                        mb: 4, 
                        color: '#E10600',
                        fontWeight: 700
                    }}
                >
                    Pre-Race Coverage
                </Typography>
                
                {/* Cards */}
                <Grid container spacing={4} justifyContent="center" sx={{ mt: 3 }}>
                    {preRaceData.map((item) => (
                        <Grid item key={item.id} xs={12} sm={6} md={5} lg={3}>
                            <Card
                                sx={{
                                    width: '100%',
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
