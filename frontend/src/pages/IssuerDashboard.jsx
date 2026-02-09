// src/pages/IssuerDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import IssueCredentialModal from '../components/IssueCredentialModal';

const API_URL = 'http://localhost:5000/api';

export default function IssuerDashboard() {
  const navigate = useNavigate();
  const [issuer, setIssuer] = useState(null);
  const [stats, setStats] = useState({
    totalIssued: 0,
    thisMonth: 0,
    verified: 0,
    revoked: 0
  });
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchingStudent, setSearchingStudent] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    loadIssuerData();
    loadStats();
    loadCredentials();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem('issuerToken');
    return { Authorization: `Bearer ${token}` };
  };

  const loadIssuerData = async () => {
    try {
      const storedData = localStorage.getItem('issuerData');
      if (storedData) {
        setIssuer(JSON.parse(storedData));
      }

      const response = await axios.get(`${API_URL}/issuers/profile`, {
        headers: getAuthHeader()
      });
      if (response.data.success) {
        setIssuer(response.data.data);
        localStorage.setItem('issuerData', JSON.stringify(response.data.data));
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      if (err.response?.status === 401) {
        navigate('/issuer/login');
      }
    }
  };

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/issuers/stats`, {
        headers: getAuthHeader()
      });
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const loadCredentials = async () => {
    try {
      const response = await axios.get(`${API_URL}/issuers/credentials`, {
        headers: getAuthHeader()
      });
      if (response.data.success) {
        setCredentials(response.data.data || []);
      }
    } catch (err) {
      console.error('Error loading credentials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchStudent = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchingStudent(true);
    try {
      const response = await axios.get(
        `${API_URL}/issuers/students/search?query=${searchQuery}`,
        { headers: getAuthHeader() }
      );
      if (response.data.success) {
        setSearchResults(response.data.data);
      }
    } catch (err) {
      console.error('Error searching students:', err);
    } finally {
      setSearchingStudent(false);
    }
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setShowIssueModal(true);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('issuerToken');
    localStorage.removeItem('issuerData');
    navigate('/issuer/login');
  };

  const statCards = [
    {
      label: "Total Issued",
      value: stats.totalIssued,
      icon: "📜",
      color: "bg-blue-500"
    },
    {
      label: "This Month",
      value: stats.thisMonth,
      icon: "📅",
      color: "bg-purple-500"
    },
    {
      label: "Verified",
      value: stats.verified,
      icon: "✅",
      color: "bg-green-500"
    },
    {
      label: "Revoked",
      value: stats.revoked,
      icon: "🚫",
      color: "bg-red-500"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Issuer Dashboard</h1>
              <p className="text-gray-600 mt-1">
                {issuer?.institution} • {issuer?.name}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('issue')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'issue'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Issue Credential
              </button>
              <button
                onClick={() => setActiveTab('issued')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'issued'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Issued Credentials
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Institution Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Institution Name</p>
                    <p className="font-semibold text-gray-900">{issuer?.institution}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-semibold text-gray-900">{issuer?.institutionType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">{issuer?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-900">{issuer?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-semibold text-gray-900">{issuer?.address || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <p className="font-semibold text-gray-900">{issuer?.website || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Issue Credential Tab */}
            {activeTab === 'issue' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Search Student</h2>
                <form onSubmit={handleSearchStudent} className="mb-6">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, email, or student ID..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                    <button
                      type="submit"
                      disabled={searchingStudent}
                      className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition disabled:opacity-50"
                    >
                      {searchingStudent ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                </form>

                {searchResults.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-700 mb-3">Search Results:</h3>
                    {searchResults.map((student) => (
                      <div
                        key={student._id}
                        className="bg-gray-50 p-4 rounded-lg flex items-center justify-between hover:bg-gray-100 transition"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.email}</p>
                          <p className="text-xs text-gray-500">
                            Student ID: {student.studentId || 'N/A'} • {student.institution || 'N/A'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleSelectStudent(student)}
                          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                        >
                          Select
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.length === 0 && searchQuery && !searchingStudent && (
                  <div className="text-center py-8 text-gray-500">
                    No students found. Try a different search term.
                  </div>
                )}
              </div>
            )}

            {/* Issued Credentials Tab */}
            {activeTab === 'issued' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">All Issued Credentials</h2>
                {credentials.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📜</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No credentials issued yet</h3>
                    <p className="text-gray-500">Start issuing credentials to students</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {credentials.map((credential) => (
                      <div key={credential._id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{credential.title}</p>
                            <p className="text-sm text-gray-600">
                              Issued to: {credential.student?.name} ({credential.student?.email})
                            </p>
                            <p className="text-xs text-gray-500">
                              Date: {new Date(credential.issuedDate).toLocaleDateString()} • 
                              Hash: {credential.credentialHash?.substring(0, 16)}...
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            credential.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {credential.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Issue Modal Placeholder */}
      {showIssueModal && selectedStudent && (
  <IssueCredentialModal
    student={selectedStudent}
    onClose={() => {
      setShowIssueModal(false);
      setSelectedStudent(null);
    }}
    onSuccess={(credential) => {
      console.log('Credential issued:', credential);
      alert('Credential issued successfully!');
      loadCredentials();
      loadStats();
    }}
  />
)}
    </div>
  );
}