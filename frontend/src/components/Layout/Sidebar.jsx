import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Box, Typography, Divider, IconButton, Menu, MenuItem, Avatar,
  useTheme, useMediaQuery, Tooltip, Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalance as FinanceIcon,
  People as HRIcon,
  School as TrainingIcon,
  LocalShipping as LogisticsIcon,
  Security as OperationsIcon,
  Warning as IncidentsIcon,
  Timeline as PredictiveIcon,
  Logout as LogoutIcon,
  Translate as TranslateIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 280;

const MENU_ITEMS = [
  { path: '/', label: 'Tableau de Bord', icon: DashboardIcon, module: 'dashboard' },
  { path: '/operations', label: 'Opérations et Sécurité', icon: OperationsIcon, module: 'operations' },
  { path: '/logistics', label: 'Logistique et Actifs', icon: LogisticsIcon, module: 'logistics' },
  { path: '/incidents', label: 'Signalement Incidents', icon: IncidentsIcon, module: 'incidents' },
  { path: '/hr', label: 'Ressources Humaines', icon: HRIcon, module: 'hr' },
  { path: '/training', label: 'Formation Policière', icon: TrainingIcon, module: 'training' },
  { path: '/finance', label: 'Finance et Budget', icon: FinanceIcon, module: 'finance' },
  { path: '/predictive', label: 'Intelligence Prédictive', icon: PredictiveIcon, module: 'operations' }
];

export default function Sidebar({ mobileOpen, onDrawerToggle }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, hasModuleAccess } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [languageAnchor, setLanguageAnchor] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredMenuItems = MENU_ITEMS.filter(item => hasModuleAccess(item.module));

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0a0a0a' }}>
      {/* Logo Area */}
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid #2d2d2d' }}>
        <Typography variant="h6" sx={{ color: '#20b2aa', fontWeight: 'bold', letterSpacing: 1 }}>
          NEXUS360
        </Typography>
        <Typography variant="caption" sx={{ color: '#6b7280' }}>
          DGSN Command Center
        </Typography>
      </Box>
      
      {/* User Info */}
      <Box sx={{ p: 2, borderBottom: '1px solid #2d2d2d' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#20b2aa', width: 48, height: 48 }}>
            {user?.full_name?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
              {user?.full_name || user?.username}
            </Typography>
            <Chip 
              label={user?.role?.replace('_', ' ').toUpperCase()} 
              size="small" 
              sx={{ bgcolor: '#1a237e', color: 'white', fontSize: 10, mt: 0.5 }}
            />
          </Box>
        </Box>
      </Box>
      
      {/* Navigation Menu */}
      <List sx={{ flex: 1, pt: 2 }}>
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  bgcolor: isActive ? '#1a237e' : 'transparent',
                  '&:hover': { bgcolor: isActive ? '#1a237e' : '#2d2d2d' }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#20b2aa' : '#9ca3af', minWidth: 40 }}>
                  <Icon />
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  sx={{ 
                    '& .MuiTypography-root': { 
                      color: isActive ? 'white' : '#d1d5db', 
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 500 : 400
                    } 
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      {/* Footer Buttons */}
      <Divider sx={{ bgcolor: '#2d2d2d' }} />
      <Box sx={{ p: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={(e) => setLanguageAnchor(e.currentTarget)}
            sx={{ borderRadius: 2, mb: 1 }}
          >
            <ListItemIcon sx={{ color: '#9ca3af', minWidth: 40 }}>
              <TranslateIcon />
            </ListItemIcon>
            <ListItemText primary="Language / Langue" sx={{ '& .MuiTypography-root': { color: '#d1d5db' } }} />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ color: '#ef4444', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ '& .MuiTypography-root': { color: '#ef4444' } }} />
          </ListItemButton>
        </ListItem>
      </Box>
      
      {/* Language Menu */}
      <Menu
        anchorEl={languageAnchor}
        open={Boolean(languageAnchor)}
        onClose={() => setLanguageAnchor(null)}
      >
        <MenuItem onClick={() => { setLanguageAnchor(null); }}>🇫🇷 Français</MenuItem>
        <MenuItem onClick={() => { setLanguageAnchor(null); }}>🇬🇧 English</MenuItem>
      </Menu>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: '#0a0a0a' }
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: '#0a0a0a', borderRight: 'none' }
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
