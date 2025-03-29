'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { PodiumCardProps } from './PodiumCard.types';

// Define the position colors
const positionColors = {
  first: { 
    bg: 'rgba(255, 215, 0, 0.1)',
    border: 'rgba(255, 215, 0, 0.2)',
    badge: 'rgba(255, 215, 0, 0.8)'
  },
  second: { 
    bg: 'rgba(192, 192, 192, 0.1)',
    border: 'rgba(192, 192, 192, 0.2)',
    badge: 'rgba(192, 192, 192, 0.8)'
  },
  third: { 
    bg: 'rgba(205, 127, 50, 0.1)',
    border: 'rgba(205, 127, 50, 0.2)',
    badge: 'rgba(205, 127, 50, 0.8)'
  }
};

const PodiumCard: React.FC<PodiumCardProps> = ({
  position,
  driver,
  team,
  showPosition = true
}) => {
  return (
    <Box sx={{
      backgroundColor: positionColors[position].bg,
      border: `1px solid ${positionColors[position].border}`,
      borderRadius: 1,
      p: 1.5,
      textAlign: 'center',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative',
      ...(showPosition && {
        '&::before': {
          content: `"${position === 'first' ? '1' : position === 'second' ? '2' : '3'}"`,
          position: 'absolute',
          top: -12,
          left: '50%',
          transform: 'translateX(-50%)',
          bgcolor: positionColors[position].badge,
          color: '#000',
          width: 24,
          height: 24,
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: '0.85rem'
        }
      })
    }}>
      {driver ? (
        <>
          <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5 }}>
            {driver}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            {team}
          </Typography>
        </>
      ) : (
        <Typography variant="body2" sx={{ opacity: 0.5 }}>
          TBD
        </Typography>
      )}
    </Box>
  );
};

export default PodiumCard;