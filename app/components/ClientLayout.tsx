'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Hero from './Hero';
import Construct from './Construct';
import Pricing from './Pricing';
import FAQ from './FAQ';
import Footer from './Footer';
import Business from './Business';
import HowItWorks from './HowItWorks';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isBookDemoPage = pathname === '/book-demo';
  const isDashboardPage = pathname === '/dashboard';
  const isProjectManagementPage = pathname === '/solutions/project-management';
  const isTeamCollaborationPage = pathname === '/solutions/team-collaboration';
  const isDocumentControlPage = pathname === '/solutions/document-control';
  const isSecurityCompliancePage = pathname === '/solutions/security-compliance';
  const isNotFoundPage = pathname === '/not-found';

  if (isAuthPage || isDashboardPage) {
    return <>{children}</>;
  }

  // Show only the 404 page itself, with no Navbar or other layout
  if (isNotFoundPage) {
    return <>{children}</>;
  }

  if (isProjectManagementPage || isTeamCollaborationPage || isDocumentControlPage || isSecurityCompliancePage) {
    return (
      <>
        <Navbar />
        <main className="flex-grow">{children}</main>
      </>
    );
  }

  if (isBookDemoPage) {
    return (
      <>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </>
    );
  }

  return (
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
    </>
  );
} 



