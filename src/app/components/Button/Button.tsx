'use client';

import { FC } from 'react';
import { Button as MuiButton } from '@mui/material';
import { ButtonProps } from './Button.types';

export const Button: FC<ButtonProps> = ({
                                            variant = 'contained',
                                            color = 'primary',
                                            size = 'medium',
                                            customWidth,
                                            customHeight,
                                            customClassName,
                                            children,
                                            sx,
                                            ...props
                                        }) => {
    return (
        <MuiButton
            variant={variant}
            color={color}
            size={size}
            className={customClassName}
            sx={{
                width: customWidth,
                height: customHeight,
                ...(sx || {}),
            }}
            {...props}
        >
            {children}
        </MuiButton>
    );
};
