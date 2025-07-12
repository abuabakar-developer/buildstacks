'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CookieConsent from '../components/CookieConsent';
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
  EyeOff,
  CreditCard,
  TrendingUp,
  BarChart3,
  Zap
} from 'lucide-react';
import { Inter, Poppins } from 'next/font/google';

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

type Project = { _id: string; name: string; };

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
    phone: '',
    company: '',
    password: '',
    confirmPassword: '',
    country: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch projects from your API
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || []);
        setProjectsLoading(false);
      })
      .catch(err => {
        setProjectsError('Failed to load projects');
        setProjectsLoading(false);
      });
  }, []);

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
      // Validate all required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.company || !formData.password || !formData.country) {
        throw new Error('All required fields must be filled');
      }

      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Validate password strength
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        throw new Error('Password must be at least 8 characters long and contain 1 uppercase letter, 1 number, and 1 special character');
      }

      // Validate business type and volume are selected
      if (!selectedType || !selectedVolume) {
        throw new Error('Please select your business type and construction volume');
      }

      // Create request body with optional phone field
      const requestBody = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        country: formData.country,
        businessType: selectedType,
        constructionVolume: selectedVolume,
        companyName: formData.company,
      };

      // Only add phone if it's provided and not empty
      if (formData.phone && formData.phone.trim()) {
        Object.assign(requestBody, { phone: formData.phone.trim() });
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Signup failed with status ${response.status}`);
      }

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 1500);

    } catch (error: any) {
      // Optionally handle error UI here, but no toast
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
    <>
      <div className="min-h-screen bg-white flex mt-14 font-sans">
        {/* Left Side - Signup Form (White background) */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-12 xl:px-16 py-12 lg:py-16 bg-white">
          <div className="max-w-lg w-full mx-auto">
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex items-center space-x-2 text-black font-bold text-2xl mb-4">
                <div className="bg-black w-10 h-10 flex items-center justify-center rounded-md text-white">
                  <Building2 className="w-6 h-6" />
                </div>
                <span>BuildStack</span>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
              <p className="text-lg text-gray-600">Join thousands of construction professionals</p>
            </div>
            {/* Step Indicator */}
            {renderStepIndicator()}
            {/* Form Content */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 lg:p-10 shadow-sm">
              <AnimatePresence mode="wait">
                {/* Step 1: Business Type */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">What type of business are you?</h2>
                    <div className="space-y-4">
                      {businessTypes.map((type) => (
                        <motion.button
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                            selectedType === type.id
                              ? 'border-black bg-gray-100 shadow'
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg bg-gradient-to-r ${type.color} text-white`}>
                              {type.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{type.title}</h3>
                              <p className="text-sm text-gray-600">{type.description}</p>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                    <div className="mt-8">
                      <button
                        onClick={handleNext}
                        disabled={!selectedType}
                        className="w-full py-3 px-4 bg-black text-white rounded-full font-semibold text-base shadow-sm hover:bg-black/90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                          <>
                            Next
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Construction Volume */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">What's your annual construction volume?</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {volumeRanges.map((volume) => (
                        <motion.button
                          key={volume.value}
                          onClick={() => setSelectedVolume(volume.value)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                            selectedVolume === volume.value
                              ? 'border-black bg-gray-100 shadow'
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="font-semibold text-gray-900 mb-1">{volume.label}</div>
                          <div className="text-sm text-gray-600">{volume.description}</div>
                        </motion.button>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-8">
                      <button
                        onClick={handlePrev}
                        className="group flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 hover:text-black transition-all duration-200 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                        Previous
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={!selectedVolume}
                        className="px-6 py-3 bg-black text-white rounded-full font-semibold text-base shadow-sm hover:bg-black/90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                          <>
                            Next
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Account Details */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Create your account</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
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
                          Phone Number (Optional)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={`block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/30 transition-all duration-200 ${bodyTextClass}`}
                            placeholder="Enter your phone number (optional)"
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project
                        </label>
                        {projectsLoading ? (
                          <div>Loading projects...</div>
                        ) : projectsError ? (
                          <div className="text-red-500">{projectsError}</div>
                        ) : (
                          <select
                            value={selectedProjectId || ""}
                            onChange={e => setSelectedProjectId(e.target.value)}
                            className="mb-4"
                          >
                            <option value="">Select Project</option>
                            {projects.map((project) => (
                              <option key={project._id} value={project._id}>{project.name}</option>
                            ))}
                          </select>
                        )}
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
                          className="w-40 py-3 px-4 bg-black text-white rounded-full font-semibold text-base shadow-sm hover:bg-black/90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
        {/* Right Side - Features/Promo Section (Black/gradient, with padding and rounded corners) */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
          <div className="relative w-full h-full rounded-3xl shadow-md overflow-hidden flex flex-col justify-center px-12 py-16 bg-gradient-to-br from-black via-gray-900 to-black text-white" style={{minHeight: '80vh'}}>
            {/* Animated Background Elements (from book a demo) */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90"></div>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px'
                }}></div>
              </div>
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
              className="max-w-lg w-full text-left relative z-10"
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-6 text-white leading-tight">
                  Join BuildStack Today
                </h1>
                <p className={`text-xl text-white/80 leading-relaxed ${bodyTextClass}`}>
                  Create your account and streamline your construction workflow with our all-in-one document management platform.
                </p>
              </div>
              {/* Feature Column Layout */}
              <div className="space-y-6">
                {[
                  {
                    icon: <FileText className="w-6 h-6" />, title: "Document Control", description: "Manage blueprints and permits with ease"
                  },
                  {
                    icon: <Users className="w-6 h-6" />, title: "Team Collaboration", description: "Coordinate across departments seamlessly"
                  },
                  {
                    icon: <Shield className="w-6 h-6" />, title: "Secure Access", description: "Role-based permissions and data protection"
                  },
                  {
                    icon: <DollarSign className="w-6 h-6" />, title: "Project Analytics", description: "Track progress and metrics in real-time"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="backdrop-blur-lg bg-white/10 border border-gray-200/20 rounded-xl p-6 shadow-lg flex items-start gap-4 hover:shadow-2xl transition-all duration-300 group"
                  >
                    <div className="p-3 rounded-xl bg-white/20 text-white shadow-lg flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-gray-200 transition-colors duration-200">
                        {feature.title}
                      </h3>
                      <p className="text-gray-200 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-12 text-center"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-gray-200/20">
                  <div className="flex items-center justify-center gap-8 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">10K+</div>
                      <div className="text-sm text-gray-200">Active Users</div>
                    </div>
                    <div className="w-px h-8 bg-gray-500"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">500+</div>
                      <div className="text-sm text-gray-200">Projects</div>
                    </div>
                    <div className="w-px h-8 bg-gray-500"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">99%</div>
                      <div className="text-sm text-gray-200">Satisfaction</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-200 italic">
                    "BuildStack has transformed how we manage our construction projects"
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      {/* More than software: A partner in your growth Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="bg-white py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-3xl md:text-4xl font-bold text-black/70 mb-6"
              style={{ fontFamily: 'var(--font-plus-jakarta)', fontWeight: 700 }}
            >
              More than software: A partner in your growth
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-xl text-black/60 max-w-3xl mx-auto"
              style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}
            >
              Go beyond our platform with these add-ons to help you manage your entire business.
            </motion.p>
          </div>

          {/* Features Grid */}
          <div className="relative max-w-7xl mx-auto mb-24">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="relative grid grid-cols-1 md:grid-cols-3 gap-8 z-10"
            >
              {[
                {
                  icon: <DollarSign className="w-6 h-6" />, title: "Cash back on materials", description: "Manage materials and earn rebates from brand names so you can add to your bottom line without hassle.", hoverColor: 'text-green-600', hoverBgColor: 'bg-green-50', bg: 'bg-green-100', border: 'border-green-400', arrow: 'text-green-600', arrowHover: 'group-hover:text-white', arrowBg: 'group-hover:bg-green-600', arrowBorder: 'group-hover:border-white/20'
                },
                {
                  icon: <CreditCard className="w-6 h-6" />, title: "Online payments", description: "Payments between subs, clients and your business don't have to be messy. You can easily send and receive money online.", hoverColor: 'text-blue-600', hoverBgColor: 'bg-blue-50', bg: 'bg-blue-100', border: 'border-blue-400', arrow: 'text-blue-600', arrowHover: 'group-hover:text-white', arrowBg: 'group-hover:bg-blue-600', arrowBorder: 'group-hover:border-white/20'
                },
                {
                  icon: <BarChart3 className="w-6 h-6" />, title: "Advanced reporting", description: "Make better business decisions with easy-to-understand data. We'll help you use the insights to achieve greater business results.", hoverColor: 'text-purple-600', hoverBgColor: 'bg-purple-50', bg: 'bg-purple-100', border: 'border-purple-400', arrow: 'text-purple-600', arrowHover: 'group-hover:text-white', arrowBg: 'group-hover:bg-purple-600', arrowBorder: 'group-hover:border-white/20'
                }
              ].map((feature, index) => (
              <motion.div
                  key={feature.title}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
                }}
                className="group relative"
              >
                  <div className="bg-white rounded-3xl p-8 border border-gray-400 transition-all duration-500 flex flex-col h-full hover:bg-gray-50 cursor-pointer">
                  <div className="mb-6">
                      <div className={`flex-shrink-0 inline-flex p-4 rounded-2xl transition-all duration-500 bg-gray-300 text-gray-600 ${feature.bg} ${feature.border} group-hover:${feature.hoverBgColor} group-hover:${feature.hoverColor} group-hover:scale-110`}>
                        {feature.icon}
                </div>
                  </div>
                  <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-semibold text-black font-plus-jakarta leading-tight mb-4 transition-colors duration-500">
                        {feature.title}
                </h3>
                      <p className="text-black/70 font-semibold text-base leading-relaxed font-inter transition-colors duration-500">
                        {feature.description}
              </p>
                  </div>
                  <div className="flex justify-end mt-4">
                      <div className={`w-8 h-8 bg-white rounded-full border shadow-md flex items-center justify-center transition-all duration-500 ${feature.border} ${feature.arrowBg} ${feature.arrowBorder}`}>
                        <ArrowRight className={`w-4 h-4 ${feature.arrow} ${feature.arrowHover} transition-colors duration-500`} />
                    </div>
                  </div>
                </div>
            </motion.div>
              ))}
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-black/5 to-black/10 backdrop-blur-sm border border-black/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-black/70 mb-4" style={{ fontFamily: 'var(--font-plus-jakarta)', fontWeight: 700 }}>
                Ready to transform your construction business?
              </h3>
              <p className="text-black/60 mb-6 max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
                Join thousands of construction professionals who are already using BuildStack to streamline their operations and grow their business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/book-demo"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full font-semibold hover:bg-black/90 transition-all duration-200 shadow-md hover:shadow-lg"
                  style={{ fontFamily: 'var(--font-inter)', fontWeight: 600 }}
                >
                  <Zap className="h-4 w-4" />
                  Get Started Today
                </Link>
                <Link 
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-3 border border-black text-black rounded-full font-semibold hover:bg-black hover:text-white transition-all duration-200"
                  style={{ fontFamily: 'var(--font-inter)', fontWeight: 600 }}
                >
                  Already have an account? Sign in
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
} 







