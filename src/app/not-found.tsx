// app/not-found.tsx
'use client';

import { Box, Container, Typography, Button, useTheme, alpha } from '@mui/material';
import Link from 'next/link';
import { Layout } from '@/app/components/Layout';
import { F1Header } from '@/app/components/Header/F1Header';

export default function NotFound() {
  const theme = useTheme();

  return (
    <Layout
      headerProps={{
        component: F1Header,
      }}
      footerProps={{
        showSocialLinks: true
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Racing line graphics */}
        <Box
          sx={{
            position: 'absolute',
            top: '30%',
            left: -100,
            width: '120%',
            height: '1px',
            bgcolor: alpha(theme.palette.primary.main, 0.2),
            transform: 'rotate(2deg)',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '60%',
            left: -100,
            width: '120%',
            height: '1px',
            bgcolor: alpha(theme.palette.primary.main, 0.2),
            transform: 'rotate(-2deg)',
            zIndex: 0,
          }}
        />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '6rem', md: '12rem' },
              fontWeight: 900,
              color: theme.palette.primary.main,
              lineHeight: 1,
              textShadow: '4px 4px 8px rgba(0,0,0,0.2)',
              mb: 2,
            }}
          >
            404
          </Typography>

          <Typography
            variant="h4"
            sx={{
              mb: 4,
              fontWeight: 700,
              '& span': {
                color: theme.palette.primary.main
              }
            }}
          >
            Black Flag! <span>Page Not Found</span>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 6,
              fontSize: '1.1rem',
              maxWidth: '600px',
              mx: 'auto',
              color: alpha(theme.palette.text.primary, 0.8)
            }}
          >
            Looks like you've veered off track! The page you're looking for doesn't exist or has been moved. Our quick pit crew is working to get you back in the race as fast as possible.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              component={Link}
              href="/"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 700,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              }}
            >
              BACK TO HOME
            </Button>

            <Button
              variant="outlined"
              component={Link}
              href="/results"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 700,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
              }}
            >
              RACE RESULTS
            </Button>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
}
