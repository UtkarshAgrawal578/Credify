import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ================= Navbar Component ================= */

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0B1024]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl text-[#C9A24C]">CR</span>
          <span className="font-serif text-xl text-[#F1ECDE] tracking-wide">Credify</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/student/dashboard"
            className="text-sm font-medium text-[#A9B0D6] hover:text-[#C9A24C] transition-colors duration-200"
          >
            Student
          </Link>
          <Link
            to="/issuer/login"
            className="text-sm font-medium text-[#A9B0D6] hover:text-[#C9A24C] transition-colors duration-200"
          >
            Issuer Portal
          </Link>
          <Link
            to="/student/login"
            className="px-5 py-2 rounded-md text-sm font-semibold border border-[#C9A24C]/40 text-[#F1ECDE] hover:bg-[#C9A24C]/10 transition-colors duration-200"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-[#A9B0D6] hover:text-[#C9A24C] focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-64 border-b border-white/10" : "max-h-0"
        }`}
      >
        <div className="px-6 py-4 bg-[#10162F] flex flex-col gap-4">
          <Link
            to="/student/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[#A9B0D6] hover:text-[#C9A24C] font-medium"
          >
            Student Portal
          </Link>
          <Link
            to="/issuer/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-[#A9B0D6] hover:text-[#C9A24C] font-medium"
          >
            Issuer Portal
          </Link>
          <hr className="border-white/10 my-1" />
          <Link
            to="/student/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-center px-5 py-2 rounded-md font-semibold bg-[#C9A24C] text-[#0B1024] hover:bg-[#dcb55e]"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}

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
      className={`transition-all duration-1000 ease-out transform
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}
    >
      {children}
    </div>
  );
}

/* ================= Seal Emblem (signature element) ================= */

function CredentialSeal() {
  return (
    <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto">
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#C9A24C]/40 animate-[spin_18s_linear_infinite]" />
      <div className="absolute inset-3 rounded-full border border-[#C9A24C]/70 flex items-center justify-center bg-[#0F1530]">
        <div className="text-center">
          <p className="text-[10px] tracking-[0.3em] text-[#C9A24C] uppercase">Credify</p>
          <p className="font-serif text-2xl sm:text-3xl text-[#F1ECDD] mt-1">CR</p>
          <p className="text-[9px] tracking-[0.2em] text-[#8A93B8] uppercase mt-1">Issued</p>
        </div>
      </div>
    </div>
  );
}

/* ================= Landing Page ================= */

function Landing() {
  const ledgerItems = [
    {
      mark: "01",
      title: "Student Wallet",
      desc: "Every certificate you've earned, stored in one place and ready whenever you need it.",
    },
    {
      mark: "02",
      title: "Issuer Dashboard",
      desc: "Institutions issue tamper-proof digital certificates to students in seconds, not weeks.",
    },
  ];

  const timeline = [
    {
      title: "Issuer creates the credential",
      desc: "A college or institution enters certificate details and issues it digitally.",
    },
    {
      title: "Student stores it securely",
      desc: "The credential lands directly in the student's wallet, encrypted and always accessible.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1024] text-[#F1ECDE]">
      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <Reveal>
            <p className="text-xs tracking-[0.3em] text-[#C9A24C] uppercase mb-5">
              Digital Academic Records
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight text-[#F1ECDE]">
              Your credentials, kept safe and always within reach.
            </h1>
          </Reveal>

          <Reveal delay={150}>
            <p className="mt-6 text-[#A9B0D6] text-base sm:text-lg leading-relaxed max-w-lg">
              Credify lets students hold their academic certificates in a secure digital
              wallet, and gives institutions a fast, reliable way to issue them.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/student/dashboard"
                className="px-7 py-3 rounded-lg font-semibold bg-[#C9A24C] text-[#0B1024] hover:bg-[#dcb55e] transition-colors duration-200 text-center"
              >
                Open Student Wallet
              </Link>
              <Link
                to="/issuer/login"
                className="px-7 py-3 rounded-lg font-semibold border border-[#C9A24C]/50 text-[#F1ECDE] hover:bg-[#C9A24C]/10 transition-colors duration-200 text-center"
              >
                Issuer Portal
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div className="bg-[#10162F] border border-white/10 rounded-2xl p-10">
            <CredentialSeal />
            <p className="text-center text-xs text-[#6F77A0] mt-6 tracking-wide">
              A certificate, issued and held — nothing more, nothing less.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ================= LEDGER FEATURES ================= */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <Reveal>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F1ECDE] mb-10">
            Built for two roles
          </h2>
        </Reveal>

        <div className="divide-y divide-white/10 border-t border-b border-white/10">
          {ledgerItems.map((item, index) => (
            <Reveal key={index} delay={index * 150}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-10 py-8">
                <span className="font-serif text-3xl text-[#C9A24C]/70 sm:w-16 shrink-0">
                  {item.mark}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-[#F1ECDE]">{item.title}</h3>
                  <p className="mt-2 text-[#A9B0D6] max-w-xl">{item.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= TIMELINE ================= */}
      <section className="max-w-3xl mx-auto px-6 pb-28">
        <Reveal>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F1ECDE] mb-12 text-center">
            How it works
          </h2>
        </Reveal>

        <div className="relative pl-8 sm:pl-10">
          <div className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 w-px bg-white/10" />
          {timeline.map((item, index) => (
            <Reveal key={index} delay={index * 200}>
              <div className="relative pb-12 last:pb-0">
                <span className="absolute -left-8 sm:-left-10 top-1 w-4 h-4 rounded-full bg-[#C9A24C] ring-4 ring-[#0B1024]" />
                <h3 className="text-lg font-semibold text-[#F1ECDE]">{item.title}</h3>
                <p className="mt-2 text-[#A9B0D6]">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <Reveal>
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="border border-[#C9A24C]/40 rounded-2xl px-8 py-14 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F1ECDE]">
              Start using Credify today
            </h2>
            <p className="text-[#A9B0D6] mt-4 text-lg max-w-xl mx-auto">
              A simpler way to hold and issue academic credentials.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/student/login"
                className="px-7 py-3 rounded-lg font-semibold bg-[#C9A24C] text-[#0B1024] hover:bg-[#dcb55e] transition-colors duration-200"
              >
                Student Login
              </Link>
              <Link
                to="/issuer/login"
                className="px-7 py-3 rounded-lg font-semibold border border-white/20 text-[#F1ECDE] hover:bg-white/10 transition-colors duration-200"
              >
                Issuer Login
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 py-8 text-center text-[#6F77A0]">
        <p className="font-serif text-[#F1ECDE]">Credify</p>
        <p className="text-sm mt-2">© 2026 Credify. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Landing;