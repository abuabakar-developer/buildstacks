'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, FileText, Shield, Users, Zap, Building2, ArrowRight, MessageCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const FAQ = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does the document version control work?",
      answer: "Our system automatically tracks all document changes, maintains version history, and allows you to revert to previous versions. Each change is timestamped and attributed to the team member who made it."
    },
    {
      question: "Can I set up automated document approvals?",
      answer: "Yes, you can create custom approval workflows with multiple levels of authorization. The system will automatically route documents to the appropriate stakeholders and track the approval status."
    },
    {
      question: "What security measures protect our construction documents?",
      answer: "We implement end-to-end encryption, role-based access control, and audit trails. All documents are backed up in multiple secure locations with regular security audits and compliance checks."
    },
    {
      question: "How can multiple team members work on the same document?",
      answer: "Our real-time collaboration features allow multiple team members to view and edit documents simultaneously. Changes are synchronized instantly, and you can see who's working on what in real-time."
    },
    {
      question: "Can I integrate with my existing construction software?",
      answer: "Absolutely! We offer API integrations with popular construction management software, accounting systems, and project management tools. Our team can also create custom integrations for your specific needs."
    },
    {
      question: "What kind of support do you offer?",
      answer: "We provide 24/7 customer support through multiple channels including live chat, email, and phone. Our dedicated support team includes construction industry experts who understand your specific challenges."
    }
  ];

  return (
    <section className="relative font-sans">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 1px, transparent 0)`,
          backgroundSize: "40px 40px"
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 lg:gap-16 items-start">
            {/* Left Side - FAQ Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3 space-y-3 md:space-y-4 order-1 lg:order-1"
            >
              {/* Mobile FAQ Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="lg:hidden mb-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10 text-black text-sm font-medium mb-4">
                  <CheckCircle className="w-4 h-4 text-black/70" />
                  <span className='tracking-wide text-xs font-semibold'>FAQ</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-black/60 mb-4 font-sans leading-tight">
                  Frequently Asked Questions
                </h2>
              </motion.div>

              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white border border-gray-400 rounded-xl md:rounded-2xl overflow-hidden hover:border-black/20 transition-all duration-300 group"
                >
                  <motion.button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-4 md:px-6 py-4 md:py-5 flex items-center justify-between text-left hover:bg-black/2 transition-colors duration-200 group"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-black/80 font-semibold text-base md:text-lg group-hover:text-black/80 transition-colors duration-200 font-sans pr-4 leading-relaxed">
                      {faq.question}
                    </span>
                    <div className="flex-shrink-0">
                      <ChevronDown
                        className={`w-4 h-4 md:w-5 md:h-5 text-black/40 transition-all duration-300 ${
                          openFaq === index ? 'transform rotate-180 text-black/70' : ''
                        }`}
                      />
                    </div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 md:px-6 pb-4 md:pb-5 text-black/70 font-sans font-semibold leading-relaxed text-sm md:text-base">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>

            {/* Right Side - Heading Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 order-2 lg:order-2"
            >
              <div className="mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10 text-black text-sm font-medium mb-6"
                >
                  <CheckCircle className="w-4 h-4 text-black/70" />
                  <span className='tracking-wider'>FAQ</span>
                </motion.div>
              </div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black/60 mb-6 font-sans leading-tight"
              >
                Everything<br />
               You <span className="bg-black text-white px-2 rounded">Need</span> <br />
                To Know
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-base text-black/70 font-semibold md:text-lg font-sans leading-relaxed max-w-lg mb-8"
              >
                Get clear and concise answers to all your questions about our features, pricing, and how it works.
              </motion.p>

              {/* Ask Us Anything Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  className="group relative px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-semibold rounded-full bg-black text-white hover:bg-black/90 transition-all duration-200 flex items-center justify-center gap-2 md:gap-3 border-0 outline-none focus:ring-4 focus:ring-black/10 shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Ask Us Anything
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;


