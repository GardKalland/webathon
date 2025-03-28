// src/components/pages/ThreePhaseLanding.tsx
'use client';

import React, { useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
    Card,
    CardMedia,
    CardContent,
    useTheme,
    alpha,
    Grow
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FlagIcon from '@mui/icons-material/Flag';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import Link from 'next/link';

const ThreePhaseLanding = () => {
    const theme = useTheme();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    // Phase information
    const phases = [
        {
            id: 1,
            title: "BEFORE THE RACE",
            subtitle: "Driver Lineups & Track Analysis",
            description: "Get all the essential information before the lights go out. Team strategies, weather forecasts, qualifying results, and expert predictions.",
            image: "/pre-race.jpg", // Replace with actual image
            icon: <FlagIcon sx={{ fontSize: 40 }} />,
            color: theme.palette.primary.main,
            link: "/pre-race"
        },
        {
            id: 2,
            title: "DURING THE RACE",
            subtitle: "Live Stats & Real-Time Updates",
            description: "Follow all the action as it happens with live timing, tire strategies, team radio highlights, and real-time race positions.",
            image: "/mid-race.jpg", // Replace with actual image
            icon: <FlagIcon sx={{ fontSize: 40 }} />,
            color: "#0090D0", // F1 blue
            link: "/mid-race"
        },
        {
            id: 3,
            title: "AFTER THE RACE",
            subtitle: "Results & Race Analysis",
            description: "Dive into comprehensive post-race analysis with full results, driver interviews, technical breakdowns, and championship implications.",
            image: "/post-race.jpg", // Replace with actual image
            icon: <EmojiEventsIcon sx={{ fontSize: 40 }} />,
            color: "#F596C8", // F1 pink
            link: "/post-race"
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

            <Container maxWidth="xl">
                {/* Header section */}
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
                        EXPERIENCE EVERY <span>MOMENT</span>
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
                        Complete coverage from start to finish. Access detailed information for every phase of the race weekend.
                    </Typography>
                </Box>

                {/* Three phases cards section */}
                <Grid container spacing={4}>
                    {phases.map((phase, index) => (
                        <Grid key={phase.id}>
                            <Link href={phase.link} passHref style={{ textDecoration: 'none' }}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        boxShadow: hoveredCard === phase.id
                                            ? `0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)`
                                            : '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
                                        transform: hoveredCard === phase.id ? 'translateY(-10px)' : 'none',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                        },
                                        backgroundColor: 'rgba(21,21,30,0.7)',
                                        backdropFilter: 'blur(10px)',
                                        border: `1px solid ${alpha(phase.color, 0.3)}`,
                                        borderLeft: `5px solid ${phase.color}`,
                                    }}
                                    onMouseEnter={() => setHoveredCard(phase.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    {/* Card highlight line */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            width: '40%',
                                            height: '5px',
                                            backgroundColor: phase.color,
                                        }}
                                    />

                                    {/* Image with hover overlay */}
                                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                        <CardMedia
                                            component="img"
                                            height="240"
                                            image={phase.image}
                                            alt={phase.title}
                                            sx={{
                                                transition: 'transform 0.5s ease',
                                                transform: hoveredCard === phase.id ? 'scale(1.05)' : 'scale(1)',
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
                                                backgroundImage: `linear-gradient(to bottom, transparent, rgba(21,21,30,0.8))`,
                                                opacity: hoveredCard === phase.id ? 0.7 : 1,
                                                transition: 'opacity 0.3s ease',
                                            }}
                                        />

                                        {/* Icon in top corner */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 20,
                                                right: 20,
                                                width: '60px',
                                                height: '60px',
                                                borderRadius: '50%',
                                                backgroundColor: alpha(phase.color, 0.2),
                                                backdropFilter: 'blur(5px)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: phase.color,
                                                border: `2px solid ${alpha(phase.color, 0.5)}`,
                                            }}
                                        >
                                            {phase.icon}
                                        </Box>
                                    </Box>

                                    <CardContent sx={{ p: 3 }}>
                                        <Typography
                                            variant="overline"
                                            component="div"
                                            sx={{
                                                color: phase.color,
                                                fontWeight: 600,
                                                letterSpacing: 2,
                                                mb: 1,
                                            }}
                                        >
                                            PHASE {phase.id}
                                        </Typography>

                                        <Typography
                                            variant="h4"
                                            component="h2"
                                            sx={{
                                                mb: 1,
                                                fontWeight: 700,
                                                color: 'white',
                                            }}
                                        >
                                            {phase.title}
                                        </Typography>

                                        <Typography
                                            variant="h6"
                                            component="div"
                                            sx={{
                                                mb: 2,
                                                fontWeight: 400,
                                                color: alpha('#ffffff', 0.8),
                                            }}
                                        >
                                            {phase.subtitle}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            component="p"
                                            color="text.secondary"
                                            sx={{
                                                mb: 3,
                                                color: alpha('#ffffff', 0.7),
                                                minHeight: '70px',
                                            }}
                                        >
                                            {phase.description}
                                        </Typography>

                                        <Grow
                                            in={hoveredCard === phase.id}
                                            style={{ transformOrigin: '0 0 0' }}
                                            timeout={300}
                                        >
                                            <Button
                                                variant="outlined"
                                                endIcon={<ArrowForwardIcon />}
                                                sx={{
                                                    borderColor: phase.color,
                                                    color: phase.color,
                                                    '&:hover': {
                                                        borderColor: phase.color,
                                                        backgroundColor: alpha(phase.color, 0.1),
                                                    },
                                                    mt: 1,
                                                }}
                                            >
                                                EXPLORE NOW
                                            </Button>
                                        </Grow>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>

                {/* Bottom call to action */}
                <Box
                    sx={{
                        mt: 10,
                        textAlign: 'center',
                        p: 5,
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.background.paper, 0.5),
                        backdropFilter: 'blur(10px)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Design element */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '5px',
                            background: 'linear-gradient(90deg, #E10600, #0090D0, #F596C8)',
                        }}
                    />

                    <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                        COMPLETE RACE EXPERIENCE
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            maxWidth: '700px',
                            mx: 'auto',
                            mb: 4,
                            color: alpha(theme.palette.text.primary, 0.8),
                        }}
                    >
                        From pre-race preparations to post-race celebrations, we've got you covered with comprehensive coverage and expert analysis for every Grand Prix.
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{
                            px: 4,
                            py: 1.5,
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            position: 'relative',
                            overflow: 'hidden',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '200%',
                                height: '100%',
                                backgroundImage: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
                                transition: 'transform 0.6s ease',
                                transform: 'translateX(-100%)',
                            },
                            '&:hover::after': {
                                transform: 'translateX(100%)',
                            },
                        }}
                    >
                        VIEW NEXT RACE
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default ThreePhaseLanding;