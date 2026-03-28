import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Alert, Paper, IconButton, InputAdornment } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import logo from '../assets/images/logo.jpg';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Invalid User ID or Password');
    }
    setLoading(false);
  };

  return (
    <Box className="login-container" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper elevation={24} sx={{ maxWidth: 450, width: '100%', p: 4, borderRadius: 3, bgcolor: '#ffffff' }}>
        {/* Dark Blue Banner */}
        <Box sx={{ bgcolor: '#0a2351', color: 'white', textAlign: 'center', py: 2, borderRadius: 2, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            DGSN NATIONAL SECURITY COMMAND CENTER
          </Typography>
        </Box>
        
        {/* Logo */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <img src={logo} alt="DGSN Logo" style={{ maxWidth: '120px', height: 'auto' }} />
        </Box>
        
        {/* Login Form */}
        <Typography variant="h5" align="center" gutterBottom fontWeight="600" color="#0a2351">
          NEXUS360
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
          National Security Command Center
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="User ID"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: '#20b2aa' }} />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: '#20b2aa' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              bgcolor: '#20b2aa',
              '&:hover': { bgcolor: '#1a8f89' },
              borderRadius: 2,
              fontWeight: 600
            }}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </Button>
        </form>
        
        {/* Powered by footer */}
        <Typography variant="caption" align="center" display="block" sx={{ mt: 3, color: '#dc2626', fontStyle: 'italic' }}>
          Powered by Analytix Engineering
        </Typography>
      </Paper>
    </Box>
  );
}
