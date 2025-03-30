'use client';

import React from 'react';
import { Container, Typography, Box, Paper, Divider, Grid, Avatar, Chip } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SpeedIcon from '@mui/icons-material/Speed';
import CloudIcon from '@mui/icons-material/Cloud';
import BrushIcon from '@mui/icons-material/Brush';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import NoFoodIcon from '@mui/icons-material/NoFood';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import PetsIcon from '@mui/icons-material/Pets';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import {Layout} from "@/app/components/Layout";
import {F1Header} from "@/app/components/Header/F1Header";
import MapPageContent from "@/app/pages/MapPageContent";
import HistoryContent from "@/app/pages/HistoryContent";

export default function OurHistoryPage() {
    return (
        <Layout
            headerProps={{
                component: F1Header,
            }}
            footerProps={{
                showSocialLinks: true
            }}
        >
            <HistoryContent />
        </Layout>
    );
}
