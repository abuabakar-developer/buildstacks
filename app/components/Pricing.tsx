'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Building2, Users, Shield, Award, ArrowRight, Star } from 'lucide-react';
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const features = {
    starter: [
      'Up to 5 projects',
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
      price: { monthly: 49, annual: 39 },
      features: features.starter,
      icon: <Building2 className="w-6 h-6" />,
      popular: false,
    },
    {
      name: 'Professional',
      description: 'Great for growing companies',
      price: { monthly: 99, annual: 79 },
      features: features.professional,
      icon: <Users className="w-6 h-6" />,
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'Tailored for enterprises',
      price: { monthly: 299, annual: 249 },
      features: features.enterprise,
      icon: <Shield className="w-6 h-6" />,
      popular: false,
    },
  ];

  return (
    <section className={`relative bg-slate-900 py-16 ${inter.variable} ${poppins.variable}`}>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium mb-3">
            <Star className="w-4 h-4" />
            <span>Most Popular Choice</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-poppins">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-400 text-lg mb-6">
            Choose your perfect plan. All plans include a 14-day free trial.
          </p>

          <div className="flex items-center justify-center gap-4 mb-6">
            <span className={`text-sm ${isAnnual ? 'text-slate-400' : 'text-white'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 bg-slate-800 rounded-full p-1"
            >
              <motion.div
                className="w-5 h-5 bg-blue-500 rounded-full"
                animate={{ x: isAnnual ? 28 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-white' : 'text-slate-400'}`}>
              Annual <span className="text-blue-500">(Save 20%)</span>
            </span>
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
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
              }}
              className={`relative rounded-2xl p-6 flex flex-col justify-between ${
                plan.popular
                  ? 'bg-gradient-to-b from-slate-800 to-slate-900 border border-blue-500/20'
                  : 'bg-slate-800/50 backdrop-blur-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="flex-1 flex flex-col">
                <div className="mb-4">
                  <div className="text-blue-500 mb-3">{plan.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-1 font-poppins">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-white">
                      ${isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className="text-slate-400 text-sm">/month</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-500 mt-1" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <button
                    className={`group relative w-full py-2.5 px-6 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90'
                        : 'bg-slate-700 text-white hover:bg-slate-600'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                    {plan.popular && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-200"></div>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-slate-400 mb-4">Have questions? We're here to help.</p>
          <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 transition duration-200">
            <Award className="w-5 h-5" />
            Contact Sales
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
