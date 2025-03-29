// app/about/page.tsx
import { Layout } from '@/app/components/Layout';
import AboutUsContent from '@/app/pages/AboutUsContent';
import { F1Header } from '@/app/components/Header/F1Header';
import { Footer } from '@/app/components/Footer/Footer';

export default function AboutPage() {
    return (
        <Layout
            headerProps={{
                component: F1Header,
                navItems:  [
                    { label: 'Home', href: '/', },
                    { label: 'Standings', href: '/results'},
                    { label: 'Map', href: '/map', },
                    { label: 'Pre-Race', href: '/race-pre' },
                    { label: 'During', href: '/race-during' },
                    { label: 'Post-Race', href: '/race-after' },
                    { label: 'echo pit-stop', href: '/about',  isActive: true },
                ]
            }}
            footerProps={{
                showSocialLinks: true
            }}
        >
            <AboutUsContent />
        </Layout>
    );
}