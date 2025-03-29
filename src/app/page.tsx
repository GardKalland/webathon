import React from 'react';
import { Box } from '@mui/material';
import { Layout } from '@/app/components/Layout/Layout';
import LandingPageContent from '@/app/pages/LandingPageContent';
import { F1Header } from '@/app/components/Header/F1Header';
import MapPageContent from '@/app/pages/MapPageContent';

export default function HomePage() {
    // For demonstration - how you would include the map on the home page

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
        </Layout>
    );
}
