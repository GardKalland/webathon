'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grow,
  alpha,
  CardMedia
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';
import { PhaseCardProps } from './PhaseCard.types';

export const PhaseCard: React.FC<PhaseCardProps> = ({
  id,
  title,
  subtitle,
  description,
  image,
  icon,
  color,
  height = "100%",
  link,
  hoveredCard,
  setHoveredCard,
  compact = false
}) => {
  return (
    <Link href={link} passHref style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          height: height,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          boxShadow: hoveredCard === id
            ? `0 10px 20px rgba(0,0,0,0.25), 0 6px 6px rgba(0,0,0,0.22)` // Smaller shadow
            : '0 2px 4px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.23)', // Smaller shadow
          transform: hoveredCard === id ? 'translateY(-6px)' : 'none', // Smaller lift
          '&:hover': {
            transform: 'translateY(-6px)', // Smaller lift
          },
          backgroundColor: 'rgba(21,21,30,0.7)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(color, 0.3)}`,
          borderLeft: `3px solid ${color}`, // Thinner border
        }}
        onMouseEnter={() => setHoveredCard(id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        {/* Card highlight line */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '3px', // Thinner line
            backgroundColor: color,
          }}
        />


        {/* Header with icon */}
        <Box sx={{
          position: 'relative',
          p: compact ? 2 : 3, // Smaller padding in compact mode
          pb: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography
            variant="overline"
            component="div"
            sx={{
              color: color,
              fontWeight: 600,
              letterSpacing: 1.5, // Slightly reduced
              fontSize: compact ? '0.65rem' : '0.75rem' // Smaller font in compact mode
            }}
          >
            PHASE {id}
          </Typography>

          {/* Icon in top corner */}
          <Box
            sx={{
              width: compact ? '36px' : '46px', // Smaller in compact mode
              height: compact ? '36px' : '46px', // Smaller in compact mode
              borderRadius: '50%',
              backgroundColor: alpha(color, 0.2),
              backdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
              border: `1px solid ${alpha(color, 0.5)}`, // Thinner border
            }}
          >
            {icon}
          </Box>
        </Box>

        {/* Add the image here */}
        {image && (
          <Box sx={{ px: compact ? 2 : 3, pt: 2 }}>
            <CardMedia
              component="img"
              image={image}
              alt={title}
              sx={{
                height: compact ? 120 : 180,
                objectFit: 'contain',
                borderRadius: 1,
                mb: 1
              }}
            />
          </Box>
        )}

        <CardContent sx={{
          p: compact ? 2 : 3, // Smaller padding in compact mode
          pt: compact ? 1.5 : 2 // Reduced top padding
        }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              mb: 0.5, // Reduced margin
              fontWeight: 700,
              color: 'white',
              fontSize: compact ? '1.5rem' : '2rem', // Smaller font in compact mode
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="h6"
            component="div"
            sx={{
              mb: 1, // Reduced margin
              fontWeight: 400,
              color: alpha('#ffffff', 0.8),
              fontSize: compact ? '0.95rem' : '1.1rem', // Smaller font in compact mode
            }}
          >
            {subtitle}
          </Typography>

          <Typography
            variant="body2"
            component="p"
            color="text.secondary"
            sx={{
              mb: 2, // Reduced margin
              color: alpha('#ffffff', 0.7),
              minHeight: compact ? '60px' : '70px', // Lower minimum height in compact mode
              fontSize: compact ? '0.8rem' : '0.875rem', // Smaller font in compact mode
              lineHeight: compact ? 1.4 : 1.5, // Tighter line height
              whiteSpace: 'pre-line' // Allow line breaks in description
            }}
          >
            {description}
          </Typography>

          <Grow
            in={hoveredCard === id}
            style={{ transformOrigin: '0 0 0' }}
            timeout={300}
          >
            <Button
              variant="outlined"
              endIcon={<ArrowForwardIcon sx={{ fontSize: compact ? '0.9rem' : '1rem' }} />}
              size={compact ? "small" : "medium"} // Smaller button in compact mode
              sx={{
                borderColor: color,
                color: color,
                '&:hover': {
                  borderColor: color,
                  backgroundColor: alpha(color, 0.1),
                },
                mt: 0.5, // Reduced margin
                fontSize: compact ? '0.7rem' : '0.8rem', // Smaller font
                py: compact ? 0.5 : 0.75, // Reduced padding
              }}
            >
<<<<<<< HEAD
                {/* Card highlight line */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '40%',
                        height: '3px', // Thinner line
                        backgroundColor: color,
                    }}
                />

                {/* Header with icon */}
                <Box sx={{
                    position: 'relative',
                    p: compact ? 2 : 3, // Smaller padding in compact mode
                    pb: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography
                        variant="overline"
                        component="div"
                        sx={{
                            color: color,
                            fontWeight: 600,
                            letterSpacing: 1.5, // Slightly reduced
                            fontSize: compact ? '0.65rem' : '0.75rem' // Smaller font in compact mode
                        }}
                    >
                        {toptext}
                    </Typography>

                    {/* Icon in top corner */}
                    <Box
                        sx={{
                            width: compact ? '36px' : '46px', // Smaller in compact mode
                            height: compact ? '36px' : '46px', // Smaller in compact mode
                            borderRadius: '50%',
                            backgroundColor: alpha(color, 0.2),
                            backdropFilter: 'blur(5px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: color,
                            border: `1px solid ${alpha(color, 0.5)}`, // Thinner border
                        }}
                    >
                        {icon}
                    </Box>
                </Box>

                <CardContent sx={{
                    p: compact ? 2 : 3, // Smaller padding in compact mode
                    pt: compact ? 1.5 : 2 // Reduced top padding
                }}>
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            mb: 0.5, // Reduced margin
                            fontWeight: 700,
                            color: 'white',
                            fontSize: compact ? '1.5rem' : '2rem', // Smaller font in compact mode
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            mb: 1, // Reduced margin
                            fontWeight: 400,
                            color: alpha('#ffffff', 0.8),
                            fontSize: compact ? '0.95rem' : '1.1rem', // Smaller font in compact mode
                        }}
                    >
                        {subtitle}
                    </Typography>

                    <Typography
                        variant="body2"
                        component="p"
                        color="text.secondary"
                        sx={{
                            mb: 2, // Reduced margin
                            color: alpha('#ffffff', 0.7),
                            minHeight: compact ? '60px' : '70px', // Lower minimum height in compact mode
                            fontSize: compact ? '0.8rem' : '0.875rem', // Smaller font in compact mode
                            lineHeight: compact ? 1.4 : 1.5 // Tighter line height
                        }}
                    >
                        {description}
                    </Typography>

                    <Grow
                        in={hoveredCard === id}
                        style={{ transformOrigin: '0 0 0' }}
                        timeout={300}
                    >
                        <Button
                            variant="outlined"
                            endIcon={<ArrowForwardIcon sx={{ fontSize: compact ? '0.9rem' : '1rem' }} />}
                            size={compact ? "small" : "medium"} // Smaller button in compact mode
                            sx={{
                                borderColor: color,
                                color: color,
                                '&:hover': {
                                    borderColor: color,
                                    backgroundColor: alpha(color, 0.1),
                                },
                                mt: 0.5, // Reduced margin
                                fontSize: compact ? '0.7rem' : '0.8rem', // Smaller font
                                py: compact ? 0.5 : 0.75, // Reduced padding
                            }}
                        >
                            EXPLORE NOW
                        </Button>
                    </Grow>
                </CardContent>
            </Card>
        </Link>
    );
};
=======
              EXPLORE NOW
            </Button>
          </Grow>
        </CardContent>
      </Card>
    </Link>
  );
};
>>>>>>> 6092aee (we racing g🏎️)
