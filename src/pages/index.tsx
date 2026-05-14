import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa';

const MoonScene = dynamic(() => import('../components/MoonScene'), { ssr: false });

const YOUTUBE_URL = 'https://www.youtube.com/@moon-writes-code';

const Landing: React.FC = () => {
  return (
    <>
      <Head>
        <title>praisethemoon</title>
        <meta name="description" content="moon — a quiet hill, a louder sky." />
      </Head>
      <div className="relative w-full min-h-screen h-screen overflow-hidden bg-moon-deep">
        <MoonScene />
        <div className="relative z-10 flex flex-col items-center justify-center h-screen px-6 text-center">
          <h1 className="font-pixel text-moon-glow text-7xl md:text-9xl drop-shadow-[0_0_18px_rgba(255,248,214,0.25)] leading-none">
            praisethemoon
          </h1>
          <p className="mt-2 font-pixel text-moon-mist text-2xl md:text-3xl">
            — call me moon —
          </p>
          <p className="mt-6 max-w-xl text-moon-silver/80 text-base md:text-lg">
            I am busy creating things, so feel free to look around.
          </p>
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <Link href="/blog" className="btn-pixel">Blog</Link>
            <Link href="/projects" className="btn-pixel">Projects</Link>
            <Link href="/about" className="btn-pixel">About</Link>
            <a href="mailto:doit@praisethemoon.org" className="btn-pixel">Contact</a>
            <a
              href="https://github.com/praisethemoon"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="btn-pixel !px-3"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://linkedin.com/in/praisethemoon"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="btn-pixel !px-3"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="btn-pixel !px-3"
            >
              <FaYoutube size={20} />
            </a>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Landing;
