import React from 'react'
import { Link } from 'react-router-dom'
function Landing() {
  return (
        <div className="pt-28 bg-gradient-to-b from-blue-500/70 to-blue-500/90 min-h-screen text-white">

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 text-center py-16">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
          Secure & Instant Academic Credential Verification
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
          Credify lets students store certificates digitally, institutions issue them securely,
          and employers verify them instantly — all with trust and transparency.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center">
      <Link
            to="/student/dashboard"
            className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Student Wallet
          </Link>

          <Link
            to="/issuer/login"
            className="bg-blue-700 border border-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Issuer Portal
          </Link>

          <Link
              to="/verify"
            className="bg-black/30 backdrop-blur-md border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-black/40 transition"
          >
            Verify Credential
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 mt-20 grid md:grid-cols-3 gap-10">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg hover:scale-105 transition">
          <h3 className="text-2xl font-bold mb-3">🎓 Student Wallet</h3>
          <p>
            Store all your academic credentials securely in one place.
            Access them anywhere, anytime.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg hover:scale-105 transition">
          <h3 className="text-2xl font-bold mb-3">🏫 Issuer Dashboard</h3>
          <p>
            Colleges and institutions can issue tamper-proof digital certificates
            with a few clicks.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg hover:scale-105 transition">
          <h3 className="text-2xl font-bold mb-3">✔ Instant Verification</h3>
          <p>
            Employers can verify certificates instantly via Credential ID or QR Code.
          </p>
        </div>
      </section>

      {/* Steps / How It Works */}
      <section className="mt-28 max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-10 mt-12">

          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg">
            <span className="text-3xl font-bold bg-white/20 px-4 py-2 rounded-lg">1</span>
            <h3 className="text-2xl mt-4 font-semibold">Issuer Creates Credential</h3>
            <p className="mt-2 text-gray-200">
              College uploads certificate details and issues them digitally.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg">
            <span className="text-3xl font-bold bg-white/20 px-4 py-2 rounded-lg">2</span>
            <h3 className="text-2xl mt-4 font-semibold">Student Stores Securely</h3>
            <p className="mt-2 text-gray-200">
              Certificates are safely stored in the student’s digital wallet.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-lg">
            <span className="text-3xl font-bold bg-white/20 px-4 py-2 rounded-lg">3</span>
            <h3 className="text-2xl mt-4 font-semibold">Verifier Checks Instantly</h3>
            <p className="mt-2 text-gray-200">
              Employers verify authenticity instantly via QR or ID.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mt-28 text-center py-16 bg-blue-700/40 backdrop-blur-lg">
        <h2 className="text-4xl font-extrabold">Start Using Credify Today</h2>
        <p className="text-gray-200 mt-3 text-lg">
          Trusted, secure, and instant credential verification for the modern world.
        </p>

        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <Link to="/student/login" className="bg-white text-blue-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition">
            Student Login
          </Link>
          <Link to="/issuer/login" className="bg-black/30 backdrop-blur-xl border border-gray-300 px-8 py-3 rounded-lg font-bold hover:bg-black/40 transition">
            Issuer Login
          </Link>
          <Link to="/verify" className="bg-blue-900 px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition">
            Verify Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 py-8 text-center text-gray-200 bg-blue-900/60 backdrop-blur-md">
        <p className="font-semibold">© 2025 Credify. All Rights Reserved.</p>
        <p className="text-sm mt-2">Built with MERN • TailwindCSS • Secure Credential Protocol</p>
      </footer>
    </div>
  )
}

export default Landing
