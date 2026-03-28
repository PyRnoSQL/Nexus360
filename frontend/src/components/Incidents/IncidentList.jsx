import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Box,
  Select,
  MenuItem,
  FormControl,
  Button,
  Dialog,
  TextField
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  CheckCircle as ResolveIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import api from '../../services/api';
import toast from 'react-hot-toast';

const statusColors = {
  'open': { bg: '#fef3c7', color: '#d97706', label: 'Ouvert' },
  'in-progress': { bg: '#dbeafe', color: '#2563eb', label: 'En Cours' },
  'escalated to parquet': { bg: '#fee2e2', color: '#dc2626', label: 'Escaladé' },
  'closed': { bg: '#d1fae5', color: '#059669', label: 'Clos' }
};

const severityConfig = {
  low: { bg: '#d1fae5', color: '#059669', label: 'Faible' },
  medium: { bg: '#fed7aa', color: '#d97706', label: 'Moyen' },
  high: { bg: '#fee2e2', color: '#dc2626', label: 'Élevé' },
  critical: { bg: '#ffebee', color: '#d32f2f', label: 'Critique' }
};

export default function IncidentList({ incidents, onRefresh }) {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [approvalName, setApprovalName] = useState('');

  const handleStatusUpdate = async () => {
    if (!selectedIncident) return;
    
    try {
      await api.patch(`/incidents/${selectedIncident.incident_id}/status`, {
        status: newStatus,
        approved_by: approvalName
      });
      toast.success('Statut mis à jour avec succès');
      setStatusDialogOpen(false);
      onRefresh();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const openStatusDialog = (incident) => {
    setSelectedIncident(incident);
    setNewStatus(incident.status);
    setStatusDialogOpen(true);
  };

  return (
    <>
      <Card elevation={2}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Liste des Incidents</Typography>
            <IconButton onClick={onRefresh} size="small">
              <RefreshIcon />
            </IconButton>
          </Box>
          
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Type</strong></TableCell>
                  <TableCell><strong>Région</strong></TableCell>
                  <TableCell><strong>Ville</strong></TableCell>
                  <TableCell><strong>Sévérité</strong></TableCell>
                  <TableCell><strong>Statut</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {incidents?.map((incident) => {
                  const status = statusColors[incident.status] || statusColors.open;
                  const severity = severityConfig[incident.severity] || severityConfig.medium;
                  
                  return (
                    <TableRow key={incident.incident_id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {incident.incident_id}
                        </Typography>
                      </TableCell>
                      <TableCell>{incident.incident_type}</TableCell>
                      <TableCell>{incident.region}</TableCell>
                      <TableCell>{incident.city}</TableCell>
                      <TableCell>
                        <Chip 
                          size="small" 
                          label={severity.label} 
                          sx={{ bgcolor: severity.bg, color: severity.color, fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          size="small" 
                          label={status.label} 
                          sx={{ bgcolor: status.bg, color: status.color, fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(incident.incident_date).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => openStatusDialog(incident)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          
          {(!incidents || incidents.length === 0) && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="textSecondary">Aucun incident trouvé</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Mettre à jour le statut
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Incident: {selectedIncident?.incident_id} - {selectedIncident?.incident_type}
          </Typography>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight="500" gutterBottom>Nouveau Statut</Typography>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="open">Ouvert</MenuItem>
              <MenuItem value="in-progress">En Cours</MenuItem>
              <MenuItem value="escalated to parquet">Escaladé au Parquet</MenuItem>
              <MenuItem value="closed">Clos</MenuItem>
            </Select>
          </FormControl>
          
          {(newStatus === 'closed' || newStatus === 'escalated to parquet') && (
            <TextField
              fullWidth
              label="Nom de l'approbateur"
              value={approvalName}
              onChange={(e) => setApprovalName(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button onClick={() => setStatusDialogOpen(false)}>Annuler</Button>
            <Button variant="contained" onClick={handleStatusUpdate} sx={{ bgcolor: '#1a237e' }}>
              Mettre à jour
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
