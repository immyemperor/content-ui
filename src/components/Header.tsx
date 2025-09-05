'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useSidebar } from '@/contexts/sidebar';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

export function Header() {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useSidebar();

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width: '100%',
      }}
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Content Management System
        </Typography>
        <Typography variant="body1" sx={{ mr: 2 }}>
          {user?.profile?.name || user?.profile?.email}
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
