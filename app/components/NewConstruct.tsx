'use client';

import { motion } from 'framer-motion';
import { Award, CheckCircle, Shield, Users, Star } from 'lucide-react';
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

const NewConstruct = () => {
  const stats = [
    { number: '10K+', label: 'Active Projects' },
    { number: '98%', label: 'Client Satisfaction' },
    { number: '24/7', label: 'Support Available' },
    { number: '50+', label: 'Countries Served' }
  ];

  const testimonials = [
    {
      quote: "This platform has revolutionized how we manage our construction projects. The automation features alone have saved us countless hours.",
      author: "Sarah Johnson",
      role: "Project Manager, BuildRight Inc.",
      rating: 5
    },
    {
      quote: "The document management system is a game-changer. Everything is organized and easily accessible.",
      author: "Michael Chen",
      role: "Construction Director, UrbanBuild",
      rating: 5
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
    <section className={`relative bg-slate-900 py-16 ${inter.variable} ${poppins.variable}`}>
      {/* Background */}
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
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            <span>Trusted by Leading Construction Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 font-poppins leading-tight max-w-3xl mx-auto text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Next-Generation Construction <br />
            Management Platform
          </h1>

          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            Transform your construction workflow with AI-powered project management, automated documentation, and real-time collaboration tools.
          </p>
          <div className="flex items-center justify-center gap-4 text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              <span>AI-Powered Solutions</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600"></div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span>Enterprise Security</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600"></div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span>Team Collaboration</span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-24"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-poppins">{stat.number}</div>
              <div className="text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4 font-poppins">What Our Clients Say</h2>
            <p className="text-slate-400">Trusted by construction professionals worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-slate-400 text-sm">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewConstruct;
