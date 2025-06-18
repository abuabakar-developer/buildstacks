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
import { useRouter } from 'next/navigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

const Navbar = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Prevent horizontal scrolling
    document.body.style.overflowX = 'hidden';
    document.body.style.width = '100%';
    document.body.style.position = 'relative';
    
    if (isOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.left = '0';
      document.body.style.right = '0';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.left = '';
      document.body.style.right = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflowX = '';
    };
  }, [isOpen, isSearchOpen]);

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

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <div className="overflow-x-hidden w-full">
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0 z-50">
            <Link href="/" className="flex items-center space-x-2 text-white font-bold text-xl group">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-10 h-10 flex items-center justify-center rounded-md font-black text-white transform transition-transform duration-300 group-hover:scale-110">
                <HardHat size={20} />
              </div>
              <span className="tracking-wide">BuildStack</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
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

            <button 
              onClick={handleLoginClick}
              className="text-slate-200 hover:text-white transition-colors duration-200 hover:scale-105 transform"
            >
              Log in
            </button>

            <Link 
              href="/signup" 
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
          <div className="md:hidden flex items-center z-50">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2 text-white hover:bg-slate-800/50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ${
                  isOpen ? 'rotate-45 translate-y-2.5' : '-translate-y-1.5'
                }`}></span>
                <span className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ${
                  isOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`absolute h-0.5 w-6 bg-white transform transition-all duration-300 ${
                  isOpen ? '-rotate-45 translate-y-2.5' : 'translate-y-1.5'
                }`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40"
              onClick={() => setIsSearchOpen(false)}
            />

            {/* Search Content */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-md z-50 p-4 shadow-lg"
            >
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 pl-12 bg-slate-800/70 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 placeholder:text-slate-400"
                      autoFocus
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  </div>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors duration-200"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-900/95 backdrop-blur-md z-50 overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="p-6 border-b border-slate-800">
                  <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 text-white font-bold text-xl">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-10 h-10 flex items-center justify-center rounded-md">
                        <HardHat size={20} />
                      </div>
                      <span>BuildStack</span>
                    </Link>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors duration-200"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Mobile Search Bar */}
                  <div className="mt-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-12 bg-slate-800/70 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 placeholder:text-slate-400"
                      />
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-2">
                    {navLinks.map((link) => (
                      <div key={link.name}>
                        <button
                          onClick={() => link.hasDropdown && setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                          className="w-full px-4 py-4 flex items-center justify-between text-slate-200 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors duration-200"
                        >
                          <div className="flex items-center gap-3">
                            {link.icon}
                            <span className="text-lg">{link.name}</span>
                          </div>
                          {link.hasDropdown && (
                            <ChevronDown 
                              size={20} 
                              className={`transform transition-transform duration-200 ${
                                activeDropdown === link.name ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                        </button>

                        {/* Mobile Dropdown */}
                        {link.hasDropdown && activeDropdown === link.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 pr-4 py-2"
                          >
                            <div className="grid grid-cols-1 gap-2">
                              {solutions.map((item) => (
                                <Link
                                  key={item.title}
                                  href={item.href}
                                  className="group flex items-start gap-3 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-all duration-200"
                                  onClick={() => setIsOpen(false)}
                                >
                                  <div className="text-blue-500 group-hover:text-blue-400 transition-colors">
                                    {item.icon}
                                  </div>
                                  <div>
                                    <span className="text-white text-sm font-medium">{item.title}</span>
                                    <p className="text-slate-400 text-xs mt-1">{item.description}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="sticky bottom-0 p-6 bg-slate-900/95 backdrop-blur-sm border-t border-slate-800 space-y-3">
                  <button 
                    onClick={handleLoginClick}
                    className="block w-full px-4 py-4 text-center text-slate-200 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors duration-200 text-lg"
                  >
                    Log in
                  </button>
                  <Link
                    href="/signup"
                    className="group relative block w-full px-4 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-200 text-center text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Launch Now
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-200"></div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
