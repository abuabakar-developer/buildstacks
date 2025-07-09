'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Building2, FileText, Users, Shield, HardHat,
  Facebook, Twitter, Linkedin, Instagram, Youtube,
  Mail, Phone, MapPin, ArrowRight, Send, ChevronDown,
  Star, BookOpen, HelpCircle, CheckCircle
} from 'lucide-react';

const Footer = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const footerLinks = {
    product: [
      { name: 'Project Management', href: '/solutions/project-management', icon: <Building2 className="w-4 h-4 text-gray-600" /> },
      { name: 'Document Control', href: '/solutions/document-control', icon: <FileText className="w-4 h-4 text-gray-600" /> },
      { name: 'Team Collaboration', href: '/solutions/team-collaboration', icon: <Users className="w-4 h-4 text-gray-600" /> },
      { name: 'Security & Compliance', href: '/solutions/security-compliance', icon: <Shield className="w-4 h-4 text-gray-600" /> },
    ],
    company: [
      { name: 'About Us', href: '/not-found', icon: <Star className="w-4 h-4 text-gray-600" /> },
      { name: 'Careers', href: '/not-found', icon: <Users className="w-4 h-4 text-gray-600" /> },
      { name: 'Contact', href: '/not-found', icon: <Mail className="w-4 h-4 text-gray-600" /> },
    ],
    resources: [
      { name: 'Documentation', href: '/not-found', icon: <BookOpen className="w-4 h-4 text-gray-600" /> },
      { name: 'Help Center', href: '/not-found', icon: <HelpCircle className="w-4 h-4 text-gray-600" /> },
      { name: 'Status', href: '/not-found', icon: <CheckCircle className="w-4 h-4 text-gray-600" /> },
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
    <footer className="relative bg-white/95 text-slate-900 border-t border-gray-200 shadow-none">
      {/* Extra light SaaS Gradient Background for Footer */}
      {/* Footer Content */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-6">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Link href="/" className="inline-flex items-center space-x-3 text-black font-bold text-2xl group mb-4">
                  <div className="bg-black w-10 h-10 flex items-center justify-center rounded-md text-white transform transition-all duration-300 group-hover:scale-110 shadow-sm">
                    <HardHat size={20} />
                  </div>
                  <span className="tracking-wide font-semibold">BuildStack</span>
                </Link>
                <p className="text-black/60 mb-4 leading-relaxed tracking-wide font-medium font-plus-jakarta text-sm">
                  AI-powered construction document management for modern teams.
                </p>
                {/* Social Links */}
                <div className="flex space-x-2">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      className="text-gray-400 hover:text-blue-500 transition-colors duration-200 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-100"
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
              <div key={section} className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                >
                  <div
                    className="flex items-center w-full text-black font-semibold mb-2 font-plus-jakarta text-base rounded"
                  >
                    <span className="capitalize text-black/80 tracking-wide">{section}</span>
                  </div>
                  {/* Always show links below heading */}
                  <div className="space-y-2">
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
                          className="group flex items-center gap-1.5 text-black/70 hover:text-black transition-colors duration-200 py-1 font-plus-jakarta text-sm focus:outline-none rounded relative"
                        >
                          <div className="text-gray-300 group-hover:text-blue-400 transition-colors duration-200">
                            {link.icon}
                          </div>
                          <span className="font-medium tracking-wide">{link.name}</span>
                          <span className="flex items-center ml-1.5 transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-1">
                            <ArrowRight className="w-3.5 h-3.5 text-black" />
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
            className="pt-6 border-t border-gray-200"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-black/60 text-xs font-medium font-plus-jakarta text-center sm:text-left">
                © {new Date().getFullYear()} BuildStack. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-xs">
                <Link
                  href="/not-found"
                  className="text-black/50 hover:text-black transition-colors duration-200 font-plus-jakarta focus:outline-none focus:ring-2 focus:ring-blue-100 rounded group flex items-center relative gap-1.5"
                >
                  <span>Privacy</span>
                  <span className="flex items-center ml-1.5 transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-1">
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </span>
                </Link>
                <Link
                  href="/not-found"
                  className="text-black/50 hover:text-black transition-colors duration-200 font-plus-jakarta focus:outline-none focus:ring-2 focus:ring-blue-100 rounded group flex items-center relative gap-1.5"
                >
                  <span>Terms</span>
                  <span className="flex items-center ml-1.5 transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-1">
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </span>
                </Link>
                <Link
                  href="/not-found"
                  className="text-black/50 hover:text-black transition-colors duration-200 font-plus-jakarta focus:outline-none focus:ring-2 focus:ring-blue-100 rounded group flex items-center relative gap-1.5"
                >
                  <span>Security</span>
                  <span className="flex items-center ml-1.5 transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-1">
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
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



