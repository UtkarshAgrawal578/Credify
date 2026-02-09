const Credential = require('../models/Credential');
const Student = require('../models/Student');
const Issuer = require('../models/Issuer');
const { generateCredentialHash, generateTransactionId } = require('../utils/blockchain');

// @desc    Issue a new credential
// @route   POST /api/credentials/issue
// @access  Private (Issuer only)
exports.issueCredential = async (req, res) => {
  try {
    console.log('📝 Credential issuance request:', req.body);
    
    const {
      studentId,
      title,
      type,
      description,
      metadata,
      expiresOn
    } = req.body;

    // Find student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Generate credential hash
    const credentialData = {
      studentId: student._id,
      title,
      issuer: req.issuer._id,
      issuedDate: new Date(),
      metadata
    };
    const credentialHash = generateCredentialHash(credentialData);
    const transactionId = generateTransactionId();

    // Create credential
    const credential = await Credential.create({
      student: studentId,
      issuer: req.issuer._id,
      title,
      type,
      description,
      credentialHash,
      transactionId,
      metadata,
      expiresOn: expiresOn ? new Date(expiresOn) : null,
      status: 'Verified'
    });

    // Add credential to student's credentials array
    student.credentials.push(credential._id);
    await student.save();

    // Add credential to issuer's issuedCredentials array
    const issuer = await Issuer.findById(req.issuer._id);
    issuer.issuedCredentials.push(credential._id);
    await issuer.save();

    console.log('✅ Credential issued successfully:', credential._id);

    // Populate student and issuer info for response
    await credential.populate('student', 'name email studentId');
    await credential.populate('issuer', 'name institution');

    res.status(201).json({
      success: true,
      message: 'Credential issued successfully',
      data: credential
    });
  } catch (error) {
    console.error('❌ Credential issuance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error issuing credential',
      error: error.message
    });
  }
};

// @desc    Get credential by ID
// @route   GET /api/credentials/:id
// @access  Public
exports.getCredentialById = async (req, res) => {
  try {
    const credential = await Credential.findById(req.params.id)
      .populate('student', 'name email studentId institution')
      .populate('issuer', 'name institution institutionType');

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }

    // Check if expired
    if (credential.isExpired()) {
      credential.status = 'Expired';
      await credential.save();
    } else if (credential.isExpiringSoon()) {
      credential.status = 'Expiring Soon';
      await credential.save();
    }

    res.status(200).json({
      success: true,
      data: credential
    });
  } catch (error) {
    console.error('Credential fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching credential',
      error: error.message
    });
  }
};

// @desc    Verify credential by hash
// @route   POST /api/credentials/verify
// @access  Public
exports.verifyCredential = async (req, res) => {
  try {
    const { hash } = req.body;

    if (!hash) {
      return res.status(400).json({
        success: false,
        message: 'Credential hash is required'
      });
    }

    const credential = await Credential.findOne({ credentialHash: hash })
      .populate('student', 'name email studentId institution')
      .populate('issuer', 'name institution institutionType');

    if (!credential) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: 'Credential not found'
      });
    }

    // Check if revoked
    if (credential.isRevoked) {
      return res.status(200).json({
        success: true,
        verified: false,
        message: 'Credential has been revoked',
        reason: credential.revokedReason,
        data: credential
      });
    }

    // Check if expired
    if (credential.isExpired()) {
      return res.status(200).json({
        success: true,
        verified: false,
        message: 'Credential has expired',
        data: credential
      });
    }

    // Update verification count
    credential.verificationCount += 1;
    credential.lastVerifiedAt = new Date();
    await credential.save();

    res.status(200).json({
      success: true,
      verified: true,
      message: 'Credential is valid and verified',
      data: credential
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying credential',
      error: error.message
    });
  }
};

// @desc    Revoke credential
// @route   PUT /api/credentials/revoke/:id
// @access  Private (Issuer only - must be the issuer who created it)
exports.revokeCredential = async (req, res) => {
  try {
    const { reason } = req.body;
    const credential = await Credential.findById(req.params.id);

    if (!credential) {
      return res.status(404).json({
        success: false,
        message: 'Credential not found'
      });
    }

    // Check if issuer is the one who issued this credential
    if (credential.issuer.toString() !== req.issuer._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to revoke this credential'
      });
    }

    if (credential.isRevoked) {
      return res.status(400).json({
        success: false,
        message: 'Credential is already revoked'
      });
    }

    credential.isRevoked = true;
    credential.revokedAt = new Date();
    credential.revokedReason = reason || 'No reason provided';
    credential.status = 'Revoked';
    await credential.save();

    res.status(200).json({
      success: true,
      message: 'Credential revoked successfully',
      data: credential
    });
  } catch (error) {
    console.error('Revoke error:', error);
    res.status(500).json({
      success: false,
      message: 'Error revoking credential',
      error: error.message
    });
  }
};

// @desc    Get all credentials (for admin/debugging)
// @route   GET /api/credentials
// @access  Public (for now)
exports.getAllCredentials = async (req, res) => {
  try {
    const credentials = await Credential.find()
      .populate('student', 'name email studentId')
      .populate('issuer', 'name institution')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: credentials.length,
      data: credentials
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
