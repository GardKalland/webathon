'use client';

import React, { useState, useEffect } from 'react';
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
    Divider,
    Paper,
    Chip,
    CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import CloudIcon from '@mui/icons-material/Cloud';
import ResultPageContent from './ResultPageContent';

// Simple weather data for the race weekend
interface SimpleWeather {
    date: string;
    day: string;
    hasRain: boolean;
}

const PreRaceContent = () => {
    const theme = useTheme();
    const [weatherData, setWeatherData] = useState<SimpleWeather[]>([]);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [weatherError, setWeatherError] = useState<string | null>(null);
    
    // Race weekend dates and activities
    const raceWeekend = [
        { date: '2025-04-04', day: 'Practice' },
        { date: '2025-04-05', day: 'Qualifying' },
        { date: '2025-04-06', day: 'Race Day' }
    ];

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setWeatherLoading(true);
                
                // Use the Suzuka Circuit coordinates
                const res = await fetch(
                    'https://api.open-meteo.com/v1/forecast?latitude=34.85&longitude=136.54&daily=precipitation_sum&timezone=Asia/Tokyo&start_date=2025-04-04&end_date=2025-04-06'
                );
                
                if (!res.ok) {
                    throw new Error('Failed to fetch weather data');
                }
                
                const data = await res.json();
                
                if (data.daily && data.daily.precipitation_sum) {
                    // Create simple weather forecast
                    const forecast = raceWeekend.map((day, index) => ({
                        date: day.date,
                        day: day.day,
                        hasRain: data.daily.precipitation_sum[index] > 0.5 // Consider it rainy if more than 0.5mm
                    }));
                    
                    setWeatherData(forecast);
                } else {
                    throw new Error('Invalid API response format');
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
                setWeatherError('Could not load weather data');
                
                // Fallback to mock data
                setWeatherData(raceWeekend.map(day => ({
                    ...day,
                    hasRain: day.day === 'Qualifying' || day.day === 'Race Day' // Mock data: rain on qualifying and race day
                })));
            } finally {
                setWeatherLoading(false);
            }
        };
  
        fetchWeather();
    }, []);

    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    // Data for pre-race content sections
    const preRaceData = [
        {
            id: 1,
            title: 'DRIVER LINEUPS',
            description: 'Explore the latest driver lineups, team changes, and driver profiles for Suzuka.',
            image: '/pre-race-imgs/driver_lineups.jpg',
            icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.primary.main,
            link: '#'
        },
        {
            id: 2,
            title: 'TRACK ANALYSIS',
            description: 'Get insights into the Suzuka Circuit layout, weather conditions, and team strategies.',
            image: '/pre-race-imgs/track_analysis.jpg',
            icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
            color: '#0090D0',
            link: '#'
        },
        {
            id: 3,
            title: 'QUALIFYING RESULTS',
            description: 'Stay updated with the latest qualifying results and grid positions for the Japan GP.',
            image: '/pre-race-imgs/qualifying_results.jpg',
            icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
            color: '#F596C8',
            link: '#'
        },
        {
            id: 4,
            title: 'PREVIOUS RACE RECAP',
            description: 'Look back at the results and highlights from the Chinese Grand Prix in Shanghai.',
            image: '/pre-race-imgs/expert_predictions.jpg',
            icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
            color: '#E10600',
            link: '/race-after'
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
                
                {/* Weather Forecast */}
                <Box sx={{ mt: 5, mb: 4, textAlign: 'center' }}>
                    <Typography 
                        variant="h4" 
                        component="h2"
                        sx={{ 
                            fontWeight: 700, 
                            textAlign: 'center',
                            mb: 3,
                            color: '#E10600'
                        }}
                    >
                        Race Weekend Weather
                    </Typography>
                    
                    {weatherLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                            <CircularProgress size={40} sx={{ color: '#E10600' }} />
                        </Box>
                    ) : weatherError ? (
                        <Typography 
                            variant="body1" 
                            sx={{ color: 'error.main', textAlign: 'center', my: 2 }}
                        >
                            {weatherError}
                        </Typography>
                    ) : (
                        <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: 900, mx: 'auto' }}>
                            {weatherData.map((day) => (
                                <Grid size={3} key={day.date}>
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            p: 3,
                                            backgroundColor: 'rgba(21, 21, 30, 0.8)',
                                            borderTop: `4px solid ${day.hasRain ? '#E10600' : '#4CAF50'}`,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: 2
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            {day.day}
                                        </Typography>
                                        
                                        <Box sx={{ fontSize: 60, color: day.hasRain ? '#4682B4' : '#FFD700' }}>
                                            {day.hasRain ? <UmbrellaIcon fontSize="inherit" /> : <WbSunnyIcon fontSize="inherit" />}
                                        </Box>
                                        
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                fontWeight: 600,
                                                color: day.hasRain ? '#E10600' : '#4CAF50'
                                            }}
                                        >
                                            {day.hasRain ? 'Rain Expected' : 'Dry Conditions'}
                                        </Typography>
                                        
                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                            {new Date(day.date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
               
                {/* Current Standings */}
                <Box sx={{ mt: 8, mb: 6 }}>
                    <ResultPageContent sectionTitle="Current F1 2025 Standings" />
                </Box>
                
                <Divider sx={{ my: 5, borderColor: 'rgba(255,255,255,0.1)' }} />
                
            </Container>
        </Box>
    );
};

export default PreRaceContent;
