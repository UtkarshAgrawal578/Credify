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

  const stats = [
    { label: "Total", value: credentials.length, icon: "📜", color: "bg-blue-500" },
    { label: "Verified", value: credentials.filter(c => c.status === "Verified").length, icon: "✅", color: "bg-green-500" },
    { label: "Expiring", value: credentials.filter(c => c.status === "Expiring Soon").length, icon: "⏰", color: "bg-orange-500" },
    { label: "This Month", value: credentials.filter(c => new Date(c.issuedDate).getMonth() === new Date().getMonth()).length, icon: "📅", color: "bg-purple-500" }
  ];

  const ShareModal = ({ credential }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="modal-content bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-lg">Share Credential</h2>
          <button onClick={() => setShowShareModal(false)}>✖</button>
        </div>
        <p className="font-semibold">{credential?.title}</p>
        <button className="btn-primary mt-4 w-full">Generate QR</button>
      </div>
    </div>
  );

  const ViewModal = ({ credential }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="modal-content bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-lg">Credential Details</h2>
          <button onClick={() => setShowViewModal(false)}>✖</button>
        </div>
        <p className="font-semibold">{credential?.title}</p>
        <p className="text-sm">Issued by: {credential?.issuer?.name}</p>
        <p className="text-xs mt-2 font-mono break-all">
          Hash: {credential?.credentialHash || "N/A"}
        </p>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin h-14 w-14 border-b-2 border-green-600 rounded-full"></div>
      </div>
    );

  return (
    <>
      <style>{`
        body { overflow-x: hidden; }

        @media (max-width: 640px) {
          header .flex { flex-direction: column; align-items: flex-start; gap: 12px; }
          .credential-actions { flex-direction: column; }
          .credential-actions button { width: 100%; }
        }

        @media (max-width: 480px) {
          .modal-content { max-height: 90vh; overflow-y: auto; }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <header className="bg-white shadow border-b">
          <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Student Dashboard</h1>
              <p className="text-gray-500">Welcome, {student?.name}</p>
            </div>
            <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg">
              Logout
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 flex justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{s.label}</p>
                  <p className="text-3xl font-bold">{s.value}</p>
                </div>
                <div className={`${s.color} text-white p-3 rounded-lg text-2xl`}>{s.icon}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {credentials.map(c => (
              <div key={c._id} className="bg-white rounded-xl shadow-md border">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 text-white">
                  <h3 className="font-bold">{c.title}</h3>
                  <p className="text-sm">{c.issuer?.name}</p>
                </div>
                <div className="p-4">
                  <p className="text-sm">Issued: {new Date(c.issuedDate).toLocaleDateString()}</p>
                  <div className="credential-actions flex gap-2 mt-4">
                    <button onClick={() => { setSelectedCredential(c); setShowViewModal(true); }} className="bg-blue-600 text-white py-2 rounded-lg flex-1">View</button>
                    <button onClick={() => { setSelectedCredential(c); setShowShareModal(true); }} className="bg-green-600 text-white py-2 rounded-lg flex-1">Share</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {showShareModal && <ShareModal credential={selectedCredential} />}
        {showViewModal && <ViewModal credential={selectedCredential} />}
      </div>
    </>
  );
}
