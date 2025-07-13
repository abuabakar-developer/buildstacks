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
              className="relative p-3 rounded-xl hover:bg-black/5 active:bg-black/10 transition-all duration-300 group"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col justify-center items-center w-6 h-6 space-y-1.5">
                <span className={`block h-0.5 w-6 bg-black/80 transform transition-all duration-500 ease-out rounded-full
                  ${isOpen ? 'rotate-45 translate-y-2 bg-black' : 'group-hover:bg-black'}`}
                />
                <span className={`block h-0.5 w-5 bg-black/80 transform transition-all duration-300 ease-out rounded-full
                  ${isOpen ? 'opacity-0 scale-0' : 'group-hover:bg-black group-hover:w-6'}`}
                />
                <span className={`block h-0.5 w-6 bg-black/80 transform transition-all duration-500 ease-out rounded-full
                  ${isOpen ? '-rotate-45 -translate-y-2 bg-black' : 'group-hover:bg-black'}`}
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
            {/* Simple Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Clean Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 w-full sm:w-80 bg-white z-50 overflow-hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Simple Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <Link 
                    href="/" 
                    className="flex items-center space-x-2 text-black font-bold text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="bg-black w-8 h-8 text-white flex items-center justify-center rounded-md">
                      <HardHat size={16} />
                      </div>
                      <span className="font-semibold">BuildStack</span>
                    </Link>
                    <button
                      onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                    >
                    <X size={20} />
                    </button>
                </div>

                {/* Main Navigation */}
                <div className="flex-1 overflow-y-auto p-6">
                  <nav className="space-y-2">
                    {navLinks.map((link, index) => (
                      <motion.div 
                        key={link.name}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <button
                          onClick={() => {
                            if (link.onClick) {
                              link.onClick;
                              setIsOpen(false);
                            } else if (link.hasDropdown) {
                              setActiveDropdown(activeDropdown === link.name ? null : link.name);
                            } else {
                              router.push(link.href);
                              setIsOpen(false);
                            }
                          }}
                          className="w-full px-4 py-3 flex items-center justify-between text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors font-medium"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500">{link.icon}</span>
                            <span>{link.name}</span>
                          </div>
                          {link.hasDropdown && (
                            <ChevronDown 
                              size={16} 
                              className={`transition-transform duration-200 ${
                                activeDropdown === link.name ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                        </button>

                        {/* Simple Dropdown */}
                        {link.hasDropdown && activeDropdown === link.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-4 mt-2 space-y-1"
                          >
                              {builderFeatures[selectedBuilder as keyof typeof builderFeatures].map((item: { title: string; description: string; icon: React.ReactNode }) => (
                                <Link
                                  key={item.title}
                                href={item.title === 'Project Management' ? '/solutions/project-management' : 
                                      item.title === 'Team Collaboration' ? '/solutions/team-collaboration' :
                                      item.title === 'Document Control' ? '/solutions/document-control' :
                                      item.title === 'Security & Compliance' ? '/solutions/security-compliance' : '#'}
                                className="block px-4 py-3 text-sm text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                                  onClick={() => setIsOpen(false)}
                                  >
                                <div className="flex items-center gap-3">
                                  <span className="text-gray-400">{item.icon}</span>
                                  <div>
                                    <div className="font-medium">{item.title}</div>
                                    <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                                  </div>
                                  </div>
                              </Link>
                              ))}
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </nav>

                  {/* Quick Actions */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <Link
                        href="/book-demo"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <Rocket size={16} className="text-gray-500" />
                        <span className="font-medium">Get Demo</span>
                      </Link>
                      <Link
                        href="/pricing"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <HelpCircle size={16} className="text-gray-500" />
                        <span className="font-medium">Pricing</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Simple Action Buttons */}
                <div className="p-6 border-t border-gray-200 space-y-3">
                  {isAuthenticated === false && (
                  <button 
                      onClick={() => {
                        router.push('/signup');
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-3 text-center text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors font-medium border border-gray-200"
                  >
                    Sign up
                  </button>
                  )}
                  {isAuthenticated === true && (
                    <button 
                      onClick={() => {
                        router.push('/login');
                        setIsOpen(false);
                      }}
                      className="w-full px-4 py-3 text-center text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors font-medium border border-gray-200"
                    >
                      Sign in
                    </button>
                  )}
                  <Link
                    href="/book-demo"
                    className="block w-full px-4 py-3 bg-black text-white text-center rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                      Get a Demo
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
