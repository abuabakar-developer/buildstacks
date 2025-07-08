'use client';

import { motion } from 'framer-motion';
import { Check, Star, Users, Building2, Award } from 'lucide-react';
import Image from 'next/image';

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
    <section className={`relative py-16`}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)`,
          backgroundSize: "36px 36px"
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10 text-black text-xs md:text-sm font-medium mb-6">
            <Award className="w-4 h-4 text-black/70" />
            <span>Trusted by Leading Construction Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black/70 mb-6 font-plus-jakarta leading-tight max-w-3xl mx-auto text-center">
            Transform Your Construction Workflow
          </h1>

          <p className="text-black/70 text-lg mb-8 max-w-2xl mx-auto font-plus-jakarta">
            Streamline your projects with our comprehensive document management platform
          </p>
          <div className="flex items-center justify-center gap-4 text-black/70">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-black/70" />
              <span>AI-Powered Solutions</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-black/20"></div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-black/70" />
              <span>Enterprise Security</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-black/20"></div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-black/70" />
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
              <div className="text-3xl md:text-4xl font-bold text-black mb-2 font-plus-jakarta">{stat.number}</div>
              <div className="text-black/70 font-plus-jakarta">{stat.label}</div>
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
            <h2 className="text-3xl font-bold text-black mb-4 font-plus-jakarta">What Our Clients Say</h2>
            <p className="text-black/70 font-plus-jakarta">Trusted by construction professionals worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/5 border border-black/10 rounded-xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-black/80 mb-4 font-plus-jakarta">"{testimonial.quote}"</p>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-black font-plus-jakarta">{testimonial.author}</div>
                    <div className="text-black/70 text-sm font-plus-jakarta">{testimonial.role}</div>
                  </div>
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
