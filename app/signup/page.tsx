'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  Lock,
  FileText,
  Users,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { Inter, Poppins } from 'next/font/google';
import { toast } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

const businessTypes = [
  {
    id: 'residential-home',
    title: 'Residential Home Builder',
    description: 'Build new homes and residential properties',
    icon: <Home className="w-6 h-6" />,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'residential-remodeler',
    title: 'Residential Remodeler',
    description: 'Renovate and remodel existing homes',
    icon: <Hammer className="w-6 h-6" />,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'commercial-contractor',
    title: 'Commercial General Contractor',
    description: 'Handle commercial construction projects',
    icon: <Building2 className="w-6 h-6" />,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'specialty-contractor',
    title: 'Specialty/Trade Contractor',
    description: 'Specialized construction services',
    icon: <Wrench className="w-6 h-6" />,
    color: 'from-orange-500 to-orange-600'
  }
];

const volumeRanges = [
  { value: '0-100k', label: '$0 - $100K', description: 'Small projects' },
  { value: '100k-500k', label: '$100K - $500K', description: 'Medium projects' },
  { value: '500k-1m', label: '$500K - $1M', description: 'Large projects' },
  { value: '1m-5m', label: '$1M - $5M', description: 'Major projects' },
  { value: '5m-10m', label: '$5M - $10M', description: 'Enterprise projects' },
  { value: '10m+', label: '$10M+', description: 'Large enterprise' }
];

// Add a helper class for body text
const bodyTextClass = "font-inter tracking-wide text-sm font-semibold text-gray-700";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [selectedVolume, setSelectedVolume] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
    country: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleNext = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(step + 1);
    }, 1000);
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Validate password strength
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        throw new Error('Password must be at least 8 characters long and contain 1 uppercase letter, 1 number, and 1 special character');
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          businessType: selectedType,
          constructionVolume: selectedVolume,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Set the token in a cookie
      document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days

      // Show success message
      toast.success('Registration successful!');

      // Redirect to dashboard
      router.push('/dashboard');
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
            s === step ? 'bg-blue-500 text-white' : 
            s < step ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-400'
          }`}>
            {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
          </div>
          {s < 3 && (
            <div className={`w-12 h-0.5 ${
              s < step ? 'bg-green-500' : 'bg-slate-700'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen bg-gray-50 ${inter.variable} ${poppins.variable}`}>
      {/* Enhanced Top Hero/Promo Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Animated Background Elements */}
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
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-24 h-24 bg-blue-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, -25, 0],
              y: [0, 15, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/4 w-20 h-20 bg-yellow-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, 20, 0],
              y: [0, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-14">
          <div className="flex flex-col lg:flex-row items-center justify-between min-h-[150px] md:min-h-[180px] lg:min-h-[220px] py-6 md:py-8">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex-1 text-center lg:text-left mb-6 lg:mb-0"
            >
              {/* Smart Headline with Typing Effect */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl mt-4 xl:text-5xl font-black leading-relaxed text-white mb-2 md:mb-3"
              >
                <span className="block font-inter">Grow Your Profits From $$ to $$$$</span>
              </motion.h1>

              {/* Smart Subtitle */}
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-sm sm:text-sm md:text-base lg:text-lg text-white font-semibold mb-3 md:mb-4 max-w-xl mx-auto lg:mx-0 leading-relaxed font-inter"
              >
                Join thousands of construction professionals who've revolutionized their workflow with BuildStack's all-in-one platform.
              </motion.p>

              {/* Smart Feature List with Hover Effects */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-col sm:flex-row items-start justify-start lg:justify-start gap-1.5 md:gap-3 lg:gap-4 mb-3 md:mb-4"
              >
                {[
                  { icon: "👥", text: "Unlimited Users", color: "text-white mb-3 mt-2", delay: 0.8 },
                  { icon: "🏗️", text: "Unlimited Projects", color: "text-white mb-2", delay: 0.9 },
                  { icon: "📈", text: "Unlimited Growth", color: "text-white mb-2", delay: 1.0 }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: feature.delay }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-1 md:gap-1.5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-2 py-1 md:px-2.5 md:py-1.5 hover:bg-white/10 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl"
                  >
                    <span className="text-xs md:text-sm group-hover:scale-110 transition-transform duration-300">{feature.icon}</span>
                    <span className={`font-semibold text-xs ${feature.color} font-inter`}>{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Smart Right Visual Element */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex-1 flex justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Smart Main Icon with Enhanced Animation */}
                <motion.div
                  animate={{ 
                    y: [0, -3, 0],
                    rotate: [0, 0.5, -0.5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                    <Building2 className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />
                  </div>
                </motion.div>

                {/* Smart Decorative Elements */}
                <motion.div
                  className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-yellow-500/20 rounded-full blur-md"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.6, 0.4],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute -bottom-1 -left-1 md:-bottom-2 md:-left-2 w-4 h-4 md:w-6 md:h-6 bg-purple-500/20 rounded-full blur-md"
                  animate={{
                    scale: [1, 0.9, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
                
                {/* Smart Floating Elements */}
                <motion.div
                  className="absolute top-0 left-0 w-2 h-2 bg-green-400/30 rounded-full"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                <motion.div
                  className="absolute top-2 right-0 w-1.5 h-1.5 bg-blue-400/30 rounded-full"
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Smart Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-8 md:h-10 lg:h-12" preserveAspectRatio="none">
            <path 
              fill="#f9fafb" 
              d="M0,48L60,44C120,40,240,32,360,30.7C480,29,600,35,720,40C840,45,960,49,1080,48.7C1200,48,1320,43,1380,40.7L1440,38L1440,60L1380,60C1320,60,1200,60,1080,60C960,60,840,60,720,60C600,60,480,60,360,60C240,60,120,60,60,60L0,60Z"
            />
          </svg>
        </div>
      </section>
      {/* End Enhanced Top Hero/Promo Section */}
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left Side - Signup Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12 bg-white">
          <div className="w-full max-w-xl z-10 flex flex-col h-full justify-center">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <Link href="/" className="inline-flex items-center space-x-2 text-black font-bold text-2xl group">
                <div className="bg-black w-12 h-12 flex items-center justify-center rounded-xl font-black text-white transform transition-transform duration-300 group-hover:scale-110">
                  <Building2 size={24} />
                </div>
                <span className="tracking-wide">BuildStack</span>
              </Link>
            </motion.div>
            {renderStepIndicator()}
            <div className="rounded-2xl border border-gray-200 p-6 md:p-10 shadow-lg bg-white max-w-lg mx-auto flex-1 flex flex-col justify-center">
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
                      <h2 className="text-2xl font-bold text-black mb-2">What best describes your business?</h2>
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
                                <h3 className="font-semibold mb-1 text-black">{type.title}</h3>
                                <p className={bodyTextClass}>{type.description}</p>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-8">
                      <Link
                        href="/login"
                        className="text-gray-500 hover:text-black transition-colors duration-200 font-semibold"
                      >
                        Already have an account?
                      </Link>
                      <button
                        onClick={handleNext}
                        disabled={!selectedType}
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
                      <h2 className="text-2xl font-bold text-black mb-2">What is your average construction volume?</h2>
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
                                <h3 className="font-semibold mb-1 text-black">{range.label}</h3>
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
                        disabled={!selectedVolume}
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
                      <h2 className="text-2xl font-bold text-black mb-2">Fill out your information</h2>
                      <p className={bodyTextClass}>Complete your profile to get started</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              required
                              value={formData.firstName}
                              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                              className={`block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30 transition-all duration-200 ${bodyTextClass}`}
                              placeholder="Enter your first name"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              required
                              value={formData.lastName}
                              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                              className={`block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30 transition-all duration-200 ${bodyTextClass}`}
                              placeholder="Enter your last name"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className={`block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30 transition-all duration-200 ${bodyTextClass}`}
                              placeholder="Enter your email"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Building className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              required
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              className={`block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30 transition-all duration-200 ${bodyTextClass}`}
                              placeholder="Enter your company name"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              className={`block w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30 transition-all duration-200 ${bodyTextClass}`}
                              placeholder="Create a password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                              tabIndex={-1}
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                          <p className={`mt-1 text-xs text-gray-500 ${bodyTextClass}`}>
                            Must be at least 8 characters with 1 uppercase, 1 number, and 1 special character
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              required
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                              className={`block w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30 transition-all duration-200 ${bodyTextClass}`}
                              placeholder="Confirm your password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword((prev) => !prev)}
                              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                              tabIndex={-1}
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Globe className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              required
                              value={formData.country}
                              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                              className={`block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30 transition-all duration-200 ${bodyTextClass}`}
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
                          {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Sign Up"}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        {/* Right Side - Feature/Illustration Section */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gray-50 border-l border-gray-200">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* You can add an illustration or image here if desired */}
            <Building2 className="w-32 h-32 text-gray-200" />
          </div>
          <div className="relative z-10 h-full flex flex-col justify-center px-16 py-12 text-gray-800">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-lg"
            >
              <h1 className="text-4xl font-bold mb-6 text-black">
                Join BuildStack Today
              </h1>
              <p className={`text-xl text-gray-700 mb-12 leading-relaxed ${bodyTextClass}`}>
                Create your account and streamline your construction workflow with our all-in-one document management platform.
              </p>
              {/* Feature Grid */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    icon: <FileText className="w-6 h-6" />,
                    title: "Document Control",
                    description: "Manage blueprints and permits"
                  },
                  {
                    icon: <Users className="w-6 h-6" />,
                    title: "Team Collaboration",
                    description: "Coordinate across departments"
                  },
                  {
                    icon: <Shield className="w-6 h-6" />,
                    title: "Secure Access",
                    description: "Role-based permissions"
                  },
                  {
                    icon: <DollarSign className="w-6 h-6 text-blue-500" />,
                    title: "Project Analytics",
                    description: "Track progress and metrics"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl p-4 border border-gray-200 shadow"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-black text-base">{feature.title}</h3>
                    </div>
                    <p className={`text-sm text-gray-600 ${bodyTextClass}`}>{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 







