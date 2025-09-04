import { forwardRef } from 'react';
import MuiGrid, { GridProps } from '@mui/material/Grid';

export const Grid = forwardRef<HTMLDivElement, GridProps>((props, ref) => {
  return <MuiGrid ref={ref} {...props} />;
});
