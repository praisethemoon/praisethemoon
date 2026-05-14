import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Moon404Scene = dynamic(() => import('../components/Moon404Scene'), { ssr: false });

const Custom404: React.FC = () => {
  return (
    <>
      <Head>
        <title>404 — lost on a different hill</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="relative w-full min-h-screen h-screen overflow-hidden bg-moon-deep">
        <Moon404Scene />
        <div className="relative z-10 flex flex-col items-center justify-center h-screen px-6 text-center">
          <h1 className="font-pixel text-moon-glow text-8xl md:text-[10rem] leading-none drop-shadow-[0_0_18px_rgba(255,248,214,0.25)]">
            404
          </h1>
          <p className="mt-2 font-pixel text-moon-mist text-2xl md:text-3xl">
            — lost on a different hill —
          </p>
          <p className="mt-6 max-w-md text-moon-silver/80">
            This page isn&apos;t where I left it. Or maybe it never was. Either
            way, you&apos;ve wandered off the path.
          </p>
          <Link href="/" className="mt-10 btn-pixel">
            ← back home
          </Link>
        </div>
      </div>
    </>
  );
};

export default Custom404;
