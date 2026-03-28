import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { TrendingUp, Warning, CheckCircle, Schedule, LocationOn } from '@mui/icons-material';
import api from '../../services/api';

const KPI_CARDS = [
  { key: 'total_incidents', label: 'Total Incidents', icon: Warning, color: '#ef4444', bgColor: '#fee2e2' },
  { key: 'resolution_rate', label: 'Resolution Rate', icon: CheckCircle, color: '#10b981', bgColor: '#d1fae5', suffix: '%' },
  { key: 'avg_resolution_time_hours', label: 'Avg Resolution', icon: Schedule, color: '#f59e0b', bgColor: '#fed7aa', suffix: ' hrs' },
  { key: 'high_severity', label: 'High Severity', icon: TrendingUp, color: '#dc2626', bgColor: '#fee2e2' }
];

export default function IncidentKPIs({ incidents }) {
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    api.get('/incidents/kpis')
      .then(res => setKpis(res.data.data))
      .catch(console.error);
  }, [incidents]);

  if (!kpis) return null;

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {KPI_CARDS.map((kpi) => {
        const value = kpis[kpi.key] || 0;
        const Icon = kpi.icon;
        return (
          <Grid item xs={12} sm={6} md={3} key={kpi.key}>
            <Card elevation={2} className="card-hover" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {kpi.label}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {value}{kpi.suffix || ''}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: kpi.bgColor, color: kpi.color, width: 48, height: 48 }}>
                    <Icon />
                  </Avatar>
                </Box>
                {kpi.key === 'resolution_rate' && (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={value} 
                      sx={{ height: 8, borderRadius: 4, bgcolor: '#e5e7eb', '& .MuiLinearProgress-bar': { bgcolor: kpi.color } }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
