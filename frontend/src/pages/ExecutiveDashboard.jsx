import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, Alert, Button } from '@mui/material';

export default function ExecutiveDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState(null);

  useEffect(() => {
    Promise.all([api.get('/executive/dashboard'), api.get('/executive/alerts')])
      .then(([dashboardRes, alertsRes]) => { setData(dashboardRes.data.data); setAlerts(alertsRes.data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box display="flex" justifyContent="center" minHeight="60vh"><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Welcome, {user?.full_name?.split(' ')[0] || 'Commander'}</Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>NEXUS360 Executive Command Center</Typography>

      <Grid container spacing={3} sx={{ mt: 1, mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}><CardContent><Typography color="textSecondary" gutterBottom>Total Annual Savings</Typography><Typography variant="h4" color="success.main">{(data?.summary?.total_savings_annual / 1e6).toFixed(0)}M FCFA</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}><CardContent><Typography color="textSecondary" gutterBottom>ROI</Typography><Typography variant="h4" color="primary.main">{data?.summary?.roi_percentage}%</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}><CardContent><Typography color="textSecondary" gutterBottom>Payback Period</Typography><Typography variant="h4">{data?.summary?.payback_years} years</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}><CardContent><Typography color="textSecondary" gutterBottom>Critical Alerts</Typography><Typography variant="h4" color="error.main">{alerts?.critical_alerts || 0}</Typography></CardContent></Card>
        </Grid>
      </Grid>

      {alerts?.critical_alerts > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>🚨 Critical Alerts</Typography>
          <Grid container spacing={2}>
            {alerts?.hotzone_alerts?.map((h, i) => (
              <Grid item xs={12} md={6} key={i}>
                <Card sx={{ bgcolor: '#ffebee', borderLeft: 4, borderColor: 'error.main' }}><CardContent><Typography variant="subtitle1" color="error">🔴 CRITICAL: {h.district}</Typography><Typography variant="body2">Risk Score: {h.risk_score} | Incidents: {h.incident_count_90d}</Typography><Button variant="contained" color="error" size="small" sx={{ mt: 1 }}>Deploy {h.recommended_patrol_units} Units</Button></CardContent></Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>📊 Looker Studio Dashboard</Typography>
        <Card elevation={2}><CardContent sx={{ p: 0 }}>
          <iframe width="100%" height="600" src="https://lookerstudio.google.com/embed/reporting/your-report-id" title="NEXUS360 Analytics" frameBorder="0" style={{ border: 'none' }} />
        </CardContent></Card>
      </Box>
    </Box>
  );
}
