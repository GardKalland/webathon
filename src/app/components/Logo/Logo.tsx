'use client';

import { FC } from 'react';
import { Box } from '@mui/material';
import { LogoProps } from './Logo.types';
import Link from 'next/link';

export const Logo: FC<LogoProps> = ({
                                        height = '40px',
                                        width = 'auto',
                                        alt = 'Company Logo',
                                        ...props
                                    }) => {
    return (
        <Link href="/public" passHref style={{ textDecoration: 'none' }}>
            <Box
                component="img"
                sx={{
                    height,
                    width,
                    ...props.sx,
                }}
                alt={alt}
                src="/logo.svg" // Replace with your actual logo path
                {...props}
            />
        </Link>
    );
};
