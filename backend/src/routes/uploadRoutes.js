const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { authenticate } = require('../middleware/auth');

// Upload route for incident photos
router.post('/photo', authenticate, upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  res.json({
    success: true,
    data: {
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      size: req.file.size
    }
  });
});

module.exports = router;
