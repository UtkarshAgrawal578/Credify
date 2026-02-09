const mongoose = require('mongoose');
const { generateCredentialHash, generateTransactionId } = require('../utils/blockchain');

const credentialSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student reference is required']
  },
  issuer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issuer',
    required: [true, 'Issuer reference is required']
  },
  title: {
    type: String,
    required: [true, 'Please provide a credential title'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Degree', 'Certificate', 'Achievement', 'Certification', 'Badge'],
    required: [true, 'Please provide a credential type']
  },
  description: {
    type: String,
    trim: true
  },
  credentialHash: {
    type: String,
    unique: true,
    required: true
  },
  transactionId: {
    type: String,
    unique: true
  },
  metadata: {
    major: {
      type: String,
      trim: true
    },
    gpa: {
      type: String,
      trim: true
    },
    honors: {
      type: String,
      trim: true
    },
    grade: {
      type: String,
      trim: true
    },
    skills: [{
      type: String,
      trim: true
    }],
    completionDate: {
      type: Date
    },
    customFields: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  issuedDate: {
    type: Date,
    default: Date.now
  },
  expiresOn: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Verified', 'Pending', 'Revoked', 'Expired', 'Expiring Soon'],
    default: 'Verified'
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  revokedAt: {
    type: Date
  },
  revokedReason: {
    type: String,
    trim: true
  },
  digitalSignature: {
    type: String
  },
  verificationCount: {
    type: Number,
    default: 0
  },
  lastVerifiedAt: {
    type: Date
  },
  qrCodeData: {
    type: String
  }
}, {
  timestamps: true
});

// Generate credential hash and transaction ID before saving
credentialSchema.pre('save', function(next) {
  // Only generate hash if it's a new credential
  if (this.isNew && !this.credentialHash) {
    this.credentialHash = generateCredentialHash({
      studentId: this.student,
      title: this.title,
      issuer: this.issuer,
      issuedDate: this.issuedDate,
      metadata: this.metadata

      
   

    });
  }
  
  // Generate transaction ID if not exists
  if (!this.transactionId) {
    this.transactionId = generateTransactionId();
  }
  
  
});

// Check if credential is expired
credentialSchema.methods.isExpired = function() {
  if (!this.expiresOn) return false;
  return new Date() > this.expiresOn;
};

// Check if expiring soon (within 30 days)
credentialSchema.methods.isExpiringSoon = function() {
  if (!this.expiresOn) return false;
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return new Date() < this.expiresOn && this.expiresOn < thirtyDaysFromNow;
};

// Get credential age in days
credentialSchema.methods.getAge = function() {
  const now = new Date();
  const issued = new Date(this.issuedDate);
  const diffTime = Math.abs(now - issued);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Check if credential is valid
credentialSchema.methods.isValid = function() {
  return !this.isRevoked && !this.isExpired() && this.status === 'Verified';
};

// Update status based on expiration
credentialSchema.pre('find', function() {
  // This middleware runs before find queries
  // You can add logic to automatically update expired credentials
});

credentialSchema.pre('findOne', function() {
  // This middleware runs before findOne queries
});

// Indexes for faster queries
credentialSchema.index({ credentialHash: 1 });
credentialSchema.index({ student: 1 });
credentialSchema.index({ issuer: 1 });
credentialSchema.index({ transactionId: 1 });
credentialSchema.index({ status: 1 });
credentialSchema.index({ issuedDate: -1 });

module.exports = mongoose.model('Credential', credentialSchema);

