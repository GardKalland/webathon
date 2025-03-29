import React from 'react';
import { Box } from '@mui/material';
import { Layout } from '@/app/components/Layout/Layout';
import LandingPageContent from '@/app/pages/LandingPageContent';
import { F1Header } from '@/app/components/Header/F1Header';
import MapPageContent from '@/app/pages/MapPageContent';

export default function HomePage() {
    // For demonstration - how you would include the map on the home page
    const includeMap = true; // You can toggle this based on your needs

    return (
        <Layout
            headerProps={{
                component: F1Header,
            }}
            footerProps={{
                showSocialLinks: true
            }}
        >
            <LandingPageContent />
            
            {includeMap && (
                <Box sx={{ py: 8 }}>
                    <MapPageContent 
                        fullHeight={false} // Smaller map for the homepage
                        showFilters={false} // No year selector on homepage
                        showRacesList={false} // No race cards list on homepage
                        defaultYear="2025" // Current season
                        sectionTitle="2025 F1 Season Calendar" // Custom title
                    />
                </Box>
            )}
        </Layout>
    );
}
