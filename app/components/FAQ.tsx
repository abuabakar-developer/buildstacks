'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, FileText, Shield, Users, Zap, Building2, ArrowRight, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

const FAQ = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(null); // ✅ FIXED HERE
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  const faqCategories = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Document Management",
      description: "Everything about managing your construction documents",
      faqs: [
        {
          question: "How does the document version control work?",
          answer: "Our system automatically tracks all document changes, maintains version history, and allows you to revert to previous versions. Each change is timestamped and attributed to the team member who made it."
        },
        {
          question: "Can I set up automated document approvals?",
          answer: "Yes, you can create custom approval workflows with multiple levels of authorization. The system will automatically route documents to the appropriate stakeholders and track the approval status."
        }
      ]
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Security & Compliance",
      description: "Keeping your construction data secure and compliant",
      faqs: [
        {
          question: "What security measures protect our construction documents?",
          answer: "We implement end-to-end encryption, role-based access control, and audit trails. All documents are backed up in multiple secure locations with regular security audits and compliance checks."
        },
        {
          question: "How do you ensure compliance with construction regulations?",
          answer: "Our platform is regularly updated to comply with the latest construction regulations. We maintain compliance documentation and provide tools to ensure your projects meet all regulatory requirements."
        }
      ]
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Team Collaboration",
      description: "Tools for seamless team collaboration",
      faqs: [
        {
          question: "How can multiple team members work on the same document?",
          answer: "Our real-time collaboration features allow multiple team members to view and edit documents simultaneously. Changes are synchronized instantly, and you can see who's working on what in real-time."
        },
        {
          question: "Can I set different access levels for team members?",
          answer: "Yes, you can create custom roles with specific permissions for viewing, editing, and approving documents. This ensures that team members only have access to the documents they need."
        }
      ]
    },
  ];

  const allFaqs = faqCategories.flatMap(category =>
    category.faqs.map(faq => ({
      ...faq,
      category: category.title
    }))
  );

  const filteredFaqs = allFaqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className={`relative bg-slate-900 py-16 ${inter.variable} ${poppins.variable}`}>
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: "40px 40px"
        }}></div>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium mb-6"
            >
              <Building2 className="w-4 h-4" />
              <span>Construction Document Management</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-poppins">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400">Find answers to common questions about our platform</p>
          </div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative mb-12"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            />
          </motion.div>

          {/* FAQs */}
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 hover:border-slate-600/50 transition-colors duration-200"
                onMouseEnter={() => setHoveredCategory(categoryIndex)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="px-6 py-4 border-b border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{
                        scale: hoveredCategory === categoryIndex ? 1.1 : 1,
                        rotate: hoveredCategory === categoryIndex ? 5 : 0
                      }}
                      transition={{ duration: 0.2 }}
                      className="text-blue-500"
                    >
                      {category.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold text-white font-poppins">{category.title}</h3>
                      <p className="text-slate-400 text-sm">{category.description}</p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-slate-700/50">
                  {category.faqs.map((faq, faqIndex) => (
                    <div key={faqIndex}>
                      <motion.button
                        onClick={() => setOpenFaq(openFaq === `${categoryIndex}-${faqIndex}` ? null : `${categoryIndex}-${faqIndex}`)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-800/70 transition-colors duration-200 group"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-white font-medium group-hover:text-blue-400 transition-colors duration-200">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 transition-all duration-200 ${
                            openFaq === `${categoryIndex}-${faqIndex}` ? 'transform rotate-180 text-blue-500' : ''
                          }`}
                        />
                      </motion.button>
                      <AnimatePresence>
                        {openFaq === `${categoryIndex}-${faqIndex}` && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 py-4 text-slate-400">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Support */}
          <div className="mt-12 text-center">
            <p className="text-slate-400 mb-4">Still have questions? We're here to help.</p>
            <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 text-[15px] hover:scale-105 mx-auto">
              <span className="relative z-10 flex items-center gap-2">
                Contact Support
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-200"></div>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;


