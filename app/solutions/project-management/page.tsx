"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, ClipboardList, Users, Shield, Calendar, FileText, ArrowRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import Image from "next/image";

const features = [
  {
    icon: <ClipboardList className="w-6 h-6" />,
    title: "Kanban Task Board",
    desc: "Visualize and manage project tasks with drag-and-drop simplicity.",
    hoverColor: "text-blue-600",
    hoverBgColor: "bg-blue-50"
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Timeline & Scheduling",
    desc: "Track milestones, deadlines, and dependencies with a modern timeline.",
    hoverColor: "text-green-600",
    hoverBgColor: "bg-green-50"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Team Collaboration",
    desc: "Assign roles, chat, and share updates in real time with your crew.",
    hoverColor: "text-purple-600",
    hoverBgColor: "bg-purple-50"
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Document Control",
    desc: "Securely store, share, and approve blueprints, permits, and specs.",
    hoverColor: "text-orange-600",
    hoverBgColor: "bg-orange-50"
  },
];

export default function ProjectManagementPage() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  return (
    <div className="relative min-h-screen bg-white font-plus-jakarta flex flex-col">
      <Navbar />
      <div className="flex-1">
        {/* Top Section: Two-column layout */}
        <section className="max-w-6xl mx-auto px-4 pt-24 pb-8 flex flex-col md:flex-row gap-8 items-center">
          {/* Left: Heading, content, button */}
          <div className="flex-1 w-full">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-5xl font-extrabold text-black mb-4 leading-tight drop-shadow-sm"
            >
              Construction Project Management, <span className="text-black">Reimagined</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-black/70 font-inter mb-8 max-w-2xl"
            >
              Streamline your construction projects with modern tools for planning, tracking, and collaboration. Built for teams who demand efficiency and clarity.
            </motion.p>
            <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white text-lg font-bold shadow hover:bg-black/90 transition-colors">
              Start Free Trial <ArrowRight size={20} />
            </Link>
          </div>
          {/* Right: Image */}
          <div className="flex-1 w-full flex justify-center items-center">
            <div className="relative w-full max-w-xs sm:max-w-sm aspect-[5/6] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 flex items-center justify-center mx-auto min-h-[180px] bg-white">
              <Image
                src="/construction-3.jpg"
                alt="Construction Project Management"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-2xl w-full h-full object-cover"
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </div>
        </section>
        {/* Feature Cards Section - visually separated */}
        <section className="relative max-w-7xl mx-auto mb-24 px-4 pt-4 pb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-black font-plus-jakarta mb-4">Key Features</h2>
            <p className="text-lg md:text-xl text-black/70 font-inter max-w-2xl mx-auto">Discover the essential tools for modern construction project management.</p>
          </div>
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
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 z-10"
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
        </section>
        {/* Kanban Preview Section */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-white/95 border border-black/10 rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl md:text-3xl font-extrabold text-black mb-6 font-plus-jakarta">Kanban Board Preview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* To Do */}
              <div className="bg-gray-100 rounded-xl p-4">
                <h3 className="font-bold text-black mb-3">To Do</h3>
                <ul className="space-y-3">
                  <li className="bg-white rounded-lg p-3 shadow flex items-center gap-2">
                    <Check className="w-4 h-4 text-black" /> Site Survey & Planning
                  </li>
                  <li className="bg-white rounded-lg p-3 shadow flex items-center gap-2">
                    <Check className="w-4 h-4 text-black" /> Permit Acquisition
                  </li>
                </ul>
              </div>
              {/* In Progress */}
              <div className="bg-gray-200 rounded-xl p-4">
                <h3 className="font-bold text-black mb-3">In Progress</h3>
                <ul className="space-y-3">
                  <li className="bg-white rounded-lg p-3 shadow flex items-center gap-2">
                    <Check className="w-4 h-4 text-black" /> Foundation Work
                  </li>
                  <li className="bg-white rounded-lg p-3 shadow flex items-center gap-2">
                    <Check className="w-4 h-4 text-black" /> Framing
                  </li>
                </ul>
              </div>
              {/* Done */}
              <div className="bg-gray-300 rounded-xl p-4">
                <h3 className="font-bold text-black mb-3">Done</h3>
                <ul className="space-y-3">
                  <li className="bg-white rounded-lg p-3 shadow flex items-center gap-2">
                    <Check className="w-4 h-4 text-black" /> Project Kickoff
                  </li>
                </ul>
              </div>
            </div>
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
            Ready to transform your construction workflow?
          </motion.h2>
          <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white text-lg font-bold shadow hover:bg-black/90 transition-colors">
            Get Started <ArrowRight size={20} />
          </Link>
        </section>
      </div>
    </div>
  );
} 