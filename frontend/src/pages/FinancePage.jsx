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
  InputLabel,
  LinearProgress
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  Warning,
  CheckCircle,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import api from '../services/api';

export default function FinancePage() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    region: '',
    unit: '',
    budget_line: '',
    allocated_amount: '',
    committed_amount: '',
    disbursed_amount: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [kpisRes, transactionsRes] = await Promise.all([
        api.get('/finance/kpis'),
        api.get('/finance')
      ]);
      setKpis(kpisRes.data.data);
      setTransactions(transactionsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post('/finance', formData);
      if (res.data.fraud_detected) {
        alert('⚠️ ALERTE FRAUDE DÉTECTÉE! Le montant dépasse l\'allocation.');
      }
      setOpenForm(false);
      fetchData();
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const summary = kpis?.[0] || {};

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AccountBalance sx={{ fontSize: 40, color: '#1a237e' }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">Finance et Budget</Typography>
            <Typography variant="body2" color="textSecondary">
              Suivi budgétaire et détection de fraude en temps réel
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData}>
            Rafraîchir
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenForm(true)}
            sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1745' } }}
          >
            Nouvelle Transaction
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} className="card-hover">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Budget Alloué</Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {(summary.total_allocated / 1e6).toFixed(0)}M FCFA
                  </Typography>
                </Box>
                <ReceiptIcon sx={{ fontSize: 40, color: '#1a237e' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} className="card-hover">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Taux d'Exécution</Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {summary.execution_rate}%
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: '#10b981' }} />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={summary.execution_rate} 
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} className="card-hover">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Alertes Fraude</Typography>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {summary.fraud_flags || 0}
                  </Typography>
                </Box>
                <Warning sx={{ fontSize: 40, color: '#f59e0b' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} className="card-hover">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>Économies Estimées</Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {(summary.estimated_savings_from_fraud_prevention / 1e6).toFixed(0)}M FCFA
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, color: '#10b981' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Transactions Table */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Transactions Récentes
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Région</strong></TableCell>
                  <TableCell><strong>Unité</strong></TableCell>
                  <TableCell><strong>Ligne Budgétaire</strong></TableCell>
                  <TableCell align="right"><strong>Alloué (FCFA)</strong></TableCell>
                  <TableCell align="right"><strong>Dépensé (FCFA)</strong></TableCell>
                  <TableCell align="center"><strong>Statut</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.slice(0, 10).map((tx, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{tx.transaction_date}</TableCell>
                    <TableCell>{tx.region}</TableCell>
                    <TableCell>{tx.unit}</TableCell>
                    <TableCell>{tx.budget_line}</TableCell>
                    <TableCell align="right">{(parseFloat(tx.allocated_amount) || 0).toLocaleString()}</TableCell>
                    <TableCell align="right">{(parseFloat(tx.disbursed_amount) || 0).toLocaleString()}</TableCell>
                    <TableCell align="center">
                      {tx.is_fraud_flagged === 'true' || tx.is_fraud_flagged === true ? (
                        <Chip size="small" label="FRAUDE" color="error" />
                      ) : (
                        <Chip size="small" label="Normal" sx={{ bgcolor: '#d1fae5', color: '#059669' }} />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Transaction Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>Nouvelle Transaction</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
              <TextField
                fullWidth
                label="Unité"
                value={formData.unit}
                onChange={(e) => handleFormChange('unit', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ligne Budgétaire"
                value={formData.budget_line}
                onChange={(e) => handleFormChange('budget_line', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Montant Alloué (FCFA)"
                type="number"
                value={formData.allocated_amount}
                onChange={(e) => handleFormChange('allocated_amount', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Montant Engagé (FCFA)"
                type="number"
                value={formData.committed_amount}
                onChange={(e) => handleFormChange('committed_amount', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Montant Dépensé (FCFA)"
                type="number"
                value={formData.disbursed_amount}
                onChange={(e) => handleFormChange('disbursed_amount', e.target.value)}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button onClick={() => setOpenForm(false)}>Annuler</Button>
            <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: '#1a237e' }}>
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
