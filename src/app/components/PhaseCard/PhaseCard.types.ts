import { ReactNode } from 'react';

export interface PhaseCardProps {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    image?: string;
    icon?: ReactNode;
    color: string;
    link: string;
    hoveredCard: number | null;
    setHoveredCard: (id: number | null) => void;
    compact?: boolean; // New prop for compact mode

}