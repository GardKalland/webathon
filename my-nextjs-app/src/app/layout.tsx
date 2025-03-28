// app/layout.tsx
import { ThemeRegistry } from '@/app/components/ThemeRegistry';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
    title: 'Your App Name',
    description: 'Description for your application',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <ThemeRegistry>{children}</ThemeRegistry>
        </body>
        </html>
    );
}