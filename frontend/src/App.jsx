// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import Landing from './pages/Landing';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';
import StudentDashboard from './pages/StudentDashBoard';
import IssuerLogin from './pages/IssuerLogin';
import IssuerRegister from './pages/IssuerRegister';
import IssuerDashboard from './pages/IssuerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home with Navbar */}
        <Route path="/" element={<><Navbar /><Landing /></>} />
        
        {/* Student Routes */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute type="student">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Issuer Routes */}
        <Route path="/issuer/login" element={<IssuerLogin />} />
        <Route path="/issuer/register" element={<IssuerRegister />} />
        <Route 
          path="/issuer/dashboard" 
          element={
            <ProtectedRoute type="issuer">
              <IssuerDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Verifier Routes */}
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/scan" element={<ScanPage />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

// Temporary placeholder components
const VerifyPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Verify Credential</h1>
      <p className="text-gray-600">Coming soon...</p>
    </div>
  </div>
);

const ScanPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Scan QR Code</h1>
      <p className="text-gray-600">Coming soon...</p>
    </div>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <a href="/" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
        Go Home
      </a>
    </div>
  </div>
);

export default App;