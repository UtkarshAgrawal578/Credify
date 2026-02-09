const express = require('express');
const router = express.Router();
const {
  issueCredential,
  getCredentialById,
  verifyCredential,
  revokeCredential,
  getAllCredentials
} = require('../controllers/credentialController');
const { protect, authorize } = require('../middleware/auth');
const { body } = require('express-validator');
const { checkValidation } = require('../middleware/validation');

// Validation for issuing credential
const validateCredentialIssuance = [
  body('studentId')
    .notEmpty()
    .withMessage('Student ID is required'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Credential title is required'),
  body('type')
    .isIn(['Degree', 'Certificate', 'Achievement', 'Certification', 'Badge'])
    .withMessage('Invalid credential type')
];

// Public routes
router.post('/verify', verifyCredential);
router.get('/', getAllCredentials);
router.get('/:id', getCredentialById);

// Protected routes (Issuer only)
router.post('/issue', protect, authorize('issuer'), validateCredentialIssuance, checkValidation, issueCredential);
router.put('/revoke/:id', protect, authorize('issuer'), revokeCredential);

module.exports = router;
