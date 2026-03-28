import React, { useState, useEffect } from 'react';
import { 
  Grid, Card, CardContent, Typography, Box, Button, 
  Dialog, TextField, Select, MenuItem, FormControl, InputLabel,
  Chip, IconButton, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Alert, CircularProgress, Tab, Tabs,
  useTheme, Avatar, Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Upload as UploadIcon,
  Send as SendIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Timeline as TimelineIcon,
  Map as MapIcon,
  BarChart as ChartIcon,
  Close as CloseIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import api from '../services/api';
import { REGIONS, INCIDENT_TYPES, SEVERITY_LEVELS } from '../utils/regions';
import IncidentMap from '../components/Incidents/IncidentMap';
import IncidentStats from '../components/Incidents/IncidentStats';
import IncidentKPIs from '../components/Incidents/IncidentKPIs';
import IncidentList from '../components/Incidents/IncidentList';

const statusColors = {
  'open': { bg: '#fef3c7', color: '#d97706', icon: <WarningIcon /> },
  'in-progress': { bg: '#dbeafe', color: '#2563eb', icon: <TimelineIcon /> },
  'escalated to parquet': { bg: '#fee2e2', color: '#dc2626', icon: <WarningIcon /> },
  'closed': { bg: '#d1fae5', color: '#059669', icon: <CheckCircleIcon /> }
};

export default function IncidentsPage() {
  const theme = useTheme();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    incident_type: '',
    region: '',
    city: '',
    description: '',
    incident_date: new Date().toISOString().slice(0, 16),
    severity: 'medium',
    assigned_precinct: '',
    assigned_email: ''
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [cities, setCities] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchIncidents();
  }, []);

  useEffect(() => {
    if (formData.region) {
      setCities(REGIONS[formData.region] || []);
      setFormData(prev => ({ ...prev, city: '' }));
    }
  }, [formData.region]);

  const fetchIncidents = async () => {
    try {
      const res = await api.get('/incidents');
      setIncidents(res.data.data);
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
      toast.error('Failed to load incidents');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File too large. Maximum size is 10MB');
        return;
      }
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024
  });

  const handleSubmit = async () => {
    if (!formData.incident_type || !formData.region || !formData.city || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) submitData.append(key, value);
    });
    if (photo) submitData.append('photo', photo);

    try {
      const res = await api.post('/incidents', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(res.data.message || 'Incident reported successfully');
      setOpenForm(false);
      resetForm();
      fetchIncidents();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to report incident');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      incident_type: '',
      region: '',
      city: '',
      description: '',
      incident_date: new Date().toISOString().slice(0, 16),
      severity: 'medium',
      assigned_precinct: '',
      assigned_email: ''
    });
    setPhoto(null);
    setPhotoPreview(null);
  };

  const getStatusChip = (status) => {
    const config = statusColors[status] || statusColors.open;
    return (
      <Chip
        size="small"
        icon={config.icon}
        label={status}
        sx={{ bgcolor: config.bg, color: config.color, fontWeight: 500 }}
      />
    );
  };

  const getSeverityChip = (severity) => {
    const config = SEVERITY_LEVELS.find(s => s.value === severity);
    return (
      <Chip
        size="small"
        label={config?.label || severity}
        sx={{ bgcolor: `${config?.color}20`, color: config?.color, fontWeight: 500 }}
      />
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon sx={{ fontSize: 32, color: '#dc2626' }} />
            Incident Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Real-time incident reporting, tracking, and analytics
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
          sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1745' } }}
        >
          Report Incident
        </Button>
      </Box>

      {/* KPI Cards */}
      <IncidentKPIs incidents={incidents} />

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab icon={<ChartIcon />} label="Statistics" />
          <Tab icon={<MapIcon />} label="Map View" />
          <Tab icon={<TimelineIcon />} label="Recent Incidents" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {tabValue === 0 && <IncidentStats incidents={incidents} />}
      {tabValue === 1 && <IncidentMap incidents={incidents} />}
      {tabValue === 2 && <IncidentList incidents={incidents} onRefresh={fetchIncidents} />}

      {/* Report Incident Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" fontWeight="bold">Report New Incident</Typography>
            <IconButton onClick={() => setOpenForm(false)}><CloseIcon /></IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Incident Type *</InputLabel>
                <Select
                  value={formData.incident_type}
                  onChange={(e) => handleFormChange('incident_type', e.target.value)}
                  label="Incident Type *"
                >
                  {INCIDENT_TYPES.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Severity *</InputLabel>
                <Select
                  value={formData.severity}
                  onChange={(e) => handleFormChange('severity', e.target.value)}
                  label="Severity *"
                >
                  {SEVERITY_LEVELS.map(level => (
                    <MenuItem key={level.value} value={level.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: level.color }} />
                        {level.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Region *</InputLabel>
                <Select
                  value={formData.region}
                  onChange={(e) => handleFormChange('region', e.target.value)}
                  label="Region *"
                >
                  {Object.keys(REGIONS).map(region => (
                    <MenuItem key={region} value={region}>{region}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>City *</InputLabel>
                <Select
                  value={formData.city}
                  onChange={(e) => handleFormChange('city', e.target.value)}
                  label="City *"
                  disabled={!formData.region}
                >
                  {cities.map(city => (
                    <MenuItem key={city} value={city}>{city}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Incident Description *"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Date & Time"
                value={formData.incident_date}
                onChange={(e) => handleFormChange('incident_date', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            {(formData.severity === 'high' || formData.severity === 'critical') && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Assigned Precinct *"
                    value={formData.assigned_precinct}
                    onChange={(e) => handleFormChange('assigned_precinct', e.target.value)}
                    placeholder="e.g., Commissariat Central Douala"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Notification Email *"
                    value={formData.assigned_email}
                    onChange={(e) => handleFormChange('assigned_email', e.target.value)}
                    placeholder="precinct@dgsn.cm"
                  />
                </Grid>
              </>
            )}
            
            <Grid item xs={12}>
              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed',
                  borderColor: isDragActive ? '#1a237e' : '#cbd5e1',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: isDragActive ? '#eef2ff' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                <input {...getInputProps()} />
                <UploadIcon sx={{ fontSize: 40, color: '#94a3b8', mb: 1 }} />
                <Typography variant="body2" color="textSecondary">
                  {isDragActive ? 'Drop the image here' : 'Drag & drop photo evidence, or click to select'}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Supports JPG, PNG, WEBP (Max 10MB)
                </Typography>
              </Box>
              {photoPreview && (
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <img src={photoPreview} alt="Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                  <Typography variant="body2">{photo.name}</Typography>
                </Box>
              )}
            </Grid>
          </Grid>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button onClick={() => setOpenForm(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
              sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1745' } }}
            >
              Submit Report
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
