'use client';

import { useEffect, useState } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('cookie-consent');
      if (!consent) setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg md:max-w-2xl px-2 md:px-0">
      <div className="bg-black/95 text-white rounded-2xl shadow-2xl border border-gray-800 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 animate-fadeInUp">
        <div className="flex-1 text-white text-sm md:text-base font-medium text-center md:text-left">
          We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies. <a href="/privacy" className="underline text-blue-300 hover:text-blue-400 transition">Learn more</a>.
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-4 md:mt-0">
          <button
            onClick={rejectCookies}
            className="px-6 py-2 bg-transparent text-white border border-white rounded-full font-semibold shadow hover:bg-white hover:text-black transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Reject All
          </button>
          <button
            onClick={acceptCookies}
            className="px-6 py-2 bg-white text-black rounded-full font-semibold shadow hover:bg-gray-200 transition-all duration-200 border border-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            Accept All
          </button>
        </div>
      </div>
      <style jsx>{`
        .animate-fadeInUp {
          animation: fadeInUp 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
} 