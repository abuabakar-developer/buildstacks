"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Home,
  Hammer,
  Building2,
  Wrench,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  User,
  Mail,
  Building,
  Globe,
  Loader2,
} from "lucide-react";
import { Inter, Poppins } from "next/font/google";
import { toast } from "react-hot-toast";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const businessTypes = [
  {
    id: "residential-home",
    title: "Residential Home Builder",
    description: "Build new homes and residential properties",
    icon: <Home className="w-6 h-6" />,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "residential-remodeler",
    title: "Residential Remodeler",
    description: "Renovate and remodel existing homes",
    icon: <Hammer className="w-6 h-6" />,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "commercial-contractor",
    title: "Commercial General Contractor",
    description: "Handle commercial construction projects",
    icon: <Building2 className="w-6 h-6" />,
    color: "from-green-500 to-green-600",
  },
  {
    id: "specialty-contractor",
    title: "Specialty/Trade Contractor",
    description: "Specialized construction services",
    icon: <Wrench className="w-6 h-6" />,
    color: "from-orange-500 to-orange-600",
  },
];

const volumeRanges = [
  { value: "0-100k", label: "$0 - $100K", description: "Small projects" },
  { value: "100k-500k", label: "$100K - $500K", description: "Medium projects" },
  { value: "500k-1m", label: "$500K - $1M", description: "Large projects" },
  { value: "1m-5m", label: "$1M - $5M", description: "Major projects" },
  { value: "5m-10m", label: "$5M - $10M", description: "Enterprise projects" },
  { value: "10m+", label: "$10M+", description: "Large enterprise" },
];

const bodyTextClass = "font-inter text-sm font-semibold text-gray-700";

export default function BookDemoPage() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [selectedVolume, setSelectedVolume] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    country: "",
  });

  const handleNext = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(step + 1);
    }, 500);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/book-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          businessType: selectedType,
          constructionVolume: selectedVolume,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to book a demo. Please try again.");
      }
      toast.success("Demo booked! We'll be in touch soon.");
      setStep(1);
      setSelectedType("");
      setSelectedVolume("");
      setFormData({ firstName: "", lastName: "", email: "", company: "", country: "" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            s === step ? "bg-blue-500 text-white" :
            s < step ? "bg-green-500 text-white" : "bg-slate-700 text-slate-400"
          }`}>
            {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
          </div>
          {s < 3 && (
            <div className={`w-12 h-0.5 ${
              s < step ? "bg-green-500" : "bg-slate-700"
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  // Modern loading spinner
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"
        aria-label="Loading"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <div className="text-blue-500 font-semibold text-lg">Loading...</div>
    </div>
  );

  return (
    <div className={`min-h-screen flex mt-14 ${inter.variable} ${poppins.variable}`}>
      {/* Left Side - Book a Demo Info (matching signup promo bg) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center px-16 py-20 relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white shadow-2xl">
        {/* Animated Background Elements (copied from signup promo) */}
        <div className="absolute inset-0">
          {/* Gradient Mesh */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          {/* Floating Orbs */}
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-green-500/20 rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-40 right-20 w-24 h-24 bg-blue-500/20 rounded-full blur-3xl"
            animate={{ x: [0, -25, 0], y: [0, 15, 0], scale: [1, 0.9, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div
            className="absolute bottom-20 left-1/4 w-20 h-20 bg-yellow-500/20 rounded-full blur-3xl"
            animate={{ x: [0, 20, 0], y: [0, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-lg text-left relative z-10"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow-2xl font-poppins tracking-tight">Book a Personalized Demo</h1>
          <p className="text-lg md:text-xl mb-8 font-poppins opacity-90 font-medium">
            See how <span className="text-blue-300 font-bold">BuildStack</span> can transform your construction document management. Our team will walk you through the platform, answer your questions, and show you how to streamline your workflow.
          </p>
          <div className="flex justify-center my-6">
            <Image
              src="/demo.png"
              alt="Demo preview"
              width={600}
              height={280}
              className="rounded-xl shadow-lg object-contain w-full max-w-md"
              priority
            />
          </div>
          <div className="text-sm opacity-80">Already have an account? <Link href="/login" className="underline hover:text-blue-200">Sign in</Link></div>
        </motion.div>
      </div>
      {/* Right Side - Multi-step Form (black/white theme, matching signup) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-xl z-10 flex flex-col h-full justify-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-2 font-poppins tracking-tight">Get Started</h2>
            <p className={bodyTextClass + " text-gray-700 font-medium"}>Answer a few quick questions and we'll schedule your personalized demo</p>
          </motion.div>
          {renderStepIndicator()}
          <div className="rounded-2xl border border-gray-200 p-6 md:p-10 shadow-lg bg-white max-w-lg mx-auto flex-1 flex flex-col justify-center">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-bold text-black mb-2">What best describes your business?</h3>
                      <p className={bodyTextClass}>Select the option that best matches your construction business</p>
                    </div>
                    {/* Responsive business type options */}
                    <div>
                      {/* Large screens: vertical radio list */}
                      <div className="hidden md:block space-y-3">
                        {businessTypes.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setSelectedType(type.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg border-2 transition-all duration-200 text-left focus:outline-none ${selectedType === type.id ? 'border-black bg-black/5' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}
                          >
                            <span className={`p-2 rounded-lg bg-gradient-to-r ${type.color} text-white`}>{type.icon}</span>
                            <span className="flex-1">
                              <span className="block font-semibold text-base text-black">{type.title}</span>
                              <span className="block text-xs text-gray-600">{type.description}</span>
                            </span>
                            <span className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${selectedType === type.id ? 'border-black' : 'border-gray-300'}`}>{selectedType === type.id && <span className="w-3 h-3 bg-black rounded-full"></span>}</span>
                          </button>
                        ))}
                      </div>
                      {/* Small screens: card style */}
                      <div className="md:hidden grid grid-cols-1 gap-4">
                        {businessTypes.map((type) => (
                          <motion.button
                            key={type.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedType(type.id)}
                            className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${selectedType === type.id ? 'border-black bg-black/5' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`p-3 rounded-lg bg-gradient-to-r ${type.color} text-white`}>{type.icon}</div>
                              <div className="text-left">
                                <h4 className="font-semibold mb-1 text-black">{type.title}</h4>
                                <p className={bodyTextClass}>{type.description}</p>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end items-center mt-8">
                      <button
                        onClick={handleNext}
                        disabled={!selectedType || isLoading}
                        className="group relative px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-black/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          Next
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-bold text-black mb-2">What is your average construction volume?</h3>
                      <p className={bodyTextClass}>Select the range that best represents your annual construction volume</p>
                    </div>
                    {/* Responsive volume options */}
                    <div>
                      {/* Large screens: vertical radio list */}
                      <div className="hidden md:block space-y-3">
                        {volumeRanges.map((range) => (
                          <button
                            key={range.value}
                            type="button"
                            onClick={() => setSelectedVolume(range.value)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg border-2 transition-all duration-200 text-left focus:outline-none ${selectedVolume === range.value ? 'border-black bg-black/5' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}
                          >
                            <span className="p-2 rounded-lg bg-gray-100"><DollarSign className="w-6 h-6 text-black" /></span>
                            <span className="flex-1">
                              <span className="block font-semibold text-base text-black">{range.label}</span>
                              <span className="block text-xs text-gray-600">{range.description}</span>
                            </span>
                            <span className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${selectedVolume === range.value ? 'border-black' : 'border-gray-300'}`}>{selectedVolume === range.value && <span className="w-3 h-3 bg-black rounded-full"></span>}</span>
                          </button>
                        ))}
                      </div>
                      {/* Small screens: card style */}
                      <div className="md:hidden grid grid-cols-1 gap-4">
                        {volumeRanges.map((range) => (
                          <motion.button
                            key={range.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedVolume(range.value)}
                            className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${selectedVolume === range.value ? 'border-black bg-black/5' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="p-3 rounded-lg bg-gray-100"><DollarSign className="w-6 h-6 text-black" /></div>
                              <div className="text-left">
                                <h4 className="font-semibold mb-1 text-black">{range.label}</h4>
                                <p className={bodyTextClass}>{range.description}</p>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-8">
                      <button
                        onClick={handlePrev}
                        type="button"
                        className="group flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-black transition-all duration-200 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                        Previous
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={!selectedVolume || isLoading}
                        className="group relative px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-black/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          Next
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-bold text-black mb-2">Tell us about yourself</h3>
                      <p className={bodyTextClass}>Complete your details so we can schedule your demo</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              required
                              value={formData.firstName}
                              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                              className={`block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${bodyTextClass}`}
                              placeholder="Enter your first name"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              required
                              value={formData.lastName}
                              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                              className={`block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${bodyTextClass}`}
                              placeholder="Enter your last name"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className={`block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${bodyTextClass}`}
                              placeholder="Enter your email"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Building className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              required
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              className={`block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${bodyTextClass}`}
                              placeholder="Enter your company name"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Globe className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              required
                              value={formData.country}
                              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                              className={`block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all duration-200 ${bodyTextClass}`}
                              placeholder="Enter your country"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-8">
                        <button
                          onClick={handlePrev}
                          type="button"
                          className="group flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-black transition-all duration-200 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                          Previous
                        </button>
                        <button
                          type="submit"
                          className="w-40 py-3 px-4 bg-black text-white rounded-full font-semibold text-base shadow hover:bg-black/90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                          disabled={isLoading}
                        >
                          {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Book Demo"}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 



