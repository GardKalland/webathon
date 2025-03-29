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
import FlagIcon from '@mui/icons-material/Flag';
import ResultPageContent from './ResultPageContent';

const AfterRaceContent = () => {
    const theme = useTheme();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    
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
