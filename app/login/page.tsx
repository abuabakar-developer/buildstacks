'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Mail,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Loader2,
  ArrowRight,
  CheckCircle2,
  FileText,
  Users,
  Shield,
  BarChart,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import { Inter, Poppins } from 'next/font/google';
import { toast } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

// Add a helper class for body text
const bodyTextClass = "font-inter text-sm font-semibold text-gray-700";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate email
      if (!email) {
        throw new Error('Email is required');
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      // Optionally handle error UI here, but no toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-white ${inter.variable} ${poppins.variable} relative overflow-hidden`}>
      {/* Split Layout Container */}
      <div className="flex min-h-screen">
        {/* Left Side - Image Section */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden"
        >
          {/* Background Image */}
      <div className="absolute inset-0">
            <Image
              src="/construction-3.jpg"
              alt="Construction Site"
              fill
              className="object-cover opacity-40"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent"></div>
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12"
            >
              <Link href="/" className="inline-flex items-center space-x-3 text-white font-bold text-3xl group">
                <motion.div 
                  className="bg-white w-14 h-14 flex items-center justify-center rounded-2xl font-black text-black transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-white/20"
                  whileHover={{ rotate: 5 }}
                >
                  <Building2 size={28} />
                </motion.div>
                <span className="tracking-wide font-semibold">BuildStack</span>
              </Link>
            </motion.div>

            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-md"
            >
              <h1 className="text-4xl font-bold mb-6 leading-tight">
                Transform Your Construction Projects
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Streamline project management, enhance team collaboration, and deliver exceptional results with our comprehensive construction SaaS platform.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-200 font-medium">Project Management Excellence</span>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-200 font-medium">Team Collaboration Tools</span>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-200 font-medium">Security & Compliance</span>
                </motion.div>
              </div>

              {/* Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-white/20"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-sm text-gray-300">Active Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-sm text-gray-300">Team Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">99.9%</div>
                  <div className="text-sm text-gray-300">Uptime</div>
                </div>
              </motion.div>
            </motion.div>
        </div>
        
          {/* Floating Elements */}
        <motion.div
            className="absolute top-20 right-20 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"
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
            className="absolute bottom-20 left-20 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl"
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
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex-1 lg:w-1/2 flex items-center justify-center px-6 py-8 lg:px-12 lg:py-16"
        >
        <div className="w-full max-w-md">
            {/* Mobile Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-8 lg:hidden"
          >
              <Link href="/" className="inline-flex items-center space-x-3 text-black font-bold text-3xl group">
              <motion.div 
                className="bg-black w-14 h-14 flex items-center justify-center rounded-2xl font-black text-white transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-black/20"
                whileHover={{ rotate: 5 }}
              >
                <Building2 size={28} />
              </motion.div>
              <span className="tracking-wide font-semibold">BuildStack</span>
            </Link>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="bg-white"
          >
            <div className="text-center mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-3xl font-bold text-gray-900 mb-3"
              >
                Welcome Back
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-gray-600 font-semibold text-base font-inter"
              >
                Sign in to your account to continue
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3 font-inter">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 font-semibold text-base font-inter hover:bg-white"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </motion.div>
              
              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3 font-inter">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-12 py-4 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 font-semibold text-base font-inter hover:bg-white"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </motion.div>
              
              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-black text-white rounded-full font-semibold text-base shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed font-inter group transform hover:scale-105 active:scale-95"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-8 text-center"
            >
              <span className="text-gray-500 font-semibold text-base font-inter">Don't have an account?</span>{' '}
              <Link href="/signup" className="text-gray-600 font-semibold hover:text-gray-900 hover:underline font-inter transition-colors duration-200">
                Sign up
              </Link>
            </motion.div>
          </motion.div>

          {/* Modern Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-8 text-center"
          >
            <p className="text-black text-base font-bold font-inter tracking-wide flex items-center justify-center gap-2">
              <span>Secure</span>
              <span className="text-gray-400">•</span>
              <span>Fast</span>
              <span className="text-gray-400">•</span>
              <span>Reliable</span>
            </p>
          </motion.div>
        </div>
        </motion.div>
      </div>
    </div>
  );
}