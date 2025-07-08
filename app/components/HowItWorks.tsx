'use client';

import { motion } from 'framer-motion';
import { 
  Check, ArrowRight, FileText, Users, Shield, Building2,
  Upload, Clock, Zap, FileCheck, CheckCircle
} from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Upload className="w-6 h-6" />,
      step: "01",
      title: "Upload & Organize",
      description: "Upload your construction documents, blueprints, and project files. Our AI automatically categorizes and organizes easy access.",
      color: "from-blue-500 to-blue-600",
      hoverColor: "from-blue-400 to-blue-500",
      duration: "2-3 minutes",
      durationIcon: <Clock className="w-4 h-4" />
    },
    {
      icon: <Users className="w-6 h-6" />,
      step: "02", 
      title: "Team Collaboration",
      description: "Invite your team members and stakeholders. Set permissions, assign tasks, and collaborate in real-time with instant notifications.",
      color: "from-green-500 to-green-600",
      hoverColor: "from-green-400 to-green-500",
      duration: "Instant setup",
      durationIcon: <Zap className="w-4 h-4" />
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      step: "03",
      title: "Review & Approve",
      description: "Streamlined approval workflows with digital signatures, automated routing, and comprehensive audit trails for compliance.",
      color: "from-purple-500 to-purple-600",
      hoverColor: "from-purple-400 to-purple-500",
      duration: "5-10 minutes",
      durationIcon: <CheckCircle className="w-4 h-4" />
    },
    {
      icon: <Zap className="w-6 h-6" />,
      step: "04",
      title: "Execute & Monitor",
      description: "Track project progress, monitor deadlines, and generate insights with advanced analytics and reporting tools.",
      color: "from-orange-500 to-orange-600",
      hoverColor: "from-orange-400 to-orange-500",
      duration: "Real-time",
      durationIcon: <Shield className="w-4 h-4" />
    }
  ];

  return (
    <section className="relative py-16">
      <div className="relative z-10 container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-black/5 border border-black/10 text-black text-sm font-medium mb-6">
            <Clock className="w-4 h-4 text-black/70" />
            <span className='font-xs font-semibold text-black/70'>Best Simple_Process</span>
          </div>
          <h2 className="text-3xl text-black/70 sm:text-4xl md:text-4xl font-extrabold text-black mb-6 font-plus-jakarta leading-tight max-w-4xl mx-auto text-center">
            How Its Works
          </h2>
          <p className="text-lg md:text-xl text-black/70 font-inter font-medium leading-relaxed mb-12 max-w-3xl mx-auto text-center tracking-wide">
            Get started in minutes, not days. Our streamlined process transforms how you manage construction projects.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="relative max-w-7xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 w-[85%] pointer-events-none z-0" style={{transform: 'translate(-50%, -50%)'}}>
            <div className="w-full h-1 rounded-full" style={{
              background: 'linear-gradient(90deg, rgba(100,116,139,0.2) 0%, rgba(30,41,59,0.5) 25%, rgba(30,41,59,0.5) 75%, rgba(100,116,139,0.2) 100%)',
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
                transition: { staggerChildren: 0.2 }
              }
            }}
            className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 z-10"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { y: 30, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
                }}
                className="group relative"
              >
                {/* Step Card */}
                <div className="bg-white rounded-3xl p-8 border border-gray-400 transition-all duration-500 h-full flex flex-col group-hover:bg-gray-50">
                  {/* Step Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`flex-shrink-0 inline-flex p-4 rounded-2xl transition-all duration-500 bg-gradient-to-br ${step.color} group-hover:bg-gradient-to-br ${step.hoverColor} text-white shadow-lg group-hover:shadow-xl group-hover:scale-110`}>
                      {step.icon}
                    </div>
                    <div className="text-4xl font-bold text-black/10 hover:text-black/20 font-plus-jakarta transition-colors duration-500">
                      {step.step}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold whitespace-nowrap text-black font-plus-jakarta leading-tight mb-4 transition-colors duration-500">
                      {step.title}
                    </h3>
                    <p className="text-black/70 font-semibold text-base leading-relaxed font-plus-jakarta transition-colors duration-500">
                      {step.description}
                    </p>
                  </div>

                  {/* Duration Badge - Fixed at Bottom */}
                  <div className="mt-6 pt-4 border-t border-black/10 transition-colors duration-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 inline-flex p-2 rounded-lg bg-black/5 border border-black/10 transition-all duration-500">
                          {step.durationIcon}
                        </div>
                        <div>
                          <p className="text-xs text-black/50 font-medium tracking-wider uppercase transition-colors duration-500">
                            Duration
                          </p>
                          <p className="text-sm md:text-base font-semibold text-black transition-colors duration-500">
                            {step.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-800 transition-colors duration-500"></div>
                        <span className="text-xs text-black/50 font-medium transition-colors duration-500">
                          Ready
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow connector for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <div className="w-8 h-8 bg-white rounded-full border border-black/10 shadow-md flex items-center justify-center group-hover:bg-black group-hover:border-white/20 transition-all duration-500">
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

export default HowItWorks; 