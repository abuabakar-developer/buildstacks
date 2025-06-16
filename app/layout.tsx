import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Construct from "./components/Construct";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import NewConstruct from "./components/NewConstruct";
import Footer from "./components/Footer";


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

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Construction Documentation SaaS",
  description: "Modern construction documentation platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <Hero />
        <Construct />
        <NewConstruct />
        <Pricing />
        <FAQ />
        <Footer />
        {children}
      </body>
    </html>
  );
}
