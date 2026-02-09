const crypto = require('crypto');
// const { ethers } = require('ethers');

/**
 * Generate SHA-256 hash for credential data
 * This simulates storing credential on blockchain
 */
exports.generateCredentialHash = (credentialData) => {
  try {
    // Create a deterministic string from credential data
    const dataString = JSON.stringify({
      studentId: credentialData.studentId,
      title: credentialData.title,
      issuer: credentialData.issuer,
      issuedDate: credentialData.issuedDate,
      metadata: credentialData.metadata
    });
    
    // Generate SHA-256 hash
    const hash = crypto.createHash('sha256').update(dataString).digest('hex');
    return hash;
  } catch (error) {
    console.error('Hash generation error:', error);
    throw new Error('Failed to generate credential hash');
  }
};

/**
 * Verify credential hash
 * Check if the provided hash matches the credential data
 */
exports.verifyCredentialHash = (originalData, providedHash) => {
  try {
    const generatedHash = this.generateCredentialHash(originalData);
    return generatedHash === providedHash;
  } catch (error) {
    console.error('Hash verification error:', error);
    return false;
  }
};

/**
 * Generate a simulated blockchain transaction ID
 * Format: 0x followed by 64 hexadecimal characters
 */
exports.generateTransactionId = () => {
  try {
    return '0x' + crypto.randomBytes(32).toString('hex');
  } catch (error) {
    console.error('Transaction ID generation error:', error);
    throw new Error('Failed to generate transaction ID');
  }
};

/**
 * Create a digital signature for credential
 * In production, this would be signed by issuer's private key
 */
// /**
//  * Verify digital signature
//  * Check if signature is valid for the given hash and issuer's address
//  */
exports.verifySignature = (credentialHash, signature, issuerAddress) => {
  try {
    // Create message hash
    const messageHash = ethers.utils.id(credentialHash);

    // Convert hash to bytes
    const messageBytes = ethers.utils.arrayify(messageHash);

    // Recover signer address from signature
    const recoveredAddress = ethers.utils.verifyMessage(messageBytes, signature);

    // Compare recovered address with issuer address
    return recoveredAddress.toLowerCase() === issuerAddress.toLowerCase();

  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};
