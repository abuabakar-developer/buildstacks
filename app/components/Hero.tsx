

'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-plusjakarta',
});

const inter = Inter({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-inter',
});

const Hero = () => {
  return (
    <div className={`relative min-h-screen overflow-hidden ${plusJakarta.variable} ${inter.variable}`}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)`,
          backgroundSize: "36px 36px"
        }}></div>
      </div>
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-28 md:pt-42 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Top Content Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 md:mb-20 lg:mb-24"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm bg-black/5 border border-black/10 mb-6 md:mb-10 shadow-sm font-inter"
            >
              <span className="font-xs font-semibold text-black/70">AI Document_Analysis</span>
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-black/60" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-plusjakarta font-bold sm:leading-[3rem] text-black/70 mb-4 md:mb-6 text-3xl md:text-4xl md:font-extrabold lg:text-6xl leading-loose"
              style={{
                lineHeight: 1.1,
                maxWidth: '100%',
              }}
            >
              Transform Your <span className="inline bg-black text-white px-2 md:px-3 rounded">Construction</span><br />
              Docs Management
            </motion.h1>


            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl sm:text-medium md:text-2xl text-black/70 font-inter font-semibold md:leading-normal mb-12 max-w-3xl mx-auto text-center"
            >
              Streamline your construction projects with our all-in-one document management platform.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4 px-4 sm:px-0"
            >
              <Link 
                href="/book-demo"
                className="group relative w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg font-semibold rounded-full bg-black text-white hover:bg-black/90 transition-all duration-200 flex items-center justify-center gap-2 md:gap-3 border-0 outline-none focus:ring-4 focus:ring-black/10 shadow-md hover:shadow-lg font-inter"
                style={{
                  letterSpacing: '0.01em',
                  fontFamily: 'inherit',
                  minWidth: '160px',
                  maxWidth: '220px',
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Book a Demo
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </Link>
              <Link
                href="#pricing"
                className="group relative w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg font-semibold rounded-full border border-black text-black bg-white hover:bg-black hover:text-white transition-all duration-200 flex items-center justify-center gap-2 md:gap-3 outline-none focus:ring-4 focus:ring-black/10 shadow-md hover:shadow-lg font-inter"
                style={{
                  letterSpacing: '0.01em',
                  fontFamily: 'inherit',
                  minWidth: '140px',
                  maxWidth: '200px',
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  View Pricing
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Bottom Image Section - Enhanced Width and Responsiveness */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8"
          >
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9] rounded-2xl lg:rounded-3xl overflow-hidden bg-white border border-black/10 p-2 sm:p-3 lg:p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Image
                src="/constas.png"
                alt="Construction Document Management Platform"
                fill
                className="object-cover rounded-xl lg:rounded-2xl"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 95vw, (max-width: 1024px) 90vw, (max-width: 1280px) 85vw, 80vw"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
