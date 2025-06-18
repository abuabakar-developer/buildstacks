'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Building2, FileText, Users, Shield, 
  Mail, Phone, MapPin, ArrowRight,
  Facebook, Twitter, Linkedin, Instagram,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

const Footer = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const footerLinks = {
    product: [
      { name: 'Project Management', href: '#' },
      { name: 'Document Control', href: '#' },
      { name: 'Team Collaboration', href: '#' },
      { name: 'Security & Compliance', href: '#' },
      { name: 'Mobile App', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Partners', href: '#' },
    ],
    resources: [
      { name: 'Documentation', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'API Reference', href: '#' },
      { name: 'Status', href: '#' },
      { name: 'Terms of Service', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: '#', label: 'Facebook' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <footer className={`relative bg-slate-900 ${inter.variable} ${poppins.variable}`}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-900"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: "40px 40px"
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center space-x-2 text-white font-bold text-xl group mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-10 h-10 flex items-center justify-center rounded-md font-black text-white transform transition-transform duration-300 group-hover:scale-110">
                  <Building2 size={20} />
                </div>
                <span className="tracking-wide">BuildStack</span>
              </Link>
              <p className="text-slate-400 mb-6 max-w-md">
                Transform your construction workflow with our comprehensive suite of tools designed specifically for the construction industry.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-slate-400 hover:text-white transition-colors duration-200"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            <div className="space-y-8">
              <div>
                <button
                  onClick={() => toggleSection('product')}
                  className="flex items-center justify-between w-full text-white font-semibold mb-4 md:mb-6"
                >
                  Product
                  <span className="md:hidden">
                    {expandedSection === 'product' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>
                <div className={`space-y-3 ${expandedSection === 'product' ? 'block' : 'hidden md:block'}`}>
                  {footerLinks.product.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className="block text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <button
                  onClick={() => toggleSection('company')}
                  className="flex items-center justify-between w-full text-white font-semibold mb-4 md:mb-6"
                >
                  Company
                  <span className="md:hidden">
                    {expandedSection === 'company' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>
                <div className={`space-y-3 ${expandedSection === 'company' ? 'block' : 'hidden md:block'}`}>
                  {footerLinks.company.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className="block text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <button
                  onClick={() => toggleSection('resources')}
                  className="flex items-center justify-between w-full text-white font-semibold mb-4 md:mb-6"
                >
                  Resources
                  <span className="md:hidden">
                    {expandedSection === 'resources' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>
                <div className={`space-y-3 ${expandedSection === 'resources' ? 'block' : 'hidden md:block'}`}>
                  {footerLinks.resources.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className="block text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Newsletter Section */}
          <div className="bg-slate-800/50 rounded-xl p-6 md:p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-white text-xl font-semibold mb-2">Stay Updated</h3>
                <p className="text-slate-400">Subscribe to our newsletter for the latest updates and features.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-slate-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2">
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-sm">
                © {new Date().getFullYear()} BuildStack. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <Link href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                  Terms of Service
                </Link>
                <Link href="#" className="text-slate-400 hover:text-white transition-colors duration-200">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 



