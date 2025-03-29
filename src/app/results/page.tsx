'use client';

import { Layout } from '@/app/components/Layout/Layout';
import { F1Header } from '@/app/components/Header/F1Header';
import ResultPageContent from '@/app/pages/ResultPageContent';

export default function ResultsPage() {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Teams', href: '/teams' },
    { label: 'Drivers', href: '/drivers' },
    { label: 'Calendar', href: '/map' },
    { label: 'Results', href: '/results', isActive: true },
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
      <ResultPageContent 
        sectionTitle="F1 2025 Season Results & Standings"
      />
    </Layout>
  );
}