import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, Divider } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../../services/api';

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec489a'];

export default function IncidentStats({ incidents }) {
  const [regionStats, setRegionStats] = useState([]);
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/incidents/stats/region'),
      api.get('/incidents/trends')
    ]).then(([statsRes, trendsRes]) => {
      setRegionStats(statsRes.data.data);
      setTrends(trendsRes.data.data);
    }).catch(console.error);
  }, [incidents]);

  const pieData = regionStats.slice(0, 5).map(stat => ({
    name: stat.region,
    value: stat.total_incidents
  }));

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card elevation={2} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Incidents by Region
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionStats} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="region" width={100} />
                <Tooltip />
                <Bar dataKey="total_incidents" fill="#1a237e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card elevation={2} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Distribution (Top 5 Regions)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Card elevation={2} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              30-Day Incident Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" name="Total Incidents" />
                <Bar dataKey="high" fill="#ef4444" name="High Severity" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Card elevation={2} sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Regional Performance
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '12px' }}>Region</th>
                    <th style={{ textAlign: 'center', padding: '12px' }}>Incidents</th>
                    <th style={{ textAlign: 'center', padding: '12px' }}>High Severity</th>
                    <th style={{ textAlign: 'center', padding: '12px' }}>Resolution Rate</th>
                    <th style={{ textAlign: 'center', padding: '12px' }}>Severity Index</th>
                  </tr>
                </thead>
                <tbody>
                  {regionStats.map((stat, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px', fontWeight: 500 }}>{stat.region}</td>
                      <td style={{ textAlign: 'center', padding: '12px' }}>{stat.total_incidents}</td>
                      <td style={{ textAlign: 'center', padding: '12px' }}>
                        <Chip size="small" label={stat.high_severity} sx={{ bgcolor: '#fee2e2', color: '#dc2626' }} />
                      </td>
                      <td style={{ textAlign: 'center', padding: '12px' }}>
                        <Chip size="small" label={`${stat.resolution_rate}%`} sx={{ bgcolor: '#d1fae5', color: '#059669' }} />
                      </td>
                      <td style={{ textAlign: 'center', padding: '12px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <LinearProgress variant="determinate" value={stat.severity_index} sx={{ width: 80, height: 6, borderRadius: 3 }} />
                          <Typography variant="caption">{stat.severity_index}%</Typography>
                        </Box>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
