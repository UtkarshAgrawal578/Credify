import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { studentAPI } from "../services/api";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCredential, setSelectedCredential] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    loadStudentData();
    loadCredentials();
  }, []);

  const loadStudentData = async () => {
    try {
      const storedData = localStorage.getItem("studentData");
      if (storedData) setStudent(JSON.parse(storedData));

      const response = await studentAPI.getProfile();
      if (response.data.success) {
        setStudent(response.data.data);
        localStorage.setItem("studentData", JSON.stringify(response.data.data));
      }
    } catch (err) {
      if (err.response?.status === 401) navigate("/student/login");
    }
  };

  const loadCredentials = async () => {
    try {
      const response = await studentAPI.getCredentials();
      if (response.data.success) {
        setCredentials(response.data.data || []);
      }
    } catch {
      setError("Failed to load credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("studentData");
    navigate("/student/login");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-16 w-16 border-b-2 border-green-600 rounded-full"></div>
      </div>
    );

  return (
    <>
      {/* ================= RESPONSIVE CSS ONLY ================= */}
      <style>{`
        html, body {
          max-width: 100%;
          overflow-x: hidden;
        }

        /* Header responsiveness */
        @media (max-width: 768px) {
          header .max-w-7xl {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }

        /* Wallet address scroll */
        @media (max-width: 640px) {
          header .font-mono {
            max-width: 100%;
            overflow-x: auto;
            white-space: nowrap;
          }
        }

        /* Stats grid spacing */
        @media (max-width: 640px) {
          main .grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 {
            gap: 12px;
          }
        }

        /* Credential cards stack */
        @media (max-width: 768px) {
          main .grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3 {
            grid-template-columns: 1fr !important;
          }
        }

        /* Action buttons stack on mobile */
        @media (max-width: 480px) {
          .flex.gap-2.mt-4 {
            flex-direction: column;
          }
          .flex.gap-2.mt-4 button {
            width: 100%;
          }
        }

        /* Modal responsiveness */
        @media (max-width: 480px) {
          .fixed .bg-white {
            max-height: 90vh;
            overflow-y: auto;
          }
        }
      `}</style>
      {/* ======================================================= */}

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        {/* HEADER */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Credentials</h1>
              <p className="text-gray-500">
                Welcome back, {student?.name || "Student"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Wallet Address</p>
                <p className="text-xs font-mono bg-gray-100 px-3 py-1 rounded">
                  {student?.walletAddress || "Loading..."}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* ERROR */}
          {error && (
            <p className="bg-red-100 text-red-800 px-4 py-3 rounded-lg mb-4">
              {error}
            </p>
          )}

          {/* CREDENTIALS */}
          {credentials.length === 0 ? (
            <div className="bg-white py-16 rounded-xl shadow-md text-center">
              <div className="text-6xl mb-4">🎓</div>
              <p className="text-gray-500">No credentials yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {credentials.map((c) => (
                <div
                  key={c._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition border overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 text-white">
                    <div className="flex justify-between">
                      <span className="text-4xl">
                        {c.type === "Degree"
                          ? "🎓"
                          : c.type === "Certificate"
                          ? "📜"
                          : "🏆"}
                      </span>

                      <span className="text-xs px-3 py-1 rounded-full bg-green-400/40">
                        {c.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg">{c.title}</h3>
                    <p className="text-sm">Issued by: {c.issuer?.name}</p>
                  </div>

                  <div className="p-4">
                    <p className="text-sm">
                      📅 Issued: {new Date(c.issuedDate).toLocaleDateString()}
                    </p>

                    {c.expiresOn && (
                      <p className="text-sm text-orange-600">
                        ⏰ Expires:{" "}
                        {new Date(c.expiresOn).toLocaleDateString()}
                      </p>
                    )}

                    <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded mt-2">
                      Hash:{" "}
                      {c.credentialHash
                        ? c.credentialHash.substring(0, 16) + "..."
                        : "N/A"}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
                        onClick={() => {
                          setSelectedCredential(c);
                          setShowViewModal(true);
                        }}
                      >
                        👁️ View
                      </button>

                      <button
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                        onClick={() => {
                          setSelectedCredential(c);
                          setShowShareModal(true);
                        }}
                      >
                        🔗 Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* SHARE MODAL (UNCHANGED) */}
        {showShareModal && selectedCredential && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Share Credential</h2>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <p className="font-semibold">{selectedCredential.title}</p>
            </div>
          </div>
        )}

        {/* VIEW MODAL (UNCHANGED – SHOWS EVERYTHING) */}
        {showViewModal && selectedCredential && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
    
    {/* Modal Card */}
    <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl max-w-xl w-full p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-white/30 transform transition-all duration-300 scale-100">

      {/* Header */}
      <div className="flex justify-between items-center mb-5 border-b pb-3">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Credential Details
        </h2>

        <button
          onClick={() => setShowViewModal(false)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 hover:text-red-600 transition-all duration-200 text-gray-600 text-lg"
        >
          ✕
        </button>
      </div>

      {/* Title & Issuer */}
      <div className="mb-4">
        <p className="text-xl font-semibold text-gray-800">
          {selectedCredential.title}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Issued by <span className="font-medium text-blue-600">
            {selectedCredential.issuer?.name}
          </span>
        </p>
      </div>

      {/* Info Section */}
      <div className="mt-4 space-y-3 text-sm text-gray-700">

        <div className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2">
          <span>📅 Issued</span>
          <span className="font-medium">
            {new Date(selectedCredential.issuedDate).toLocaleDateString()}
          </span>
        </div>

        {selectedCredential.expiresOn && (
          <div className="flex items-center justify-between bg-red-50 rounded-lg px-3 py-2">
            <span>⏰ Expires</span>
            <span className="font-medium text-red-600">
              {new Date(selectedCredential.expiresOn).toLocaleDateString()}
            </span>
          </div>
        )}

        <div className="bg-gray-100 rounded-lg px-3 py-2">
          <p className="text-xs text-gray-500 mb-1">Credential Hash</p>
          <p className="font-mono text-xs break-all text-gray-800">
            {selectedCredential.credentialHash}
          </p>
        </div>

        {selectedCredential.description && (
          <div className="bg-blue-50 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-500 mb-1">Description</p>
            <p className="text-sm text-gray-800">
              {selectedCredential.description}
            </p>
          </div>
        )}
      </div>

      {/* Metadata Section */}
      {selectedCredential.metadata && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">
            Additional Information
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(selectedCredential.metadata).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="bg-indigo-50 rounded-lg px-3 py-2 text-sm shadow-sm hover:shadow-md transition"
                >
                  <p className="text-gray-500 text-xs capitalize">{key}</p>
                  <p className="font-semibold text-indigo-700">{value}</p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  </div>
)}

      </div>
    </>
  );
}
