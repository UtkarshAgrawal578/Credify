// src/components/IssueCredentialModal.jsx
import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export default function IssueCredentialModal({ student, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Certificate',
    description: '',
    metadata: {
      major: '',
      gpa: '',
      honors: '',
      grade: '',
      completionDate: ''
    },
    expiresOn: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const credentialTypes = ['Degree', 'Certificate', 'Achievement', 'Certification', 'Badge'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('metadata.')) {
      const metadataField = name.split('.')[1];
      setFormData({
        ...formData,
        metadata: {
          ...formData.metadata,
          [metadataField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('issuerToken');
      
      // Clean up metadata - remove empty fields
      const cleanMetadata = {};
      Object.keys(formData.metadata).forEach(key => {
        if (formData.metadata[key]) {
          cleanMetadata[key] = formData.metadata[key];
        }
      });

      const credentialData = {
        studentId: student._id,
        title: formData.title,
        type: formData.type,
        description: formData.description,
        metadata: cleanMetadata,
        expiresOn: formData.expiresOn || null
      };

      const response = await axios.post(
        `${API_URL}/credentials/issue`,
        credentialData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        onSuccess(response.data.data);
        onClose();
      }
    } catch (err) {
      console.error('Issuance error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to issue credential. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-800">Issue Credential</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Student Info */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-1">Issuing to:</p>
            <p className="font-bold text-gray-900">{student.name}</p>
            <p className="text-sm text-gray-600">{student.email}</p>
            {student.studentId && (
              <p className="text-sm text-gray-600">Student ID: {student.studentId}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">Wallet: {student.walletAddress}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Credential Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="Bachelor of Technology"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                >
                  {credentialTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Brief description of the credential..."
              />
            </div>

            {/* Metadata Section */}
            <div className="border-t border-gray-200 pt-5">
              <h4 className="font-semibold text-gray-900 mb-4">Additional Details (Optional)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Major/Specialization
                  </label>
                  <input
                    type="text"
                    name="metadata.major"
                    value={formData.metadata.major}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Computer Science"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GPA/Score
                  </label>
                  <input
                    type="text"
                    name="metadata.gpa"
                    value={formData.metadata.gpa}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="3.8/4.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Honors/Distinction
                  </label>
                  <input
                    type="text"
                    name="metadata.honors"
                    value={formData.metadata.honors}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Magna Cum Laude"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade
                  </label>
                  <input
                    type="text"
                    name="metadata.grade"
                    value={formData.metadata.grade}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="A+"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    name="metadata.completionDate"
                    value={formData.metadata.completionDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration Date (if applicable)
                  </label>
                  <input
                    type="date"
                    name="expiresOn"
                    value={formData.expiresOn}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Blockchain Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">🔐 This credential will be:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Hashed using SHA-256 algorithm</li>
                <li>• Assigned a unique transaction ID</li>
                <li>• Stored with tamper-proof verification</li>
                <li>• Linked to student's wallet address</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Issuing...' : 'Issue Credential'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}