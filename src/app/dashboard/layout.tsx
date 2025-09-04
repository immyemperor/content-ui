'use client';

import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { SidebarProvider, useSidebar } from '@/contexts/sidebar';
import { Box } from '@mui/material';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();
  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          mt: '64px', // Height of AppBar
          minWidth: 0, // Important: allows flex items to shrink below their minimum content size
          overflow: 'auto', // Ensures content can scroll when needed
          transition: (theme) =>
            theme.transitions.create(['margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          ml: { 
            xs: 0, 
            sm: isOpen ? `${drawerWidth}px` : 0 
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
