'use client';

import { Toaster } from 'react-hot-toast';
import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Construct from './components/Construct';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Business from './components/Business';
import HowItWorks from './components/HowItWorks';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

const autoSave = {
  enabled: true,
  interval: 5000, // 5 seconds
  onSave: () => {
    console.log('Auto-saving...');
    // Add your auto-save logic here
  }
};

// Toggle auto-save function
const toggleAutoSave = () => {
  autoSave.enabled = !autoSave.enabled;
  console.log(`Auto-save ${autoSave.enabled ? 'enabled' : 'disabled'}`);
};

// Set up auto-save interval
if (autoSave.enabled) {
  setInterval(autoSave.onSave, autoSave.interval);
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isBookDemoPage = pathname === '/book-demo';
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col bg-slate-900">
        {isAuthPage ? (
          <>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1e293b',
                  color: '#fff',
                  border: '1px solid #334155',
                },
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </>
        ) : isBookDemoPage ? (
          <>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1e293b',
                  color: '#fff',
                  border: '1px solid #334155',
                },
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </>
        ) : (
          <>
            <Navbar />
            <main className="flex-grow">
              <Hero />
              <Construct />
              <HowItWorks />
              <Pricing />
              <Business />
              <FAQ />
              <Footer />
              {children}
            </main>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1e293b',
                  color: '#fff',
                  border: '1px solid #334155',
                },
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
