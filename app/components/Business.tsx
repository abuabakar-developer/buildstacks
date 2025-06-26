'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Business = () => {
  return (
    <section className="relative font-sans text-black py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 1px, transparent 0)`,
          backgroundSize: "40px 40px"
        }}></div>
      </div>


      <div className="relative z-10 container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="order-1 lg:order-1 space-y-3 md:space-y-4"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-black/5 border border-black/10 text-black text-sm font-medium mb-4"
              >
                <CheckCircle className="w-4 h-4 text-black/70" />
                <span className='tracking-wide text-xs font-semibold'>Great Bussiness_Benefits</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black/60 mb-6 font-sans leading-tight text-left"
              >
                Everything Your <span className="bg-black text-white px-2 rounded">Construction</span> Needs
              </motion.h2>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-base md:text-lg text-black/70 font-sans font-semibold leading-relaxed max-w-lg mb-8 text-left"
              >
                Discover how BuildStack empowers your business to streamline operations, boost productivity, and stay ahead in the construction industry.
              </motion.p>
              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/book-demo"
                    className="group relative px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-semibold rounded-full bg-black text-white hover:bg-black/90 transition-all duration-200 flex items-center justify-center gap-2 md:gap-3 border-0 outline-none focus:ring-4 focus:ring-black/10 shadow-md hover:shadow-lg font-sans mt-4 md:mt-0"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Play className="w-4 h-4 md:w-5 md:h-5" />
                      See a Demo
                    </span>
                  </Link>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Side - Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-2 flex justify-center"
            >
              <div className="relative">
                <div className="relative rounded-xl md:rounded-2xl overflow-hidden bg-white" style={{ maxWidth: '600px', width: '100%' }}>
                  <Image
                    src="/construction-1.jpg"
                    alt="Construction Management"
                    width={700}
                    height={500}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                </div>
                {/* Floating stats card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 bg-black/5 backdrop-blur-md border border-black/10 rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-black/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 md:w-7 md:h-7 text-black" />
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-black font-sans">500+</div>
                      <div className="text-black/70 text-sm md:text-base font-sans">Projects Completed</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Business; 

