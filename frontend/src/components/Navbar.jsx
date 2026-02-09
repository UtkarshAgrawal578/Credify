import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const navData = [
    {
      id: 'student',
      label: 'Student',
      links: [
        { name: 'Login', path: '/student/login' },
        { name: 'Dashboard', path: '/student/dashboard' }
      ]
    },
    {
      id: 'issuer',
      label: 'Issuer',
      links: [
        { name: 'Login', path: '/issuer/login' },
        { name: 'Dashboard', path: '/issuer/dashboard' }
      ]
    },
    {
      id: 'verifier',
      label: 'Verifier',
      links: [
        { name: 'Verify Credential', path: '/verify' },
        { name: 'Scan QR', path: '/scan' }
      ]
    }
  ];

  return (
    <nav className="bg-green-700/90 backdrop-blur-lg border-b border-green-500/30 text-white fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
              <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tighter italic">CREDIFY</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navData.map((item) => (
              <div key={item.id} className="relative group">
                <button className="flex items-center gap-1 py-2 px-3 font-semibold text-gray-100 hover:text-white transition">
                  {item.label}
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                
                {/* Desktop Dropdown */}
                <div className="absolute top-full left-0 w-48 bg-white rounded-xl shadow-2xl py-2 mt-1 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200">
                  {item.links.map((link) => (
                    <Link key={link.path} to={link.path} className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium">
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <button className="bg-orange-500 hover:bg-orange-600 px-6 py-2.5 rounded-full font-bold shadow-lg shadow-orange-900/20 transition-all active:scale-95">
              Get Started
            </button>
          </div>

          {/* Hamburger Menu Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`md:hidden bg-green-800 border-t border-green-600 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="p-4 space-y-2">
          {navData.map((item) => (
            <div key={item.id} className="rounded-xl overflow-hidden">
              <button 
                onClick={() => toggleDropdown(item.id)}
                className={`w-full flex justify-between items-center p-4 font-bold text-lg ${activeDropdown === item.id ? 'bg-green-900 text-orange-400' : 'text-white'}`}
              >
                {item.label}
                <svg className={`w-5 h-5 transition-transform ${activeDropdown === item.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              
              <div className={`transition-all duration-300 bg-green-900/50 ${activeDropdown === item.id ? 'max-h-40 py-2' : 'max-h-0'}`}>
                {item.links.map((link) => (
                  <Link key={link.path} to={link.path} className="block px-8 py-3 text-green-100 hover:text-white">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="pt-4 px-2">
            <button className="w-full bg-orange-500 py-4 rounded-xl font-bold text-white shadow-xl">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;