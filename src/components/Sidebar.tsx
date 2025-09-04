'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Description as DescriptionIcon,
  Dashboard as DashboardIcon,
  LibraryBooks as TemplatesIcon,
} from '@mui/icons-material';

const menuItems = [
  { text: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
  { text: 'Content', href: '/dashboard/content', icon: DescriptionIcon },
  { text: 'Templates', href: '/dashboard/templates', icon: TemplatesIcon },
  { text: 'Assessments', href: '/dashboard/assessments', icon: AssessmentIcon },
];

const drawerWidth = 240;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <List sx={{ mt: 8 }}>
        {menuItems.map(({ text, href, icon: Icon }) => (
          <Link key={href} href={href} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItem>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText 
                primary={text} 
                sx={{
                  color: pathname === href ? 'primary.main' : 'inherit',
                  fontWeight: pathname === href ? 'bold' : 'normal',
                }}
              />
            </ListItem>
          </Link>
        ))}
      </List>
    </Drawer>
  );
}
