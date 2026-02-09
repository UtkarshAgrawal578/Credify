const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const issuerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide issuer name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  institution: {
    type: String,
    required: [true, 'Please provide institution name'],
    trim: true
  },
  institutionType: {
    type: String,
    enum: ['University', 'College', 'School', 'Training Center', 'Certification Body', 'Other'],
    default: 'University'
  },
  address: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  issuedCredentials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Credential'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: {
    type: String
  }
}, {
  timestamps: true
});

// Hash password before saving
issuerSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
issuerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Issuer', issuerSchema);
