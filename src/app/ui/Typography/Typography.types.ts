// src/components/ui/Typography/Typography.types.ts
import { TypographyProps as MuiTypographyProps } from '@mui/material';

export interface TypographyProps extends MuiTypographyProps {
    fontWeight?: 'light' | 'regular' | 'medium' | 'bold';
    color?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    customClassName?: string;
}