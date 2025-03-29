// src/components/pages/ThreePhaseLanding.tsx
'use client';

import React, { useState, useRef } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
    useTheme,
    alpha,
    IconButton
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FlagIcon from '@mui/icons-material/Flag';
import SpeedIcon from '@mui/icons-material/Speed';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { PhaseCard } from '@/app/components/PhaseCard';
import MapPageContent from "@/app/pages/MapPageContent";
const ThreePhaseLanding = () => {
    const theme = useTheme();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const mapContentRef = useRef<HTMLDivElement>(null);

    // Function to scroll to map content
    const scrollToMapContent = () => {
        mapContentRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Phase information
    const phases = [
        {
            id: 1,
            title: "BEFORE THE RACE",
            subtitle: "Driver Lineups & Track Analysis",
            description: "Get all the essential information before the lights go out. Team strategies, weather forecasts, qualifying results, and expert predictions.",
            icon: <FlagIcon sx={{ fontSize: 28 }} />,
            color: theme.palette.primary.main,
            link: "/race-pre"
        },
        {
            id: 2,
            title: "DURING THE RACE",
            subtitle: "Live Stats & Real-Time Updates",
            description: "Follow all the action as it happens with live timing, tire strategies, team radio highlights, and real-time race positions.",
            icon: <SpeedIcon sx={{ fontSize: 28 }} />,
            color: "#0090D0", // F1 blue
            link: "/race-during"
        },
        {
            id: 3,
            title: "AFTER THE RACE",
            subtitle: "Results & Race Analysis",
            description: "Dive into comprehensive post-race analysis with full results, driver interviews, technical breakdowns, and championship implications.",
            icon: <EmojiEventsIcon sx={{ fontSize: 28 }} />,
            color: "#F596C8", // F1 pink
            link: "/race-after"
        }
    ];

    return (
        <>
            <Box
                sx={{
                    backgroundColor: theme.palette.background.default,
                    minHeight: '85vh', // Reduced from 100vh
                    pt: { xs: 6, md: 8 }, // Reduced top padding
                    pb: 3, // Reduced bottom padding
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Background design element */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '50%',
                        height: '70%',
                        backgroundImage: 'radial-gradient(circle at top right, rgba(225, 6, 0, 0.05), transparent 70%)',
                        zIndex: 0,
                    }}
                />

                <Container maxWidth="xl" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Header section - more compact */}
                    <Box sx={{ mb: 3, textAlign: 'center', position: 'relative', zIndex: 1, mt: { xs: 1, md: 2 } }}>
                        <Typography
                            variant="h1"
                            sx={{
                                mb: 2, // Reduced margin
                                fontWeight: 800,
                                '& span': {
                                    color: theme.palette.primary.main,
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: '-3px', // Smaller underline
                                        left: 0,
                                        width: '100%',
                                        height: '2px', // Thinner underline
                                        backgroundColor: theme.palette.primary.main,
                                    }
                                }
                            }}
                        >
                            EXPERIENCE EVERY <span>MOMENT</span>
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                fontSize: '1rem', // Smaller font
                                maxWidth: '700px',
                                mx: 'auto',
                                mb: 3, // Reduced margin
                                color: alpha(theme.palette.text.primary, 0.8),
                            }}
                        >
                            Complete coverage from start to finish of the race weekend.
                        </Typography>
                    </Box>

                    {/* Three phases cards section - more compact */}
                    <Grid container spacing={2} sx={{ flexGrow: 1 }}> {/* Reduced spacing */}
                        {phases.map((phase) => (
                            <Grid size={4} key={phase.id}>
                                <PhaseCard
                                    id={phase.id}
                                    title={phase.title}
                                    subtitle={phase.subtitle}
                                    description={phase.description}
                                    icon={phase.icon}
                                    color={phase.color}
                                    height={"300px"}
                                    link={phase.link}
                                    hoveredCard={hoveredCard}
                                    setHoveredCard={setHoveredCard}
                                    compact={false} // New prop for compact mode
                                />
                            </Grid>
                        ))}
                    </Grid>

                    {/* Scroll down arrow - more compact */}
                    <Box sx={{
                        textAlign: 'center',
                        mt: 2, // Reduced margin
                        mb: 1, // Reduced margin
                        animation: 'bounce 2s infinite',
                        '@keyframes bounce': {
                            '0%, 20%, 50%, 80%, 100%': {
                                transform: 'translateY(0)'
                            },
                            '40%': {
                                transform: 'translateY(-15px)' // Smaller bounce
                            },
                            '60%': {
                                transform: 'translateY(-8px)' // Smaller bounce
                            }
                        }
                    }}>
                        <IconButton
                            onClick={scrollToMapContent}
                            size="small" // Smaller button
                            sx={{
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                p: 1.5, // Reduced padding
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                }
                            }}
                            aria-label="Scroll to map content"
                        >
                            <KeyboardArrowDownIcon />
                        </IconButton>
                        <Typography
                            variant="caption"
                            sx={{
                                display: 'block',
                                mt: 0.5, // Reduced margin
                                color: theme.palette.primary.main,
                                fontWeight: 600,
                                fontSize: '0.7rem' // Smaller font
                            }}
                        >
                            VIEW TRACK MAP
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Map content section - more compact */}
            <Box
                ref={mapContentRef}
                sx={{
                    minHeight: '80vh', // Reduced height
                    backgroundColor: theme.palette.background.paper,
                    pt: 6, // Reduced padding
                    pb: 6 // Reduced padding
                }}
            >
                <Container>

                    <Box sx={{py: 8}}>
                        <MapPageContent
                            fullHeight={false} // Smaller map for the homepage
                            showFilters={false} // No year selector on homepage
                            showRacesList={false} // No race cards list on homepage
                            defaultYear="2025" // Current season
                            sectionTitle="2025 F1 Season Calendar" // Custom title
                        />
                    </Box>

                </Container>
            </Box>
        </>
    );
};

export default ThreePhaseLanding;