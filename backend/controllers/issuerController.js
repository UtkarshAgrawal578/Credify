const Issuer = require('../models/Issuer');
const Student = require('../models/Student');
const Credential = require('../models/Credential');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new issuer
// @route   POST /api/issuers/register
// @access  Public
exports.registerIssuer = async (req, res) => {
  try {
    console.log('📝 Issuer registration request received:', req.body);
    
    const { name, email, password, institution, institutionType, address, phone, website } = req.body;

    // Check if issuer already exists
    const existingIssuer = await Issuer.findOne({ email });
    if (existingIssuer) {
      console.log('❌ Issuer already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'Issuer with this email already exists'
      });
    }

    // Create issuer
    console.log('✅ Creating new issuer...');
    const issuer = await Issuer.create({
      name,
      email,
      password,
      institution,
      institutionType,
      address,
      phone,
      website
    });

    // Generate token
    const token = generateToken(issuer._id, 'issuer');

    console.log('✅ Issuer registered successfully:', issuer.email);
    
    res.status(201).json({
      success: true,
      message: 'Issuer registered successfully',
      data: {
        id: issuer._id,
        name: issuer.name,
        email: issuer.email,
        institution: issuer.institution,
        institutionType: issuer.institutionType,
        token
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering issuer',
      error: error.message
    });
  }
};

// @desc    Login issuer
// @route   POST /api/issuers/login
// @access  Public
exports.loginIssuer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find issuer and include password
    const issuer = await Issuer.findOne({ email }).select('+password');

    if (!issuer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordCorrect = await issuer.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(issuer._id, 'issuer');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: issuer._id,
        name: issuer.name,
        email: issuer.email,
        institution: issuer.institution,
        institutionType: issuer.institutionType,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// @desc    Get issuer profile
// @route   GET /api/issuers/profile
// @access  Private (Issuer only)
exports.getIssuerProfile = async (req, res) => {
  try {
    const issuer = await Issuer.findById(req.issuer._id);

    res.status(200).json({
      success: true,
      data: issuer
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// @desc    Update issuer profile
// @route   PUT /api/issuers/profile
// @access  Private (Issuer only)
exports.updateIssuerProfile = async (req, res) => {
  try {
    const { name, institution, institutionType, address, phone, website } = req.body;

    const issuer = await Issuer.findByIdAndUpdate(
      req.issuer._id,
      { name, institution, institutionType, address, phone, website },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: issuer
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// @desc    Search students
// @route   GET /api/issuers/students/search?query=
// @access  Private (Issuer only)
exports.searchStudents = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Search by email, name, or studentId
    const students = await Student.find({
      $or: [
        { email: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
        { studentId: { $regex: query, $options: 'i' } }
      ]
    }).limit(10).select('name email studentId institution walletAddress');

    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Student search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching students',
      error: error.message
    });
  }
};

// @desc    Get issued credentials
// @route   GET /api/issuers/credentials
// @access  Private (Issuer only)
exports.getIssuedCredentials = async (req, res) => {
  try {
    const issuer = await Issuer.findById(req.issuer._id).populate({
      path: 'issuedCredentials',
      populate: { path: 'student', select: 'name email studentId' }
    });

    res.status(200).json({
      success: true,
      data: issuer.issuedCredentials || []
    });
  } catch (error) {
    console.error('Credentials fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching credentials',
      error: error.message
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/issuers/stats
// @access  Private (Issuer only)
exports.getDashboardStats = async (req, res) => {
  try {
    const issuer = await Issuer.findById(req.issuer._id).populate('issuedCredentials');
    
    const totalIssued = issuer.issuedCredentials.length;
    
    const thisMonth = issuer.issuedCredentials.filter(cred => {
      const date = new Date(cred.issuedDate);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    const verified = issuer.issuedCredentials.filter(cred => cred.status === 'Verified').length;
    
    const revoked = issuer.issuedCredentials.filter(cred => cred.isRevoked).length;

    res.status(200).json({
      success: true,
      data: {
        totalIssued,
        thisMonth,
        verified,
        revoked
      }
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
};
