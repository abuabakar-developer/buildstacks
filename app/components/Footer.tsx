'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Building2, FileText, Users, Shield, 
  Mail, HardHat, Star, CheckCircle,
  BookOpen, HelpCircle, Facebook, Twitter, 
  Linkedin, Instagram, ChevronDown, ChevronUp, ArrowRight
} from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-plusjakarta',
});

const Footer = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const footerLinks = {
    product: [
      { name: 'Project Management', href: '#', icon: <Building2 className="w-4 h-4 text-gray-600" /> },
      { name: 'Document Control', href: '#', icon: <FileText className="w-4 h-4 text-gray-600" /> },
      { name: 'Team Collaboration', href: '#', icon: <Users className="w-4 h-4 text-gray-600" /> },
      { name: 'Security & Compliance', href: '#', icon: <Shield className="w-4 h-4 text-gray-600" /> },
    ],
    company: [
      { name: 'About Us', href: '#', icon: <Star className="w-4 h-4 text-gray-600" /> },
      { name: 'Careers', href: '#', icon: <Users className="w-4 h-4 text-gray-600" /> },
      { name: 'Contact', href: '#', icon: <Mail className="w-4 h-4 text-gray-600" /> },
    ],
    resources: [
      { name: 'Documentation', href: '#', icon: <BookOpen className="w-4 h-4 text-gray-600" /> },
      { name: 'Help Center', href: '#', icon: <HelpCircle className="w-4 h-4 text-gray-600" /> },
      { name: 'Status', href: '#', icon: <CheckCircle className="w-4 h-4 text-gray-600" /> },
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
    <footer className={`relative bg-gradient-to-tr from-blue-100 via-blue-50 to-white text-slate-900 border-t-0 shadow-inner ${plusJakarta.variable}`}>
      {/* Extra light SaaS Gradient Background for Footer */}
      {/* Footer Content */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-18">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Link href="/" className="inline-flex items-center space-x-3 text-black font-bold text-2xl group mb-6">
                  <div className="bg-black w-11 h-11 flex items-center justify-center rounded-lg text-white transform transition-all duration-300 group-hover:scale-110 shadow-md">
                    <HardHat size={22} />
                  </div>
                  <span className="tracking-wide font-semibold">BuildStack</span>
                </Link>
                <p className="text-black/80 mb-6 leading-relaxed tracking-wide font-semibold font-plusjakarta text-sm">
                  Transform your construction workflow with AI-powered document management.
                </p>
                {/* Social Links */}
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      className="text-gray-800 transition-all duration-200 p-2 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      aria-label={social.label}
                      whileHover={{ scale: 1.13 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([section, links], sectionIndex) => (
              <div key={section} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                >
                  <div
                    className="flex items-center justify-between w-full text-black font-semibold mb-4 transition-colors font-plusjakarta text-lg rounded cursor-pointer"
                  >
                    <span className="capitalize">{section}</span>
                  </div>
                  {/* Always show links below heading */}
                  <div className="space-y-3">
                    {links.map((link, index) => (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (sectionIndex * 0.1) + (index * 0.05) }}
                      >
                        <Link
                          href={link.href}
                          className="group flex items-center gap-3 text-black hover:text-gray-700 transition-all duration-200 py-1 font-plusjakarta text-base focus:outline-none rounded"
                        >
                          <div className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                            {link.icon}
                          </div>
                          <span className="text-sm font-semibold tracking-wide text-black/80">{link.name}</span>
                          <span className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 flex items-center">
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-7 border-t border-gray-500"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-black/80 text-sm font-semibold font-plusjakarta text-center sm:text-left">
                © {new Date().getFullYear()} BuildStack. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <Link
                  href="#"
                  className="text-black hover:text-gray-700 transition-colors duration-200 font-plusjakarta focus:outline-none focus:ring-2 focus:ring-blue-200 rounded group flex items-center"
                >
                  <span className="text-sm font-semibold tracking-wide text-black/70">Privacy</span>
                  <span className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 flex items-center">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                <Link
                  href="#"
                  className="text-black hover:text-gray-700 transition-colors duration-200 font-plusjakarta focus:outline-none focus:ring-2 focus:ring-blue-200 rounded group flex items-center"
                >
                  <span className="text-sm font-semibold tracking-wide text-black/70">Terms</span>
                  <span className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 flex items-center">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                <Link
                  href="#"
                  className="text-black hover:text-gray-700 transition-colors duration-200 font-plusjakarta focus:outline-none focus:ring-2 focus:ring-blue-200 rounded group flex items-center"
                >
                  <span className="text-sm font-semibold tracking-wide text-black/70">Security</span>
                  <span className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 flex items-center">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 



