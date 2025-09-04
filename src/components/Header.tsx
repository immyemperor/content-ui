'use client';

import { useAuth } from '@/contexts/auth';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Content Management System
        </Typography>
        <Typography variant="body1" sx={{ mr: 2 }}>
          {user?.name || user?.username}
        </Typography>
        <Button color="inherit" onClick={logout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
