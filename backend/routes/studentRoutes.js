const express = require('express');
const router = express.Router();
const {
  registerStudent,
  loginStudent,
  getStudentProfile,
  updateStudentProfile,
  getStudentCredentials
} = require('../controllers/StudentController');
const { protect, authorize } = require('../middleware/auth');
const {
  validateStudentRegistration,
  validateStudentLogin,
  checkValidation
} = require('../middleware/validation');

// Public routes
router.post('/register', validateStudentRegistration, checkValidation, registerStudent);
router.post('/login', validateStudentLogin, checkValidation, loginStudent);

// Protected routes (Student only)
router.get('/profile', protect, authorize('student'), getStudentProfile);
router.put('/profile', protect, authorize('student'), updateStudentProfile);
router.get('/credentials', protect, authorize('student'), getStudentCredentials);

module.exports = router;