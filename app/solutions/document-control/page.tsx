"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Shield, Check, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import Image from "next/image";

const features = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Centralized Storage",
    desc: "All your blueprints, permits, and specs in one secure place.",
    hoverColor: "text-orange-600",
    hoverBgColor: "bg-orange-50"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Access Control",
    desc: "Granular permissions to keep sensitive documents safe.",
    hoverColor: "text-blue-600",
    hoverBgColor: "bg-blue-50"
  },
  {
    icon: <Check className="w-6 h-6" />,
    title: "Approval Workflows",
    desc: "Streamline reviews and approvals for faster project progress.",
    hoverColor: "text-green-600",
    hoverBgColor: "bg-green-50"
  },
];

export default function DocumentControlPage() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  return (
    <div className="relative min-h-screen bg-white font-plus-jakarta flex flex-col">
      <Navbar />
      <div className="flex-1">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-4 pt-24 pb-8 flex flex-col md:flex-row gap-8 items-center">
          {/* Left: Heading, content, button */}
          <div className="flex-1 w-full">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl font-extrabold text-black mb-4 leading-tight drop-shadow-sm"
            >
              Document Control, <span className="text-black">Simplified</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-black/70 font-inter mb-8 max-w-2xl"
            >
              Securely store, share, and manage all your construction documents. Keep your team aligned and your files protected with modern document control tools.
            </motion.p>
            <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white text-lg font-bold shadow hover:bg-black/90 transition-colors">
              Start Free Trial <ArrowRight size={20} />
            </Link>
          </div>
          {/* Right: Image */}
          <div className="flex-1 w-full flex justify-center items-center">
            <div className="relative w-full max-w-xs sm:max-w-sm aspect-[5/6] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 flex items-center justify-center mx-auto min-h-[180px] bg-white">
              <Image
                src="/file.svg"
                alt="Document Control"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-2xl w-full h-full object-cover"
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </div>
        </section>
        {/* Feature Cards Section */}
        <section className="relative max-w-7xl mx-auto mb-24 px-4 pt-4 pb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-black font-plus-jakarta mb-4">Key Features</h2>
            <p className="text-lg md:text-xl text-black/70 font-inter max-w-2xl mx-auto">Take control of your documents with these essential features.</p>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 z-10"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
                }}
                className="group relative"
              >
                <div
                  className="bg-white rounded-3xl p-8 border border-gray-400 transition-all duration-500 flex flex-col h-full group-hover:bg-gray-50 cursor-pointer"
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
                      {feature.desc}
                    </p>
                  </div>
                  {/* Blurred line highlight on click, only on large screens */}
                  <div className={`hidden lg:block pointer-events-none absolute left-1/2 -bottom-7 w-3/4 h-3 z-0 transition-all duration-500 ${activeCard === index ? 'blur-md opacity-80' : 'opacity-0'}`} style={{transform: 'translateX(-50%)'}}>
                    <div className="w-full h-full rounded-full" style={{
                      background: 'linear-gradient(90deg, rgba(251,146,60,0.25) 0%, rgba(251,191,36,0.45) 50%, rgba(251,146,60,0.25) 100%)',
                      filter: 'blur(6px)'
                    }}></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
        {/* Call to Action */}
        <section className="max-w-4xl mx-auto px-4 py-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-extrabold text-black mb-4 font-plus-jakarta"
          >
            Ready to take control of your documents?
          </motion.h2>
          <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white text-lg font-bold shadow hover:bg-black/90 transition-colors">
            Get Started <ArrowRight size={20} />
          </Link>
        </section>
      </div>
    </div>
  );
} 