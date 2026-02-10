// src/pages/StudentDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { studentAPI } from "../services/api";
import "/Dashboard.css"
export default function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCredential, setSelectedCredential] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // LOAD STUDENT + CREDENTIALS
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
    } catch (err) {
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

  const stats = [
    {
      label: "Total Credentials",
      value: credentials.length,
      icon: "📜",
      color: "bg-blue-500",
    },
    {
      label: "Verified",
      value: credentials.filter((c) => c.status === "Verified").length,
      icon: "✅",
      color: "bg-green-500",
    },
    {
      label: "Expiring Soon",
      value: credentials.filter((c) => c.status === "Expiring Soon").length,
      icon: "⏰",
      color: "bg-orange-500",
    },
    {
      label: "This Month",
      value: credentials.filter((c) => {
        const date = new Date(c.issuedDate);
        const now = new Date();
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      }).length,
      icon: "📅",
      color: "bg-purple-500",
    },
  ];

  // SHARE MODAL
  const ShareModal = ({ credential }) => (
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

        <div className="bg-gray-100 p-3 rounded mb-4 text-sm">
          <p className="text-gray-500 mb-1">Credential:</p>
          <p className="font-semibold">{credential?.title}</p>
        </div>

        <button className="w-full bg-green-600 text-white py-3 rounded-lg mb-3">
          📱 Generate QR Code
        </button>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
          🔗 Share Link
        </button>
      </div>
    </div>
  );

  // VIEW MODAL
  const ViewModal = ({ credential }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Credential Details</h2>
          <button
            onClick={() => setShowViewModal(false)}
            className="text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <p className="text-lg font-semibold">{credential?.title}</p>
        <h1>Issued by: </h1><p className="text-gray-600">{credential?.issuer?.name}</p>

        <div className="mt-4 space-y-2 text-sm">
          <p>📅 Issued: {new Date(credential?.issuedDate).toLocaleDateString()}</p>
          {credential?.expiresOn && (
            <p>⏰ Expires: {new Date(credential?.expiresOn).toLocaleDateString()}</p>
          )}
   Hash: {credential?.credentialHash || "Not generated"}


        </div>

        {credential?.metadata && (
          <div className="mt-4 bg-blue-50 p-3 rounded">
            {Object.entries(credential.metadata).map(([key, value]) => (
  <p key={key + value} className="flex justify-between text-sm">
    <span className="capitalize">{key}:</span>
    <span className="font-semibold">{value}</span>
  </p>
))}

          </div>
        )}
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-16 w-16 border-b-2 border-green-600 rounded-full"></div>
      </div>
    );

  return (
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

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-xl p-6 flex justify-between"
            >
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-2xl`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* ERROR */}
        {error && (
          <p className="bg-red-100 text-red-800 px-4 py-3 rounded-lg mb-4">
            {error}
          </p>
        )}

        {/* CREDENTIALS HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">All Credentials</h2>

          <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
            📥 Export All
          </button>
        </div>

        {/* CREDENTIAL CARDS */}
        {credentials.length === 0 ? (
          <div className="bg-white py-16 rounded-xl shadow-md text-center">
            <div className="text-6xl mb-4">🎓</div>
            <p className="text-gray-500">No credentials yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {credentials.map((c) => (
  <div
    key={c._id || c.title + c.issuedDate} // fallback key
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

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        c.status === "Verified"
                          ? "bg-green-400/40"
                          : "bg-orange-400/40"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg">{c.title}</h3>
                  <h1>Issued by: </h1><p className="text-sm">{c.issuer?.name}</p>
                </div>

                <div className="p-4">
                  <p className="text-sm flex gap-2 items-center">
                    📅 Issued: {new Date(c.issuedDate).toLocaleDateString()}
                  </p>

                  {c.expiresOn && (
                    <p className="text-sm text-orange-600 flex gap-2 items-center">
                      ⏰ Expires: {new Date(c.expiresOn).toLocaleDateString()}
                    </p>
                  )}

                  <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
  Hash: {c?.credentialHash 
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

      {showShareModal && <ShareModal credential={selectedCredential} />}
      {showViewModal && <ViewModal credential={selectedCredential} />}
    </div>
  );
}
