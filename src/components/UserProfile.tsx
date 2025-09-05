'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { Button, Menu, MenuItem, Avatar, Typography, Box } from '@mui/material';
import { useState } from 'react';

export function UserProfile() {
  const { user, logout, isLoading } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  // Extract roles from the user profile (assuming they're in realm_access.roles or resource_access)
  const userRoles = (user.profile as any)?.realm_access?.roles || (user.profile as any)?.resource_access?.roles || [];
  const isAdmin = userRoles.includes('admin');

  return (
    <Box>
      <Button
        onClick={handleClick}
        startIcon={<Avatar sx={{ width: 32, height: 32 }}>{user.profile?.name?.[0] || user.profile?.preferred_username?.[0] || 'U'}</Avatar>}
        sx={{ textTransform: 'none', color: 'inherit' }}
      >
        <Box sx={{ textAlign: 'left', ml: 1 }}>
          <Typography variant="body2">{user.profile?.name || user.profile?.preferred_username || user.profile?.email}</Typography>
          <Typography variant="caption" color="text.secondary">
            {isAdmin ? 'Administrator' : 'User'}
          </Typography>
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleClose}>
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {user.profile?.name || user.profile?.preferred_username || user.profile?.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user.profile?.email}
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              Roles: {userRoles.join(', ')}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
