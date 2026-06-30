import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ================= Scroll Reveal Component ================= */

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

/* ================= Modern Navbar ================= */

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xl group-hover:bg-indigo-700 transition-colors">
            C
          </div>
          <span className="font-bold text-2xl text-slate-900 tracking-tight">
            Credify
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/student/dashboard"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors duration-200"
          >
            Students
          </Link>
          <Link
            to="/issuer/login"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors duration-200"
          >
            Institutions
          </Link>
          <div className="w-px h-6 bg-slate-200"></div>
          <Link
            to="/student/login"
            className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all duration-200 hover:shadow"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-slate-600 hover:text-indigo-600 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-b border-slate-100 ${
          isMobileMenuOpen ? "max-h-64" : "max-h-0"
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          <Link
            to="/student/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-600 font-medium hover:text-indigo-600"
          >
            Students
          </Link>
          <Link
            to="/issuer/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-600 font-medium hover:text-indigo-600"
          >
            Institutions
          </Link>
          <Link
            to="/student/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-center px-5 py-3 mt-2 rounded-lg font-semibold bg-indigo-600 text-white shadow-sm"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ================= Modern Digital Credential Card ================= */

function CredentialCard() {
  return (
    <div className="relative w-full max-w-sm mx-auto group perspective">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl transform rotate-3 scale-105 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>
      <div className="relative bg-white border border-slate-100 shadow-2xl rounded-3xl p-8 transform transition-transform duration-500 hover:-translate-y-2">
        <div className="flex justify-between items-start mb-8">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <span className="text-indigo-600 font-bold text-xl">🎓</span>
          </div>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full tracking-wider uppercase">
            Verified
          </span>
        </div>
        <div className="space-y-4">
          <div className="h-2 w-1/3 bg-slate-200 rounded-full"></div>
          <div className="h-4 w-3/4 bg-slate-800 rounded-full"></div>
          <div className="h-2 w-1/2 bg-slate-200 rounded-full"></div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          <div className="flex -space-x-2">
             <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100"></div>
             <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-100"></div>
          </div>
          <p className="text-xs text-slate-400 font-medium">Secured on Blockchain</p>
        </div>
      </div>
    </div>
  );
}

/* ================= Landing Page ================= */

function Landing() {
  const features = [
    {
      icon: "🛡️",
      title: "Tamper-Proof",
      desc: "Credentials are cryptographically secured, making fraud impossible and verification instant.",
    },
    {
      icon: "⚡",
      title: "Instant Issuance",
      desc: "Institutions can issue thousands of certificates with a single click, saving weeks of admin work.",
    },
    {
      icon: "📱",
      title: "Universal Wallet",
      desc: "Students carry their lifelong academic records in their pocket, ready to share anywhere.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-16 md:pt-28 pb-32">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                The new standard for academic records
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Digital credentials <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  you can trust.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={150}>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-lg">
                Replace paper certificates with verifiable, secure digital records. 
                Credify empowers institutions to issue credentials instantly and gives students 
                lifelong ownership of their achievements.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/student/dashboard"
                  className="px-8 py-4 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-center"
                >
                  Create Student Wallet
                </Link>
                <Link
                  to="/issuer/login"
                  className="px-8 py-4 rounded-xl font-bold bg-white text-slate-700 border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 transition-all duration-200 text-center shadow-sm hover:shadow"
                >
                  Institution Portal
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="lg:ml-auto w-full">
            <CredentialCard />
          </Reveal>
        </div>
      </section>

      {/* ================= FEATURES GRID ================= */}
      <section className="bg-white py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                Built for the modern campus
              </h2>
              <p className="mt-4 text-slate-600 text-lg">
                Everything you need to modernize your credentialing system, whether you are issuing or receiving.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Reveal key={index} delay={index * 150}>
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all duration-300 h-full">
                  <div className="text-4xl mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 text-center mb-16">
              How Credify works
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Desktop connecting line */}
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-slate-200 z-0"></div>
            
            <Reveal delay={100} className="relative z-10 text-center">
              <div className="w-16 h-16 mx-auto bg-white border-4 border-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl shadow-sm mb-6">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Issue</h3>
              <p className="text-slate-600">Institutions verify student data and issue the digital certificate to the blockchain.</p>
            </Reveal>

            <Reveal delay={300} className="relative z-10 text-center">
              <div className="w-16 h-16 mx-auto bg-white border-4 border-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl shadow-sm mb-6">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Store</h3>
              <p className="text-slate-600">Students receive the credential instantly in their secure personal wallet.</p>
            </Reveal>

            <Reveal delay={500} className="relative z-10 text-center">
              <div className="w-16 h-16 mx-auto bg-white border-4 border-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl shadow-sm mb-6">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verify</h3>
              <p className="text-slate-600">Employers and third parties can verify the credential's authenticity in seconds.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="bg-indigo-900 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
              {/* Decorative background shapes */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-indigo-600/30 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-purple-600/30 blur-3xl"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                  Ready to upgrade your credentials?
                </h2>
                <p className="text-indigo-200 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                  Join the platform that is securing the future of academic records. Free for students forever.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/student/login"
                    className="px-8 py-4 rounded-xl font-bold bg-white text-indigo-900 hover:bg-slate-50 transition-colors shadow-lg"
                  >
                    Student Login
                  </Link>
                  <Link
                    to="/issuer/login"
                    className="px-8 py-4 rounded-xl font-bold bg-indigo-800 text-white hover:bg-indigo-700 border border-indigo-700 transition-colors shadow-lg"
                  >
                    Institution Login
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 text-white rounded flex items-center justify-center font-bold text-xs">
              C
            </div>
            <span className="font-bold text-slate-900">Credify</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Credify Platforms Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-indigo-600 cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;