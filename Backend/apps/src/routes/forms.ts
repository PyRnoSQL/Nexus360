import express from 'express';
import { googleSheetsService } from '../services/googleSheets.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireFormAccess } from '../middleware/rbac.js';

const router = express.Router();

// Get all form options from Google Sheets
router.get('/options/:module', authenticateToken, async (req, res) => {
  const { module } = req.params;
  
  try {
    let options = {};
    
    switch(module) {
      case 'finance':
        options = await googleSheetsService.getFinanceOptions();
        break;
      case 'hr':
        options = await googleSheetsService.getHROptions();
        break;
      case 'operations':
        options = await googleSheetsService.getIncidentsOptions();
        break;
      case 'logistique':
        options = await googleSheetsService.getFleetOptions();
        break;
      case 'formation':
        options = await googleSheetsService.getTrainingOptions();
        break;
      case 'lean':
        options = await googleSheetsService.getLeanOptions();
        break;
      default:
        options = {};
    }
    
    res.json({ success: true, options });
  } catch (error) {
    console.error('Error fetching options:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch options' });
  }
});

// Submit form
router.post('/submit', authenticateToken, requireFormAccess, async (req, res) => {
  try {
    const { formType, module, formData } = req.body;
    const user = req.user;
    
    // Here you would save to database
    // For now, just log and return success
    console.log(`Form submitted by ${user.username}:`, { formType, module, formData });
    
    res.json({
      success: true,
      message: 'Formulaire soumis avec succès',
      id: Date.now()
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ success: false, error: 'Failed to submit form' });
  }
});

// Get user's forms
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    // Return mock data for now
    res.json({
      success: true,
      forms: []
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch forms' });
  }
});

export default router;
