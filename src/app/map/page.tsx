'use client';

import { Layout } from '@/app/components/Layout/Layout';
import { F1Header } from '@/app/components/Header/F1Header';
import MapPageContent from '@/app/pages/MapPageContent';

export default function MapPage() {

  return (
    <Layout
      headerProps={{
        component: F1Header,
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
