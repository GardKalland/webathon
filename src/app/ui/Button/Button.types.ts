// src/components/ui/Button/Button.types.ts
import { ButtonProps as MuiButtonProps } from '@mui/material';

export interface ButtonProps extends MuiButtonProps {
    customWidth?: string | number;
    customHeight?: string | number;
    customClassName?: string;
}