import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Button,
  Dialog,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  People,
  TrendingUp,
  CheckCircle,
  Warning,
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function HRPage() {
  const { user, hasModuleAccess } = useAuth();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    matricule: '',
    full_name: '',
    rank: '',
    unit: '',
    base_salary: '',
    region: '',
    gender: 'M'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [kpisRes, employeesRes] = await Promise.all([
        api.get('/hr/kpis'),
        api.get('/hr')
      ]);
      setKpis(kpisRes.data.data);
      setEmployees(employeesRes.data.data);
    } catch (error) {
      console.error('Failed to fetch HR data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await api.post('/hr', formData);
      setOpenForm(false);
      fetchData();
    } catch (error) {
      console.error('Failed to create employee:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const totalSavings = kpis?.reduce((sum, k) => sum + (k.annual_savings || 0), 0) || 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <People sx={{ fontSize: 40, color: '#10b981' }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">Ressources Humaines</Typography>
            <Typography variant="body2" color="textSecondary">
              Gestion du personnel et intégrité salariale
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData}>
            Rafraîchir
          </Button>
          {hasModuleAccess('hr') && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenForm(true)}
              sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#0d9668' } }}
            >
              Ajouter Agent
            </Button>
          )}
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} className="card-hover">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Total Personnel</Typography>
                  <Typography variant="h4" fontWeight="bold">{kpis?.reduce((s, k) => s + k.total_personnel, 0) || 0}</Typography>
                </Box>
                <People sx={{ fontSize: 40, color: '#10b981' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} className="card-hover">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Intégrité Salariale</Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {kpis?.reduce((s, k) => s + k.payroll_integrity, 0) / kpis?.length || 0}%
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: '#10b981' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} className="card-hover">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Économies Annuelles</Typography>
                  <Typography variant="h4" fontWeight="bold">{(totalSavings / 1e6).toFixed(0)}M FCFA</Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: '#f59e0b' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} className="card-hover">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Agents Formés</Typography>
                  <Typography variant="h4" fontWeight="bold">{kpis?.reduce((s, k) => s + k.training_hours, 0) || 0}h</Typography>
                </Box>
                <Warning sx={{ fontSize: 40, color: '#ef4444' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Regional Performance Table */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Performance par Région
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><strong>Région</strong></TableCell>
                  <TableCell align="center"><strong>Personnel</strong></TableCell>
                  <TableCell align="center"><strong>Intégrité Salariale</strong></TableCell>
                  <TableCell align="center"><strong>Risque Fantôme</strong></TableCell>
                  <TableCell align="center"><strong>Heures Formation</strong></TableCell>
                  <TableCell align="center"><strong>Score Performance</strong></TableCell>
                  <TableCell align="center"><strong>Économies</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {kpis?.map((kpi, idx) => (
                  <TableRow key={idx}>
                    <TableCell><strong>{kpi.region}</strong></TableCell>
                    <TableCell align="center">{kpi.total_personnel}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        size="small" 
                        label={`${kpi.payroll_integrity}%`}
                        sx={{ 
                          bgcolor: kpi.payroll_integrity >= 98 ? '#d1fae5' : '#fed7aa',
                          color: kpi.payroll_integrity >= 98 ? '#059669' : '#d97706'
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {kpi.ghost_risk > 0 ? (
                        <Chip size="small" label={`${kpi.ghost_risk} agent(s)`} color="error" />
                      ) : (
                        <Chip size="small" label="Aucun" sx={{ bgcolor: '#d1fae5', color: '#059669' }} />
                      )}
                    </TableCell>
                    <TableCell align="center">{kpi.training_hours}h</TableCell>
                    <TableCell align="center">{kpi.performance_score}%</TableCell>
                    <TableCell align="center">
                      {kpi.annual_savings > 0 ? `${(kpi.annual_savings / 1e6).toFixed(0)}M` : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Employee Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>Ajouter un Agent</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Matricule"
                value={formData.matricule}
                onChange={(e) => handleFormChange('matricule', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom Complet"
                value={formData.full_name}
                onChange={(e) => handleFormChange('full_name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Grade"
                value={formData.rank}
                onChange={(e) => handleFormChange('rank', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Unité"
                value={formData.unit}
                onChange={(e) => handleFormChange('unit', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Salaire de Base"
                type="number"
                value={formData.base_salary}
                onChange={(e) => handleFormChange('base_salary', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Région</InputLabel>
                <Select
                  value={formData.region}
                  onChange={(e) => handleFormChange('region', e.target.value)}
                  label="Région"
                >
                  {['Littoral', 'Centre', 'Ouest', 'Nord', 'Sud', 'Est', 'Adamaoua', 'Extrême-Nord', 'Nord-Ouest', 'Sud-Ouest'].map(r => (
                    <MenuItem key={r} value={r}>{r}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Genre</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => handleFormChange('gender', e.target.value)}
                  label="Genre"
                >
                  <MenuItem value="M">Masculin</MenuItem>
                  <MenuItem value="F">Féminin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button onClick={() => setOpenForm(false)}>Annuler</Button>
            <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: '#10b981' }}>
              Ajouter
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
