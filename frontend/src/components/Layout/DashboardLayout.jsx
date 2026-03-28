<<<<<<< HEAD
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
=======
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: '#1a237e' }}>
        <Toolbar><Typography variant="h6" sx={{ flexGrow: 1 }}>NEXUS360 - DGSN</Typography><Typography variant="body2" sx={{ mr: 2 }}>{user?.full_name || user?.username}</Typography><Button color="inherit" onClick={() => { logout(); navigate('/login'); }}>Logout</Button></Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 3, flex: 1 }}>{children}</Container>
>>>>>>> d7011e7 (Initial commit: NEXUS360 complete platform)
    </Box>
  );
}
