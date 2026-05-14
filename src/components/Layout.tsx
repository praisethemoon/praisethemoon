import React from 'react';
import { useRouter } from 'next/router';
import Header from './Header';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isFullBleed = router.pathname === '/' || router.pathname === '/404';

  return (
    <div
      data-theme="moonnight"
      className="relative flex flex-col min-h-screen bg-moon-deep text-moon-silver"
    >
      <Header />
      <main
        className={`flex-grow ${
          isFullBleed ? 'pt-0' : 'pt-16 md:pt-16'
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
