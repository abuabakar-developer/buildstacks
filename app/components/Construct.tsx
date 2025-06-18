'use client';

import { motion } from 'framer-motion';
import { Building2, FileText, Users, Shield, Award, ArrowRight, CheckCircle, Clock, BarChart3, Zap, ChevronRight, Star, Globe, Lock, ClipboardCheck, Settings, Database, Cloud, Code, Smartphone } from 'lucide-react';
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

const Construct = () => {
  const features = [
    {
      icon: <Building2 className="w-6 h-6" />,
      title: 'Smart Project Management',
      description: 'AI-powered project tracking and resource allocation for construction teams',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Document Automation',
      description: 'Automated document generation and version control for construction projects',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Team Collaboration',
      description: 'Real-time collaboration tools for construction teams and stakeholders',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Security & Compliance',
      description: 'Enterprise-grade security with industry compliance features',
      color: 'from-red-500 to-red-600'
    },
  ];

  const benefits = [
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: 'Increased Efficiency',
      description: 'Reduce project timelines by up to 30% with automated workflows'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Time Savings',
      description: 'Save 20+ hours per week on document management and approvals'
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Better ROI',
      description: 'Improve project profitability with optimized resource allocation'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Faster Delivery',
      description: 'Accelerate project completion with streamlined processes'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className={`relative bg-slate-900 py-8 ${inter.variable} ${poppins.variable}`}>
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

      <div className="relative z-10 container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            <span>Comprehensive Construction Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-poppins leading-tight max-w-3xl mx-auto text-center">
         Everything Need for Modern Construction Management
           </h2>

          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            Streamline your construction workflow with our comprehensive suite of tools designed specifically for the construction industry.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-24"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 border border-slate-700/50 hover:border-slate-600/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 font-poppins">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Construct;