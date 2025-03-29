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
            ? `0 10px 20px rgba(0,0,0,0.25), 0 6px 6px rgba(0,0,0,0.22)`
            : '0 2px 4px rgba(0,0,0,0.16), 0 2px 4px rgba(0,0,0,0.23)',
          transform: hoveredCard === id ? 'translateY(-6px)' : 'none',
          '&:hover': {
            transform: 'translateY(-6px)',
          },
          backgroundColor: 'rgba(21,21,30,0.7)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(color, 0.3)}`,
          borderLeft: `3px solid ${color}`,
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
            height: '3px',
            backgroundColor: color,
          }}
        />

        {/* Header with icon */}
        <Box sx={{
          position: 'relative',
          p: compact ? 2 : 3,
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
              letterSpacing: 1.5,
              fontSize: compact ? '0.65rem' : '0.75rem'
            }}
          >
            PHASE {id}
          </Typography>

          {/* Icon in top corner */}
          <Box
            sx={{
              width: compact ? '36px' : '46px',
              height: compact ? '36px' : '46px',
              borderRadius: '50%',
              backgroundColor: alpha(color, 0.2),
              backdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
              border: `1px solid ${alpha(color, 0.5)}`,
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
          p: compact ? 2 : 3,
          pt: compact ? 1.5 : 2
        }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              mb: 0.5,
              fontWeight: 700,
              color: 'white',
              fontSize: compact ? '1.5rem' : '2rem',
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="h6"
            component="div"
            sx={{
              mb: 1,
              fontWeight: 400,
              color: alpha('#ffffff', 0.8),
              fontSize: compact ? '0.95rem' : '1.1rem',
            }}
          >
            {subtitle}
          </Typography>

          <Typography
            variant="body2"
            component="p"
            color="text.secondary"
            sx={{
              mb: 2,
              color: alpha('#ffffff', 0.7),
              minHeight: compact ? '60px' : '70px',
              fontSize: compact ? '0.8rem' : '0.875rem',
              lineHeight: compact ? 1.4 : 1.5,
              whiteSpace: 'pre-line'
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
              size={compact ? "small" : "medium"}
              sx={{
                borderColor: color,
                color: color,
                '&:hover': {
                  borderColor: color,
                  backgroundColor: alpha(color, 0.1),
                },
                mt: 0.5,
                fontSize: compact ? '0.7rem' : '0.8rem',
                py: compact ? 0.5 : 0.75,
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