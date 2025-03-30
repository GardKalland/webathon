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
    Divider,
    Paper,
    Chip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FlagIcon from '@mui/icons-material/Flag';
import ResultPageContent from './ResultPageContent';

const AfterRaceContent = () => {
    const theme = useTheme();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    // Chinese Grand Prix winners data
    const chineseGPWinners = {
        raceTitle: "Chinese Grand Prix Results",
        date: "March 23, 2025",
        location: "Shanghai International Circuit",
        podium: [
            { position: 1, driver: "Oscar Piastri", team: "McLaren", number: "81", time: "1:30:55.026", points: 25 },
            { position: 2, driver: "Lando Norris", team: "McLaren", number: "4", time: "+9.748s", points: 18 },
            { position: 3, driver: "George Russell", team: "Mercedes", number: "63", time: "+11.097s", points: 15 }
        ],
        fastestLap: {
            driver: "Lando Norris",
            team: "McLaren",
            time: "1:35.454",
            lap: 53
        }
    };

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
            {/* Header - Chinese Grand Prix */}
            <Container maxWidth="xl">
                {/* Race Title */}
                <Box sx={{
                    mb: 4,
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
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
                            mb: 1
                        }}
                    >
                        Race Recap: Chinese Grand Prix
                    </Typography>

                    <Typography
                        variant="h5"
                        component="h2"
                        sx={{
                            fontWeight: 500,
                            color: 'white',
                            mb: 1,
                            opacity: 0.9
                        }}
                    >
                        Shanghai International Circuit • 23 March, 2025
                    </Typography>
                </Box>

                {/* Chinese Grand Prix Winners Section */}
                <Box
                    sx={{
                        mb: 6,
                        p: 4,
                        backgroundColor: 'rgba(21, 21, 30, 0.9)',
                        borderRadius: 2,
                        border: '2px solid #E10600',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                        maxWidth: '1200px',
                        mx: 'auto'
                    }}
                >
                    <Typography
                        variant="h3"
                        component="h2"
                        sx={{
                            fontWeight: 800,
                            color: '#E10600',
                            textTransform: 'uppercase',
                            borderBottom: '4px solid #E10600',
                            pb: 1,
                            mb: 3,
                            textAlign: 'center'
                        }}
                    >
                        Podium Finishers
                    </Typography>

                    <Grid container spacing={3} sx={{ mb: 4 }} justifyContent="center">
                        {chineseGPWinners.podium.map((driver) => (
                            <Grid item xs={12} md={4} key={driver.position}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: 3,
                                        backgroundColor: driver.position === 1
                                            ? alpha('#FFD700', 0.15)
                                            : driver.position === 2
                                                ? alpha('#C0C0C0', 0.15)
                                                : alpha('#CD7F32', 0.15),
                                        borderTop: `4px solid ${
                                            driver.position === 1
                                                ? '#FFD700'
                                                : driver.position === 2
                                                    ? '#C0C0C0'
                                                    : '#CD7F32'
                                        }`,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <Chip
                                        label={`P${driver.position}`}
                                        color="primary"
                                        sx={{
                                            fontWeight: 'bold',
                                            mb: 1,
                                            backgroundColor: driver.position === 1
                                                ? '#FFD700'
                                                : driver.position === 2
                                                    ? '#C0C0C0'
                                                    : '#CD7F32',
                                            color: '#000000'
                                        }}
                                    />

                                    <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center' }}>
                                        {driver.driver}
                                    </Typography>

                                    <Typography variant="body1" sx={{ fontWeight: 500, opacity: 0.8 }}>
                                        {driver.team} · #{driver.number}
                                    </Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
                                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                                            Time: {driver.time}
                                        </Typography>

                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            +{driver.points} pts
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 2,
                            backgroundColor: alpha('#E10600', 0.15),
                            p: 2,
                            borderRadius: 1,
                            maxWidth: '600px',
                            mx: 'auto'
                        }}
                    >
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            Fastest Lap:
                        </Typography>

                        <Typography variant="body1">
                            {chineseGPWinners.fastestLap.driver} ({chineseGPWinners.fastestLap.team})
                        </Typography>

                        <Typography variant="body1" sx={{ fontWeight: 600, color: '#E10600' }}>
                            {chineseGPWinners.fastestLap.time}
                        </Typography>

                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                            Lap {chineseGPWinners.fastestLap.lap}
                        </Typography>
                    </Box>
                </Box>

                {/* Race Results */}
                <Box sx={{ mb: 5 }}>
                    <ResultPageContent sectionTitle="Chinese Grand Prix Results" />
                </Box>

                {/* Track Map */}
                <Box sx={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 4
                }}>
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
                        Shanghai International Circuit
                    </Typography>

                    <Box
                        sx={{
                            maxWidth: '800px',
                            width: '100%',
                            border: '3px solid rgba(225, 6, 0, 0.6)',
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                            mb: 2
                        }}
                    >
                        <img
                            src="https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/China_Circuit.png"
                            alt="Shanghai International Circuit Layout"
                            style={{
                                width: '100%',
                                height: 'auto',
                                display: 'block'
                            }}
                        />
                    </Box>

                    <Typography
                        variant="body1"
                        sx={{
                            maxWidth: '800px',
                            color: 'white',
                            opacity: 0.8,
                            textAlign: 'center'
                        }}
                    >
                        The 5.451 km Shanghai International Circuit features 16 turns and is known for its demanding combination of high-speed straights and technical corners.
                    </Typography>
                </Box>

                <Divider sx={{ my: 5, borderColor: 'rgba(255,255,255,0.1)' }} />
            </Container>
        </Box>
    );
};

export default AfterRaceContent;