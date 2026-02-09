const Student = require('../models/Student');
const Credential = require('../models/Credential');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// ===============================
// REGISTER STUDENT
// ===============================
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, institution, studentId, dateOfBirth, phone } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email already exists'
      });
    }

    const student = await Student.create({
      name,
      email,
      password,
      institution,
      studentId,
      dateOfBirth,
      phone
    });

    // Generate wallet address
    student.generateWalletAddress();
    await student.save();

    const token = generateToken(student._id, 'student');

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        walletAddress: student.walletAddress,
        institution: student.institution,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering student',
      error: error.message
    });
  }
};

// ===============================
// LOGIN STUDENT
// ===============================
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email }).select('+password');
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordCorrect = await student.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(student._id, 'student');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: student._id,
        name: student.name,
        email: student.email,
        walletAddress: student.walletAddress,
        institution: student.institution,
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

// ===============================
// GET STUDENT PROFILE
// ===============================
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id);

    res.status(200).json({
      success: true,
      data: student
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

// ===============================
// UPDATE STUDENT PROFILE
// ===============================
exports.updateStudentProfile = async (req, res) => {
  try {
    const { name, institution, studentId, dateOfBirth, phone } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.student.id,
      { name, institution, studentId, dateOfBirth, phone },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: student
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

// ===============================
// GET STUDENT CREDENTIALS ✅ FIXED
// ===============================
exports.getStudentCredentials = async (req, res) => {
  try {
    const credentials = await Credential.find({ student: req.student.id })
      .populate("issuer", "name institution")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: credentials.length,
      data: credentials
    });

  } catch (error) {
    console.error("Get credentials error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching credentials",
      error: error.message
    });
  }
};
