'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, Building2, FileText,
  Users, Shield, Home, Briefcase, BookOpen,
  HelpCircle, LogIn, ArrowRight, Search, FileCheck,
  ClipboardList, HardHat, Settings, Bell, Rocket
} from 'lucide-react';
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', href: '/', icon: <Home size={18} /> },
    { name: 'Solutions', href: '#', hasDropdown: true, icon: <Briefcase size={18} /> },
    { name: 'Resources', href: '#', icon: <BookOpen size={18} /> },
    { name: 'About', href: '#', icon: <HelpCircle size={18} /> },
  ];

  const solutions = [
    { title: 'Project Management', description: 'Organize and track construction projects', icon: <Building2 size={18} />, href: '#' },
    { title: 'Document Control', description: 'Manage blueprints, permits, and specs', icon: <FileText size={18} />, href: '#' },
    { title: 'Team Collaboration', description: 'Coordinate across your entire team', icon: <Users size={18} />, href: '#' },
    { title: 'Security & Compliance', description: 'Ensure document safety and access', icon: <Shield size={18} />, href: '#' },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      y: '-100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-white font-bold text-xl group">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-10 h-10 flex items-center justify-center rounded-md font-black text-white transform transition-transform duration-300 group-hover:scale-110">
              <HardHat size={20} />
            </div>
            <span className="tracking-wide">BuildStack</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <button
                  onClick={() => link.hasDropdown && setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                  className="text-slate-200 hover:text-white flex items-center gap-1 transition-colors duration-200"
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />}
                </button>

                {/* Dropdown */}
                {link.hasDropdown && activeDropdown === link.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full mt-2 left-0 w-[32rem] bg-slate-800/95 backdrop-blur-md rounded-xl shadow-lg p-6 z-50"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {solutions.map((item) => (
                        <Link 
                          key={item.title} 
                          href={item.href} 
                          className="flex items-start gap-3 p-4 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group/item"
                        >
                          <div className="text-blue-500 group-hover/item:text-blue-400 transition-colors">{item.icon}</div>
                          <div>
                            <h4 className="text-white font-medium group-hover/item:text-blue-400 transition-colors">{item.title}</h4>
                            <p className="text-slate-400 text-sm">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 bg-slate-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            </div>

            <button className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>

            <Link 
              href="#" 
              className="text-slate-200 hover:text-white transition-colors duration-200 hover:scale-105 transform"
            >
              Log in
            </Link>
            <Link 
              href="#" 
              className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 text-[15px] hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Launch Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-200"></div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white z-50 p-2 hover:bg-slate-800/50 rounded-lg transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: '-100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="fixed inset-0 z-40 flex flex-col bg-slate-900/95 backdrop-blur-md"
            >
              {/* Top Bar with Search */}
              <div className="relative z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <Link href="/" className="flex items-center space-x-2 text-white font-bold text-xl">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-10 h-10 flex items-center justify-center rounded-md font-black text-white">
                        <HardHat size={20} />
                      </div>
                      <span className="tracking-wide">BuildStack</span>
                    </Link>
                    <button
                      className="text-white p-2 hover:bg-slate-800/50 rounded-lg transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <X size={26} />
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                  {navLinks.map((link) => (
                    <div key={link.name} className="space-y-2">
                      <button
                        onClick={() => {
                          if (link.hasDropdown) {
                            setActiveDropdown(activeDropdown === link.name ? null : link.name);
                          } else {
                            setIsOpen(false);
                          }
                        }}
                        className="w-full flex items-center justify-between text-white text-lg font-medium py-3 px-4 hover:bg-slate-800/50 rounded-lg transition-all duration-200 active:scale-[0.98]"
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-blue-500">{link.icon}</span>
                          {link.name}
                        </span>
                        {link.hasDropdown && (
                          <ChevronDown 
                            size={18} 
                            className={`${activeDropdown === link.name ? 'rotate-180' : ''} transition-transform duration-200`} 
                          />
                        )}
                      </button>

                      {link.hasDropdown && activeDropdown === link.name && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2 pl-4"
                        >
                          {solutions.map((sol) => (
                            <Link
                              key={sol.title}
                              href={sol.href}
                              className="flex items-center gap-3 p-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 active:scale-[0.98]"
                              onClick={() => setIsOpen(false)}
                            >
                              <span className="text-blue-500">{sol.icon}</span>
                              <div>
                                <p className="font-medium">{sol.title}</p>
                                <p className="text-sm text-slate-400">{sol.description}</p>
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions and CTA */}
              <div className="relative z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 py-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <button className="flex flex-col items-center gap-2 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 active:scale-[0.98]">
                      <Bell className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-white">Notifications</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 active:scale-[0.98]">
                      <Settings className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-white">Settings</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 active:scale-[0.98]">
                      <FileCheck className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-white">Documents</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <Link 
                      href="#" 
                      onClick={() => setIsOpen(false)} 
                      className="flex items-center justify-center gap-2 text-slate-200 hover:text-white text-lg py-3 px-4 hover:bg-slate-800/50 rounded-lg transition-all duration-200 active:scale-[0.98]"
                    >
                      <LogIn size={20} /> Log in
                    </Link>
                    <Link
                      href="#"
                      onClick={() => setIsOpen(false)}
                      className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200 active:scale-[0.98]"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
