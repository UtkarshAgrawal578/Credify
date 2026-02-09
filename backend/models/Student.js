
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
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
  walletAddress: {
    type: String,
    unique: true,
    sparse: true
  },
  institution: {
    type: String,
    trim: true
  },
  studentId: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  phone: {
    type: String,
    trim: true
  },
  credentials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Credential'
  }],
  issuedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving (FIXED - removed next callback)
studentSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate wallet address
studentSchema.methods.generateWalletAddress = function() {
  const crypto = require('crypto');
  this.walletAddress = '0x' + crypto.randomBytes(20).toString('hex');
  return this.walletAddress;
};

module.exports = mongoose.model('Student', studentSchema);