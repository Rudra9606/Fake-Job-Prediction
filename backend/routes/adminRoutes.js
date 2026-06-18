const express = require('express');
const {
  getSystemStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getAuditLogs,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply admin protection to all routes in this file
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getSystemStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/logs', getAuditLogs);

module.exports = router;
