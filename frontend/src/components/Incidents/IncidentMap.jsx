import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Chip, CircularProgress } from '@mui/material';
import { LocationOn, Warning } from '@mui/icons-material';
import api from '../../services/api';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  background: '#f0f2f5',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative'
};

const getHotzoneColor = (level) => {
  if (level === 'CRITICAL HOTZONE') return '#d32f2f';
  if (level === 'HIGH RISK ZONE') return '#f44336';
  if (level === 'MODERATE RISK') return '#ff9800';
  return '#4caf50';
};

export default function IncidentMap({ incidents }) {
  const [hotzones, setHotzones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/operations/hotzones')
      .then(res => setHotzones(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [incidents]);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" height={500}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Carte des Hotzones
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Zones à risque prédites par l'intelligence artificielle
        </Typography>
        
        <div style={mapContainerStyle}>
          {/* Mock Map Visualization */}
          <Box sx={{ position: 'relative', width: '100%', height: '100%', p: 2 }}>
            <Box sx={{ 
              position: 'absolute', 
              top: 20, 
              right: 20, 
              bgcolor: 'white', 
              borderRadius: 2, 
              p: 1.5, 
              boxShadow: 2,
              zIndex: 10,
              minWidth: 150
            }}>
              <Typography variant="caption" fontWeight="bold" gutterBottom>Légende</Typography>
              {hotzones.map((zone, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: getHotzoneColor(zone.hotzone_level) }} />
                  <Typography variant="caption">{zone.hotzone_level}</Typography>
                </Box>
              ))}
            </Box>
            
            {/* Cameroon Map Placeholder */}
            <svg width="100%" height="100%" viewBox="0 0 800 600" style={{ background: '#e6f0fa', borderRadius: 8 }}>
              {/* Cameroon outline - simplified shape */}
              <path
                d="M200,100 L300,80 L400,100 L450,150 L480,220 L460,300 L420,380 L360,420 L280,440 L200,420 L140,360 L120,280 L140,200 L180,140 L200,100 Z"
                fill="#c8e6f5"
                stroke="#1a237e"
                strokeWidth="2"
              />
              
              {/* Hotzone markers */}
              {hotzones.slice(0, 8).map((zone, idx) => {
                // Convert coordinates to viewBox positions (simplified mapping)
                const x = 300 + (zone.longitude - 9.7) * 50;
                const y = 250 + (4.0 - zone.latitude) * 40;
                
                return (
                  <g key={idx} transform={`translate(${x}, ${y})`}>
                    <circle
                      r={zone.risk_score * 3}
                      fill={getHotzoneColor(zone.hotzone_level)}
                      opacity="0.6"
                    />
                    <circle
                      r="6"
                      fill={getHotzoneColor(zone.hotzone_level)}
                      stroke="white"
                      strokeWidth="2"
                    />
                    <title>{`${zone.district}: ${zone.hotzone_level} - ${zone.predicted_incidents_next_7days} incidents prévus`}</title>
                  </g>
                );
              })}
            </svg>
          </Box>
        </div>
        
        {/* Hotzone List */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Zones à Surveiller
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {hotzones.map((zone, idx) => (
              <Chip
                key={idx}
                icon={<LocationOn />}
                label={`${zone.district} - ${zone.incident_count_90d} incidents`}
                sx={{
                  bgcolor: `${getHotzoneColor(zone.hotzone_level)}20`,
                  color: getHotzoneColor(zone.hotzone_level),
                  borderLeft: `3px solid ${getHotzoneColor(zone.hotzone_level)}`
                }}
              />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
