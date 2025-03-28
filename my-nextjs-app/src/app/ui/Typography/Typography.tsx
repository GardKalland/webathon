// src/components/ui/Typography/Typography.tsx
'use client';

import { FC } from 'react';
import { Typography as MuiTypography } from '@mui/material';
import { TypographyProps } from './Typography.types';

export const Typography: FC<TypographyProps> = ({
                                                    variant = 'body1',
                                                    fontWeight,
                                                    color,
                                                    textAlign,
                                                    customClassName,
                                                    children,
                                                    ...props
                                                }) => {
    return (
        <MuiTypography
            variant={variant}
            sx={{
                fontWeight,
                color,
                textAlign,
                ...(props.sx || {}),
            }}
            className={customClassName}
            {...props}
        >
            {children}
        </MuiTypography>
    );
};