'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, Building2, FileText,
  Users, Shield, Home, Briefcase, BookOpen,
  HelpCircle, LogIn, ArrowRight, Search, FileCheck,
  ClipboardList, HardHat, Settings, Bell, Rocket, Hammer, Wrench
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import React from 'react';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedBuilder, setSelectedBuilder] = useState<keyof typeof builderFeatures>('home-builder');
  const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);

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

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok)
      .then(ok => setIsAuthenticated(ok))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handlePricingClick = (e: React.MouseEvent) => {
    if (pathname === '/' && typeof window !== 'undefined') {
      e.preventDefault();
      const section = document.getElementById('pricing');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push('/#pricing');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: <Home size={18} /> },
    { name: 'Solutions', href: '/not-found', hasDropdown: true, icon: <Briefcase size={18} /> },
    { name: 'Pricing', href: '#pricing', icon: <HelpCircle size={18} />, onClick: handlePricingClick },
    { name: 'Resources', href: '/not-found', icon: <BookOpen size={18} /> },
  ];

  const builderTypes = [
    {
      id: 'home-builder',
      title: 'Home Builder',
      icon: <Home size={20} />,
    },
    {
      id: 'remodeler',
      title: 'Home Remodeler',
      icon: <Hammer size={20} />,
    },
    {
      id: 'specialty-contractor',
      title: 'Specialty Contractor',
      icon: <Wrench size={20} />,
    },
  ];

  const builderFeatures = {
    'home-builder': [
      { title: 'Project Management', description: 'Organize and track construction projects', icon: <Building2 size={18} /> },
      { title: 'Document Control', description: 'Manage blueprints, permits, and specs', icon: <FileText size={18} /> },
      { title: 'Team Collaboration', description: 'Coordinate across your entire team', icon: <Users size={18} /> },
      { title: 'Security & Compliance', description: 'Ensure document safety and access', icon: <Shield size={18} /> },
    ],
    'remodeler': [
      { title: 'Remodel Project Tools', description: 'Specialized tools for remodels', icon: <Hammer size={18} /> },
      { title: 'Document Control', description: 'Manage permits and plans', icon: <FileText size={18} /> },
      { title: 'Team Collaboration', description: 'Coordinate with subcontractors', icon: <Users size={18} /> },
      { title: 'Compliance', description: 'Stay up to code', icon: <Shield size={18} /> },
    ],
    'specialty-contractor': [
      { title: 'Trade Scheduling', description: 'Manage trade-specific schedules', icon: <ClipboardList size={18} /> },
      { title: 'Document Control', description: 'Specs and compliance docs', icon: <FileText size={18} /> },
      { title: 'Team Collaboration', description: 'Work with GCs and teams', icon: <Users size={18} /> },
      { title: 'Security', description: 'Protect sensitive info', icon: <Shield size={18} /> },
    ],
  };

  return (
    <div className="overflow-x-hidden w-full">
      <nav className={`fixed top-0 left-0 bg-white w-full z-50 border-b border-gray-400 transition-all duration-300 font-plus-jakarta ${
        isScrolled ? 'bg-white/60 backdrop-blur-md border-b shadow-sm border-white/20' : 'bg-transparent'
      }`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0 z-50">
            <Link href="/" className="flex items-center space-x-2 text-black font-bold text-xl group cursor-pointer">
              <div className="bg-black w-10 h-10 flex items-center justify-center rounded-md font-black text-white transform transition-transform duration-300 group-hover:scale-110">
                <HardHat size={20} />
              </div>
              <span className="tracking-wide font-semibold">BuildStack</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                {link.onClick ? (
                  <button
                    onClick={link.onClick}
                    className="text-black/70 hover:text-black flex items-center gap-1 transition-colors duration-200 font-inter font-semibold text-base tracking-wide cursor-pointer bg-transparent border-none outline-none"
                    style={{ background: 'none' }}
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />}
                  </button>
                ) : (
                  <button
                    onClick={() => link.hasDropdown && setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                    className="text-black/70 hover:text-black flex items-center gap-1 transition-colors duration-200 font-inter font-semibold text-base tracking-wide cursor-pointer bg-transparent border-none outline-none"
                    style={{ background: 'none' }}
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />}
                  </button>
                )}

                {/* Dropdown */}
                {link.hasDropdown && activeDropdown === link.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-full mt-2 left-0 w-[38rem] bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-black/10 p-0 flex z-50 min-h-[18rem]"
                  >
                    {/* Left Panel: Builder Types */}
                    <div className="w-56 py-6 px-4 border-r border-black/10 flex flex-col gap-2 bg-white/90">
                      <div className="mb-4 text-xs font-bold text-black/60 tracking-widest uppercase font-inter text-left">Builder Type</div>
                      {builderTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedBuilder(type.id as keyof typeof builderFeatures)}
                          className={`flex items-center gap-3 px-3 py-3 rounded-lg font-inter font-semibold text-base text-left transition-all duration-200 border-2 ${selectedBuilder === type.id ? 'border-black bg-black/5 text-black' : 'border-transparent text-black/70 hover:bg-black/5 hover:text-black'} focus:outline-none`}
                          style={{ boxShadow: selectedBuilder === type.id ? '0 2px 8px 0 rgba(0,0,0,0.04)' : undefined }}
                        >
                          <span className="text-black/80">{type.icon}</span>
                          <span>{type.title}</span>
                        </button>
                      ))}
                    </div>
                    {/* Right Panel: Features */}
                    <div className="flex-1 py-6 px-6 grid grid-cols-2 gap-4">
                      {builderFeatures[selectedBuilder as keyof typeof builderFeatures].map((item: { title: string; description: string; icon: React.ReactNode }, idx: number) => (
                        item.title === 'Project Management' ? (
                          <Link
                            key={idx}
                            href="/solutions/project-management"
                            className="flex items-start gap-3 p-4 rounded-lg hover:bg-blue-50 transition-all duration-200 group/item font-inter cursor-pointer border border-transparent hover:border-blue-200"
                            style={{ textDecoration: 'none' }}
                            onClick={() => setActiveDropdown(null)} // Close dropdown on click
                          >
                            <div className="text-black group-hover/item:text-blue-700 transition-colors">{item.icon}</div>
                            <div>
                              <h4 className="text-black font-semibold group-hover/item:text-blue-700 transition-colors font-inter text-base">{item.title}</h4>
                              <p className="text-black/60 text-sm font-inter font-semibold">{item.description}</p>
                            </div>
                          </Link>
                        ) : item.title === 'Team Collaboration' ? (
                          <Link
                            key={idx}
                            href="/solutions/team-collaboration"
                            className="flex items-start gap-3 p-4 rounded-lg hover:bg-purple-50 transition-all duration-200 group/item font-inter cursor-pointer border border-transparent hover:border-purple-200"
                            style={{ textDecoration: 'none' }}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="text-black group-hover/item:text-purple-700 transition-colors">{item.icon}</div>
                            <div>
                              <h4 className="text-black font-semibold group-hover/item:text-purple-700 transition-colors font-inter text-base">{item.title}</h4>
                              <p className="text-black/60 text-sm font-inter font-semibold">{item.description}</p>
                            </div>
                          </Link>
                        ) : item.title === 'Document Control' ? (
                          <Link
                            key={idx}
                            href="/solutions/document-control"
                            className="flex items-start gap-3 p-4 rounded-lg hover:bg-orange-50 transition-all duration-200 group/item font-inter cursor-pointer border border-transparent hover:border-orange-200"
                            style={{ textDecoration: 'none' }}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="text-black group-hover/item:text-orange-700 transition-colors">{item.icon}</div>
                            <div>
                              <h4 className="text-black font-semibold group-hover/item:text-orange-700 transition-colors font-inter text-base">{item.title}</h4>
                              <p className="text-black/60 text-sm font-inter font-semibold">{item.description}</p>
                            </div>
                          </Link>
                        ) : item.title === 'Security & Compliance' ? (
                          <Link
                            key={idx}
                            href="/solutions/security-compliance"
                            className="flex items-start gap-3 p-4 rounded-lg hover:bg-green-50 transition-all duration-200 group/item font-inter cursor-pointer border border-transparent hover:border-green-200"
                            style={{ textDecoration: 'none' }}
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="text-black group-hover/item:text-green-700 transition-colors">{item.icon}</div>
                            <div>
                              <h4 className="text-black font-semibold group-hover/item:text-green-700 transition-colors font-inter text-base">{item.title}</h4>
                              <p className="text-black/60 text-sm font-inter font-semibold">{item.description}</p>
                            </div>
                          </Link>
                        ) : (
                        <div key={idx} className="flex items-start gap-3 p-4 rounded-lg hover:bg-black/5 transition-all duration-200 group/item font-inter cursor-pointer">
                          <div className="text-black group-hover/item:text-black/80 transition-colors">{item.icon}</div>
                          <div>
                            <h4 className="text-black font-semibold group-hover/item:text-black/80 transition-colors font-inter text-base">{item.title}</h4>
                            <p className="text-black/60 text-sm font-inter font-semibold">{item.description}</p>
                          </div>
                        </div>
                        )
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated === false && (
            <button 
              onClick={() => router.push('/signup')}
              className="text-black/70 hover:text-black transition-colors duration-200 hover:scale-105 transform font-inter font-semibold text-base cursor-pointer"
            >
              Sign up
            </button>
            )}
            {isAuthenticated === true && (
              <button 
                onClick={() => router.push('/login')}
                className="text-black/70 hover:text-black transition-colors duration-200 hover:scale-105 transform font-inter font-semibold text-base cursor-pointer"
              >
                Sign in
              </button>
            )}
            <Link 
              href="/book-demo" 
              className="group relative px-6 py-2.5 bg-black text-white rounded-full font-inter font-semibold hover:bg-black/90 transition-all duration-200 flex items-center justify-center gap-2 text-base hover:scale-105 shadow-md cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get a Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center z-50">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2.5 rounded-lg hover:bg-black/5 active:bg-black/10 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col justify-center items-center w-6 h-6 space-y-1.5">
                <span className={`block h-0.5 w-6 bg-black/80 transform transition-all duration-300 ease-out 
                  ${isOpen ? 'rotate-45 translate-y-2' : ''}`}
                />
                <span className={`block h-0.5 w-5 bg-black/80 transform transition-all duration-200 ease-out
                  ${isOpen ? 'opacity-0' : ''}`}
                />
                <span className={`block h-0.5 w-6 bg-black/80 transform transition-all duration-300 ease-out
                  ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

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
              className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white/95 backdrop-blur-md z-50 overflow-y-auto font-inter"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="p-6 border-b border-black/10">
                  <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 text-black font-bold text-xl cursor-pointer">
                      <div className="bg-black w-10 h-10 text-white flex items-center justify-center rounded-md">
                        <HardHat size={20} />
                      </div>
                      <span className="font-semibold">BuildStack</span>
                    </Link>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-black/60 hover:text-black hover:bg-black/5 rounded-lg transition-colors duration-200 cursor-pointer"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-2">
                    {navLinks.map((link) => (
                      <div key={link.name}>
                        <button
                          onClick={() => link.hasDropdown && setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                          className="w-full px-4 py-4 flex items-center justify-between text-black/70 hover:text-black hover:bg-black/5 rounded-xl transition-colors duration-200 font-inter font-semibold text-base cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            {link.icon}
                            <span className="text-base font-inter font-semibold">{link.name}</span>
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
                              {builderFeatures[selectedBuilder as keyof typeof builderFeatures].map((item: { title: string; description: string; icon: React.ReactNode }) => (
                                item.title === 'Project Management' ? (
                                <Link
                                  key={item.title}
                                    href="/solutions/project-management"
                                    className="group flex items-start gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-200 font-inter cursor-pointer border border-transparent hover:border-blue-200"
                                  onClick={() => setIsOpen(false)}
                                  >
                                    <div className="text-black group-hover:text-blue-700 transition-colors">
                                      {item.icon}
                                    </div>
                                    <div>
                                      <span className="text-black text-base font-inter font-semibold group-hover:text-blue-700">{item.title}</span>
                                      <p className="text-black/60 text-sm mt-1 font-inter font-semibold">{item.description}</p>
                                    </div>
                                  </Link>
                                ) : (
                                  <div
                                    key={item.title}
                                    className="group flex items-start gap-3 p-4 bg-black/5 rounded-xl hover:bg-black/10 transition-all duration-200 font-inter cursor-pointer"
                                >
                                  <div className="text-black group-hover:text-black/80 transition-colors">
                                    {item.icon}
                                  </div>
                                  <div>
                                    <span className="text-black text-base font-inter font-semibold">{item.title}</span>
                                    <p className="text-black/60 text-sm mt-1 font-inter font-semibold">{item.description}</p>
                                  </div>
                                  </div>
                                )
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="sticky bottom-0 p-6 bg-white/95 backdrop-blur-sm border-t border-black/10 space-y-3">
                  {isAuthenticated === false && (
                  <button 
                    onClick={() => router.push('/signup')}
                    className="block w-full px-4 py-4 text-center text-black/70 hover:text-black hover:bg-black/5 rounded-xl transition-colors duration-200 text-base font-inter font-semibold cursor-pointer"
                  >
                    Sign up
                  </button>
                  )}
                  {isAuthenticated === true && (
                    <button 
                      onClick={() => router.push('/login')}
                      className="block w-full px-4 py-4 text-center text-black/70 hover:text-black hover:bg-black/5 rounded-xl transition-colors duration-200 text-base font-inter font-semibold cursor-pointer"
                    >
                      Sign in
                    </button>
                  )}
                  <Link
                    href="/book-demo"
                    className="group relative block w-full px-4 py-4 bg-black text-white rounded-full font-inter font-semibold hover:bg-black/90 transition-all duration-200 text-center text-base shadow-md cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Get a Demo
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
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
