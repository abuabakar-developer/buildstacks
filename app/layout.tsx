'use client';

import { Toaster } from 'react-hot-toast';
import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Construct from './components/Construct';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import NewConstruct from './components/NewConstruct';
import Footer from './components/Footer';

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
  return (
    <html lang="en" className={inter.className}>
      <body className="overflow-x-hidden min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Hero />
          <Construct />
          <NewConstruct />
          <Pricing />
          <FAQ />
        <Footer />
        {children}
        </div>
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
      </body>
    </html>
  );
}
