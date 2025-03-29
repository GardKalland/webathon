'use client';

import { Layout } from '@/app/components/Layout/Layout';
import { F1Header } from '@/app/components/Header/F1Header';
import MapPageContent from '@/app/pages/MapPageContent';

export default function MapPage() {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Teams', href: '/teams' },
    { label: 'Drivers', href: '/drivers' },
    { label: 'Calendar', href: '/map', isActive: true },
    { label: 'Results', href: '/results' },
  ];

  return (
    <Layout
      headerProps={{
        component: F1Header,
        props: { navItems }
      }}
      footerProps={{
        showSocialLinks: true
      }}
    >
      <MapPageContent 
        fullHeight={true}
        showFilters={true}
        showRacesList={true}
        defaultYear="2025"
        sectionTitle="F1 Race Calendar"
      />
    </Layout>
  );
}
