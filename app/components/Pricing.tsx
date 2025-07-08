'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Building2, Users, Shield, Award, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const features = {
    starter: [
      'Up to 2 projects',
      'Basic project management',
      'Email support',
    ],
    professional: [
      'Up to 20 projects',
      'Advanced project management',
      'Priority support',
      'API access',
    ],
    enterprise: [
      'Unlimited projects',
      '24/7 support',
      'Custom integrations',
      'Dedicated manager',
    ],
  };

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small teams',
      price: { monthly: 0, annual: 0 },
      features: features.starter,
      icon: <Building2 className="w-6 h-6" />,
      popular: false,
    },
    {
      name: 'Professional',
      description: 'Great for growing companies',
      price: { monthly: 39, annual: 49 },
      features: features.professional,
      icon: <Users className="w-6 h-6" />,
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'Tailored for enterprises',
      price: { monthly: 79, annual: 99 },
      features: features.enterprise,
      icon: <Shield className="w-6 h-6" />,
      popular: false,
    },
  ];

  return (
    <section id="pricing" className={`relative py-16`}>
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)`,
          backgroundSize: "36px 36px"
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
          >
          <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-black/5 border border-black/10 text-black text-sm font-medium mb-6">
            <Star className="w-4 h-4 text-black/70" />
            <span className='font-xs font-semibold text-black/70'>Best Simple_Price</span>
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-4xl font-extrabold text-black/70 mb-4 font-plus-jakarta leading-tight"
          >
            Simple, Transparent Pricing
          </motion.h2>

          <p className="text-lg md:text-xl leading-relaxed font-medium tracking-wide text-black/70 font-inter mb-8">
            Choose your perfect plan. All plans include a 14-day free trial.
          </p>
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-black' : 'text-black/70'}`}>Monthly</span>
            <button
              type="button"
              className="relative w-14 h-7 bg-black/10 rounded-full p-1 flex items-center focus:outline-none"
              onClick={() => setIsAnnual(!isAnnual)}
              aria-label="Toggle annual pricing"
            >
              <motion.div
                className="w-5 h-5 bg-black rounded-full"
                animate={{ x: isAnnual ? 28 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-black' : 'text-black/70'}`}>Annual <span className="text-black font-semibold font-base">(Save 20%)</span></span>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 max-w-7xl mx-auto"
        >
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
              }}
              className={`relative rounded-2xl p-6 flex flex-col justify-between bg-white transition-all duration-300 ${
                plan.popular
                  ? 'border-2 border-gray-600 shadow-lg hover:shadow-xl hover:border-gray-600 scale-105'
                  : (idx === 0 || idx === 2
                      ? 'border border-gray-400'
                      : 'border border-black/10 hover:border-black/20')
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black text-white text-sm font-medium px-4 py-1 rounded-full shadow-md">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="flex-1 flex flex-col">
                <div className="mb-4">
                  <div className={`mb-3 ${plan.popular ? 'text-black' : 'text-black/70'}`}>{plan.icon}</div>
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={`text-xl font-bold mb-1 font-plus-jakarta ${plan.popular ? 'text-black' : 'text-black/80'}`}
                  >
                    {plan.name}
                  </motion.h3>
                  <p className="text-black/70 font-semibold text-base mb-4 font-inter">{plan.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-bold ${plan.popular ? 'text-black' : 'text-black/80'}`}>
                      ${isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className="text-black/60 text-base">/mo</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className={`w-4 h-4 mt-1 ${plan.popular ? 'text-black' : 'text-black/70'}`} />
                      <span className="text-black/80 text-sm font-inter tracking-wide font-semibold">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <button
                    className={`group relative w-full py-3 px-6 rounded-full text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 border outline-none focus:ring-4 focus:ring-black/10 ${
                      plan.popular 
                        ? 'bg-black text-white hover:bg-black/90 border-gray-600 shadow-md hover:shadow-lg' 
                        : (idx === 0 || idx === 2
                            ? 'bg-white text-black hover:bg-black/10 hover:text-black border-gray-400'
                            : 'bg-white text-black hover:bg-black/10 hover:text-black border-black/10 hover:border-black')
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Pricing;
