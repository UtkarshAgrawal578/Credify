import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ================= Scroll Reveal Component ================= */

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
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
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
    >
      {children}
    </div>
  );
}

/* ================= Landing Page ================= */

function Landing() {
  const features = [
    {
      title: "🎓 Student Wallet",
      desc: "Store all your academic credentials securely in one place. Access them anytime.",
    },
    {
      title: "🏫 Issuer Dashboard",
      desc: "Institutions issue tamper-proof digital certificates securely in seconds.",
    },
    {
      title: "✔ Instant Verification",
      desc: "Employers verify certificates instantly using Credential ID or QR Code.",
    },
  ];

  const steps = [
    {
      step: "1",
      title: "Issuer Creates Credential",
      desc: "College uploads certificate details and issues them digitally.",
    },
    {
      step: "2",
      title: "Student Stores Securely",
      desc: "Certificates are safely stored in the student’s wallet.",
    },
    {
      step: "3",
      title: "Verifier Checks Instantly",
      desc: "Employers verify authenticity instantly via QR or ID.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-black text-white overflow-hidden">

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-24 text-center relative">

        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full"></div>

        <Reveal>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Secure & Instant <br /> Academic Credential Verification
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-8 text-gray-300 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Credify lets students store certificates digitally, institutions issue them securely,
            and employers verify them instantly — all with trust and transparency.
          </p>
        </Reveal>

        <Reveal delay={400}>
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/student/dashboard"
              className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300"
            >
              Student Wallet
            </Link>

            <Link
              to="/issuer/login"
              className="px-8 py-3 rounded-xl font-semibold border border-blue-400 hover:bg-blue-600/20 hover:scale-105 transition-all duration-300"
            >
              Issuer Portal
            </Link>

            <Link
              to="/verify"
              className="px-8 py-3 rounded-xl font-semibold bg-white/10 backdrop-blur-md border border-gray-500 hover:bg-white/20 hover:scale-105 transition-all duration-300"
            >
              Verify Credential
            </Link>
          </div>
        </Reveal>
      </section>


      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10 pb-24">
        {features.map((feature, index) => (
          <Reveal key={index} delay={index * 200}>
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-blue-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </div>
          </Reveal>
        ))}
      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-28 text-center">

        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-16 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            How It Works
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((item, index) => (
            <Reveal key={index} delay={index * 250}>
              <div className="relative bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:scale-105 hover:border-cyan-400 transition-all duration-300">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-2 rounded-full font-bold text-lg shadow-lg">
                  {item.step}
                </div>

                <h3 className="text-xl font-semibold mt-8">{item.title}</h3>
                <p className="mt-3 text-gray-300">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* ================= CTA ================= */}
      <Reveal>
        <section className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 backdrop-blur-xl py-20 text-center border-t border-white/10">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Start Using Credify Today
          </h2>

          <p className="text-gray-300 mt-4 text-lg">
            Trusted, secure, and instant credential verification for the modern world.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/student/login"
              className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300"
            >
              Student Login
            </Link>

            <Link
              to="/issuer/login"
              className="px-8 py-3 rounded-xl font-bold border border-white/20 hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              Issuer Login
            </Link>

            <Link
              to="/verify"
              className="px-8 py-3 rounded-xl font-bold bg-white/10 backdrop-blur-md hover:bg-white/20 hover:scale-105 transition-all duration-300"
            >
              Verify Now
            </Link>
          </div>
        </section>
      </Reveal>


      {/* ================= FOOTER ================= */}
      <footer className="bg-black py-8 text-center text-gray-400 border-t border-white/10">
        <p className="font-semibold text-white">© 2025 Credify. All Rights Reserved.</p>
        <p className="text-sm mt-2">Built with MERN • TailwindCSS • Secure Credential Protocol</p>
      </footer>

    </div>
  );
}

export default Landing;
