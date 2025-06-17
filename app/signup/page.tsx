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
  Phone,
  Mail,
  Building,
  Globe,
  Loader2,
  Lock
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

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [selectedVolume, setSelectedVolume] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: '',
    country: ''
  });

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

  const renderBusinessTypeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">What best describes your business?</h2>
        <p className="text-slate-400">Select the option that best matches your construction business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {businessTypes.map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedType(type.id)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              selectedType === type.id
                ? 'border-blue-500 bg-slate-700/50'
                : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${type.color}`}>
                {type.icon}
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold mb-1">{type.title}</h3>
                <p className="text-slate-400 text-sm">{type.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <Link
          href="/login"
          className="text-slate-400 hover:text-white transition-colors duration-200"
        >
          Already have an account?
        </Link>
        <button
          onClick={handleNext}
          disabled={!selectedType}
          className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center gap-2">
            Next
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </span>
        </button>
      </div>
    </motion.div>
  );

  const renderVolumeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">What is your average construction volume?</h2>
        <p className="text-slate-400">Select the range that best represents your annual construction volume</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {volumeRanges.map((range) => (
          <motion.button
            key={range.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedVolume(range.value)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              selectedVolume === range.value
                ? 'border-blue-500 bg-slate-700/50'
                : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-slate-700">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold mb-1">{range.label}</h3>
                <p className="text-slate-400 text-sm">{range.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePrev}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedVolume}
          className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center gap-2">
            Next
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </span>
        </button>
      </div>
    </motion.div>
  );

  const renderFormStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Fill out your information</h2>
        <p className="text-slate-400">Complete your profile to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="block w-full pl-10 pr-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your first name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Last Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="block w-full pl-10 pr-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="block w-full pl-10 pr-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Company Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="block w-full pl-10 pr-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your company name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="block w-full pl-10 pr-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Create a password"
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Must be at least 8 characters with 1 uppercase, 1 number, and 1 special character
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="block w-full pl-10 pr-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Country
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="block w-full pl-10 pr-3 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your country"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Submit
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </motion.div>
  );

  return (
    <div className={`min-h-screen bg-slate-900 ${inter.variable} ${poppins.variable}`}>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 text-white font-bold text-2xl group">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-12 h-12 flex items-center justify-center rounded-xl font-black text-white transform transition-transform duration-300 group-hover:scale-110">
                <Building2 size={24} />
              </div>
              <span className="tracking-wide">BuildStack</span>
            </Link>
          </div>

          {/* Registration Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
            {renderStepIndicator()}

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                  <p className="text-slate-400">Loading...</p>
                </motion.div>
              ) : (
                <>
                  {step === 1 && renderBusinessTypeStep()}
                  {step === 2 && renderVolumeStep()}
                  {step === 3 && renderFormStep()}
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
} 