const express = require('express');
const {
  analyzeJob,
  getJobAnalyses,
  getJobAnalysisById,
  deleteJobAnalysis,
} = require('../controllers/analysisController');
const { protect, optionalProtect } = require('../middleware/auth');
const JobAnalysis = require('../models/JobAnalysis');
const { generatePDFReport } = require('../utils/pdfGenerator');

const router = express.Router();

router.post('/', optionalProtect, analyzeJob);
router.get('/history', protect, getJobAnalyses);
router.get('/:id', getJobAnalysisById);
router.delete('/:id', protect, deleteJobAnalysis);

// Route to download PDF Report
router.get('/:id/pdf', async (req, res) => {
  try {
    const analysis = await JobAnalysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }
    generatePDFReport(analysis, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
