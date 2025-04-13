const express = require('express');
const path = require('path');
const auth = require('../middleware/auth');

const router = express.Router();

// Serve static assets with authentication
router.get('/:filename', auth, (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, '../../public/assets', filename));
});

module.exports = router;