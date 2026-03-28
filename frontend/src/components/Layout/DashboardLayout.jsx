import React, { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, useTheme, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fb' }}>
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
      
      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - 280px)` } }}>
        <AppBar position="sticky" sx={{ bgcolor: 'white', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', color: '#1e293b' }}>
          <Toolbar>
            {isMobile && (
              <IconButton edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, color: '#1e293b' }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
              DGSN National Security Command Center
            </Typography>
            <IconButton onClick={() => window.location.reload()} sx={{ color: '#1e293b' }}>
              <RefreshIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
