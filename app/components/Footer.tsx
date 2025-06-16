'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Github, ArrowUpRight, Mail, Phone, MapPin, Clock, Building2, FileText, Users, HardHat, Shield, Award, HelpCircle, BookOpen, MessageSquare, Headphones, ArrowRight } from 'lucide-react';
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

const Footer = () => {
  const footerLinks = {
    solutions: [
      { name: 'Project Management', href: '#' },
      { name: 'Construction Planning', href: '#' },
      { name: 'Document Control', href: '#' },
      { name: 'Cost Estimation', href: '#' },
      { name: 'BIM Integration', href: '#' },
    ],
    resources: [
      { name: 'Documentation', href: '#' },
      { name: 'API Reference', href: '#' },
      { name: 'Case Studies', href: '#' },
      { name: 'Webinars', href: '#' },
      { name: 'Construction Blog', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Partners', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'News', href: '#' },
    ],
    support: [
      { name: 'Help Center', href: '#', icon: <HelpCircle className="w-4 h-4" /> },
      { name: 'Knowledge Base', href: '#', icon: <BookOpen className="w-4 h-4" /> },
      { name: 'Community Forum', href: '#', icon: <MessageSquare className="w-4 h-4" /> },
      { name: '24/7 Support', href: '#', icon: <Headphones className="w-4 h-4" /> },
      { name: 'Training', href: '#', icon: <Users className="w-4 h-4" /> },
    ],
  };

  const socialLinks = [
    { icon: <Facebook className="w-4 h-4" />, href: '#', label: 'Facebook' },
    { icon: <Twitter className="w-4 h-4" />, href: '#', label: 'Twitter' },
    { icon: <Instagram className="w-4 h-4" />, href: '#', label: 'Instagram' },
    { icon: <Linkedin className="w-4 h-4" />, href: '#', label: 'LinkedIn' },
    { icon: <Github className="w-4 h-4" />, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className={`relative bg-slate-900 overflow-hidden ${inter.variable} ${poppins.variable}`}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: "40px 40px"
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-20">
        {/* Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 max-w-7xl mx-auto mb-20">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-6">
              <h3 className="text-white font-semibold font-poppins capitalize text-lg tracking-tight">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
         <Link
     href={link.href}
      className="text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group text-[15px] font-medium"
    >
     {'icon' in link && link.icon && (
        <span className="text-slate-500 group-hover:text-slate-300 transition-colors duration-200">
        {link.icon}
        </span>
        )}
          {link.name}
          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1" />
           </Link>

                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section with Logo, Social Icons, and Newsletter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left Side - Logo */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-3 group">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg transform rotate-45 transition-transform duration-300 group-hover:rotate-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg transform -rotate-45 transition-transform duration-300 group-hover:-rotate-90"></div>
                    <span className="absolute inset-0 flex items-center justify-center text-white font-poppins font-bold">
                      <HardHat size={24} />
                    </span>
                  </div>
                  <span className="text-white font-poppins text-2xl font-bold tracking-tight">BuildStack</span>
                </Link>
              </div>

              {/* Middle - Social Icons */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>

              {/* Right Side - Newsletter */}
              <div className="flex-1 w-full lg:w-auto">
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-2.5 bg-slate-800/50 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                    <button className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 text-[15px] hover:scale-105">
                      <span className="relative z-10 flex items-center gap-2">
                        Subscribe
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-200"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 pt-4 border-t border-slate-800/50"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm font-medium font-inter">
              © {new Date().getFullYear()} BuildStack. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link href="#" className="text-slate-400 hover:text-white text-sm font-medium font-inter transition-colors duration-200 hover:underline">
                Privacy Policy
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white text-sm font-medium font-inter transition-colors duration-200 hover:underline">
                Terms of Service
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white text-sm font-medium font-inter transition-colors duration-200 hover:underline">
                Cookie Policy
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white text-sm font-medium font-inter transition-colors duration-200 hover:underline">
                Security
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 



