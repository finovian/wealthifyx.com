'use client';

import { usePathname } from 'next/navigation';
import EmailCapture from './EmailCapture';
import Footer from './Footer';

export default function ConditionalElements() {
  const pathname = usePathname();
  
  const isChatPage = pathname === '/ai';

  if (isChatPage) {
    return null;
  }

  return (
    <>
      <EmailCapture />
      <Footer />
    </>
  );
}
