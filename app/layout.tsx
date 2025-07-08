import { Toaster } from 'react-hot-toast';
import './globals.css';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Construct from './components/Construct';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Business from './components/Business';
import HowItWorks from './components/HowItWorks';
import ClientLayout from './components/ClientLayout';
import CookieConsent from './components/CookieConsent';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen flex flex-col bg-slate-900">
        <ClientLayout>
          {children}
        </ClientLayout>
        <CookieConsent />
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










