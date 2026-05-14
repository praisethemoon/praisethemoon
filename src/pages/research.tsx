import Head from 'next/head';
import React from 'react';
import HeroBanner from '@/components/HeroBanner';

const Research: React.FC = () => {
  return (
    <div className="starfield-bg min-h-[calc(100vh-4rem)]">
      <Head>
        <title>praisethemoon — research</title>
      </Head>

      <HeroBanner title="Research & Papers" subtitle="list of research and papers written by Le Me" />

      <section className="max-w-3xl mx-auto px-6 pt-12 pb-24 text-center">
        <p className="text-moon-silver/80">Sadly there is nothing here just yet!</p>
      </section>
    </div>
  );
};

export default Research;
