import React from 'react';
import dynamic from 'next/dynamic';

const MoonSky = dynamic(() => import('./MoonSky'), { ssr: false });

type HeroBannerProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

const HeroBanner: React.FC<HeroBannerProps> = ({ title, subtitle, children }) => {
  return (
    <header className="relative w-full h-80 md:h-[28rem] overflow-hidden border-b border-moon-silver/10">
      <MoonSky />
      {/* soft fade into page background at the bottom edge */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-moon-deep pointer-events-none z-[1]" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <h1 className="font-pixel text-moon-glow text-5xl md:text-7xl leading-none drop-shadow-[0_0_12px_rgba(255,248,214,0.25)]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 font-pixel text-moon-mist text-lg md:text-2xl">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </header>
  );
};

export default HeroBanner;
