import React, { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';

import AppHeader from '../Header'

export type ComponentProps = {
    children?: ReactNode;
};

const MainLayout: React.FC<ComponentProps> = ({ children }) => {
    return (
        <Stack>
            <AppHeader />
            <Box>{children}</Box>
        </Stack>
    );
};

export default MainLayout