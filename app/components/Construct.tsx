'use client';

import { motion } from 'framer-motion';
import { Building2, FileText, Users, Shield, Award, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const Construct = () => {
  const features = [
    {
      icon: <Building2 className="w-6 h-6" />,
      title: 'Smart Project Management',
      description: 'AI-powered project tracking and resource allocation for construction teams',
      hoverColor: 'text-blue-600',
      hoverBgColor: 'bg-blue-50'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Document Automation',
      description: 'Automated document generation and version control for construction projects',
      hoverColor: 'text-green-600',
      hoverBgColor: 'bg-green-50'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Team Collaboration',
      description: 'Real-time collaboration tools for construction teams and stakeholders',
      hoverColor: 'text-purple-600',
      hoverBgColor: 'bg-purple-50'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Security & Compliance',
      description: 'Enterprise-grade security with industry compliance features',
      hoverColor: 'text-orange-600',
      hoverBgColor: 'bg-orange-50'
    },
  ];

  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <section className="relative">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)`,
          backgroundSize: "36px 36px"
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-2 py-2 rounded-full bg-black/5 border border-black/10 text-black text-sm font-medium mb-6 font-inter">
            <Award className="w-4 h-4 text-black/70" />
            <span className='font-xs font-semibold text-black/70'>Best Construction_Solutions</span>
          </div>
          <h2 className="text-3xl text-black/70 sm:text-4xl md:text-4xl font-extrabold text-black mb-6 font-plus-jakarta leading-tight max-w-3xl mx-auto text-center">
            Powerful Features
          </h2>

          <p className="text-lg md:text-xl text-black/70 font-inter font-medium leading-relaxed mb-12 max-w-2xl mx-auto text-center tracking-wide">
            Everything you need for Construction document management.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="relative max-w-7xl mx-auto mb-24">
          {/* Interconnecting Line: only on large screens, behind the cards, centered vertically */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 w-[70%] pointer-events-none z-0" style={{transform: 'translate(-50%, -50%)'}}>
            <div className="w-full h-1 rounded-full" style={{
              background: 'linear-gradient(90deg, rgba(100,116,139,0.35) 0%, rgba(30,41,59,0.7) 50%, rgba(100,116,139,0.35) 100%)',
              boxShadow: '0 1px 8px 0 rgba(30,41,59,0.10)'
            }}></div>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 z-10"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
                }}
                className="group relative"
              >
                <div 
                  className="bg-white rounded-3xl p-8 border border-gray-400 transition-all duration-500 flex flex-col h-full group-hover:bg-gray-50"
                  tabIndex={0}
                  onClick={() => setActiveCard(index)}
                >
                  {/* Icon */}
                  <div className="mb-6">
                    <div className={`flex-shrink-0 inline-flex p-4 rounded-2xl transition-all duration-500 bg-gray-300 text-gray-600 group-hover:${feature.hoverBgColor} group-hover:${feature.hoverColor} group-hover:scale-110`}>
                      {feature.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold text-black font-plus-jakarta leading-tight mb-4 transition-colors duration-500">
                      {feature.title}
                    </h3>
                    <p className="text-black/70 font-semibold text-base leading-relaxed font-inter transition-colors duration-500">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Blurred line highlight on click, only on large screens */}
                  <div className={`hidden lg:block pointer-events-none absolute left-1/2 -bottom-7 w-3/4 h-3 z-0 transition-all duration-500 ${activeCard === index ? 'blur-md opacity-80' : 'opacity-0'}`} style={{transform: 'translateX(-50%)'}}>
                    <div className="w-full h-full rounded-full" style={{
                      background: 'linear-gradient(90deg, rgba(59,130,246,0.25) 0%, rgba(30,64,175,0.45) 50%, rgba(59,130,246,0.25) 100%)',
                      filter: 'blur(6px)'
                    }}></div>
                  </div>
                </div>

                {/* Arrow connector for desktop */}
                {index < features.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <div className="w-8 h-8 bg-white rounded-full border border-gray-700 shadow-md flex items-center justify-center group-hover:bg-black group-hover:border-white/20 transition-all duration-500">
                      <ArrowRight className="w-4 h-4 text-black/40 group-hover:text-white/60 transition-colors duration-500" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Construct;


