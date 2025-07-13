'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Blurred Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/construction-3.jpg"
          alt="Construction Background"
          fill
          className="object-cover blur-sm scale-125"
          priority
          sizes="100vw"
        />
        {/* Optimized overlay for better text readability */}
        <div className="absolute inset-0 bg-white/75"></div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.015) 1px, transparent 0)`,
          backgroundSize: "36px 36px"
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 pt-28 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
            
            {/* Left Side - Content */}
          <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-black/8 border border-black/15 mb-8 font-inter"
            >
                <span className="font-semibold text-black/75">AI Document Analysis</span>
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-black/65" />
            </motion.div>

              {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-plus-jakarta font-bold text-black/80 mb-6 md:mb-8 text-4xl md:text-5xl lg:text-6xl leading-tight"
              style={{
                lineHeight: 1.1,
              }}
            >
                Transform Your <span className="inline bg-black text-white px-3 md:px-4 rounded-lg">Construction</span><br />
              Docs Management
            </motion.h1>

              {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl text-black/75 font-inter font-medium md:leading-relaxed mb-12 max-w-2xl"
            >
              Streamline your construction projects with our all-in-one document management platform.
            </motion.p>

              {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link 
                href="/book-demo"
                  className="group relative w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl font-semibold rounded-full bg-black text-white hover:bg-black/90 transition-all duration-300 flex items-center justify-center gap-3 border-0 outline-none focus:ring-4 focus:ring-black/10 font-inter transform hover:scale-105 whitespace-nowrap"
                style={{
                  letterSpacing: '0.01em',
                  fontFamily: 'inherit',
                    minWidth: '180px',
                    maxWidth: '240px',
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Book a Demo
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </Link>
              <Link
                href="#pricing"
                  className="group relative w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl font-semibold rounded-full border-2 border-black text-black bg-white hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-3 outline-none focus:ring-4 focus:ring-black/10 font-inter transform hover:scale-105"
                style={{
                  letterSpacing: '0.01em',
                  fontFamily: 'inherit',
                    minWidth: '160px',
                    maxWidth: '220px',
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  View Pricing
                </span>
              </Link>
            </motion.div>
          </motion.div>

            {/* Right Side - Clear Image */}
          <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl lg:rounded-3xl overflow-hidden"
            >
              <Image
                src="/construction-3.jpg"
                alt="Construction Document Management Platform"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
              />
            </motion.div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
