const express = require('express');
const router = express.Router();
const {
  registerIssuer,
  loginIssuer,
  getIssuerProfile,
  updateIssuerProfile,
  searchStudents,
  getIssuedCredentials,
  getDashboardStats
} = require('../controllers/issuerController');
const { protect, authorize } = require('../middleware/auth');
const {
  validateIssuerRegistration,
  validateIssuerLogin,
  checkValidation
} = require('../middleware/validation');

// Public routes
router.post('/register', validateIssuerRegistration, checkValidation, registerIssuer);
router.post('/login', validateIssuerLogin, checkValidation, loginIssuer);

// Protected routes (Issuer only)
router.get('/profile', protect, authorize('issuer'), getIssuerProfile);
router.put('/profile', protect, authorize('issuer'), updateIssuerProfile);
router.get('/students/search', protect, authorize('issuer'), searchStudents);
router.get('/credentials', protect, authorize('issuer'), getIssuedCredentials);
router.get('/stats', protect, authorize('issuer'), getDashboardStats);

module.exports = router;
