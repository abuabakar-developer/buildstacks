'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Rocket } from 'lucide-react';
import { Inter, Poppins } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

const Hero = () => {
  return (
    <div className={`relative min-h-screen bg-slate-900 overflow-hidden ${inter.variable} ${poppins.variable}`}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-900"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: "40px 40px"
        }}></div>
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-32 md:pt-32 md:pb-40">
        <div className="max-w-7xl mx-auto">
          {/* Top Content Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto mb-16 md:mb-24"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 mb-8"
            >
              <span className="text-blue-400 font-medium text-sm">New Feature</span>
              <span className="text-slate-400 text-sm">•</span>
              <span className="text-slate-300 text-sm">AI-Powered Document Analysis</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-poppins tracking-tight"
            >
              Transform Your{' '}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                  Construction
                </span>
                <span className="absolute bottom-0 left-0 w-full h-3 bg-blue-500/20 -rotate-1"></span>
              </span>
              <br className="hidden lg:block" />
              Document Management
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-300 mb-12 font-inter max-w-2xl mx-auto"
            >
              Streamline your construction projects with our all-in-one document management platform. 
              Built for modern construction teams.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex justify-center"
            >
              <Link 
                href="#"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 text-[15px] hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Launch Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-200"></div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Bottom Image Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 p-2">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl"></div>
              <Image
                src="/consts.png"
                alt="Construction Document Management Platform"
                fill
                className="object-cover rounded-xl"
                priority
              />
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-3xl opacity-20"></div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-4 left-4 w-24 h-24 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl rotate-12"></div>
                <div className="absolute bottom-4 right-4 w-24 h-24 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl -rotate-12"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
