import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import HeroBanner from '@/components/HeroBanner';

type Project = {
  name: string;
  tagline: string;
  description: string;
  href: string;
  external: boolean;
};

const projects: Project[] = [
  {
    name: 'Type-C',
    tagline: 'a type-safe general purpose concurrent programming language',
    description:
      'Type-C is a statically typed programming language designed for safe and efficient concurrent programming.',
    href: 'https://typec.praisethemoon.org',
    external: true,
  },
  {
    name: 'MoonPiano',
    tagline: 'practice piano in the browser',
    description:
      'A piano practice app — MIDI in, instant feedback, no fuss.',
    href: 'https://moonpiano.io',
    external: true,
  },
];

const Projects: React.FC = () => {
  return (
    <div className="starfield-bg min-h-[calc(100vh-4rem)]">
      <Head>
        <title>praisethemoon — projects</title>
      </Head>

      <HeroBanner title="Projects" subtitle="things I've made" />

      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24 space-y-6">
        {projects.map((p) => {
          const inner = (
            <div className="p-6 border border-moon-silver/20 hover:border-moon-glow/60 hover:bg-moon-dusk/40 transition-colors">
              <div className="flex items-baseline gap-4 flex-wrap">
                <h2 className="font-pixel text-4xl text-moon-glow">{p.name}</h2>
                <span className="font-pixel text-moon-mist text-lg">{p.tagline}</span>
              </div>
              <p className="mt-3 text-moon-silver/85 leading-relaxed">{p.description}</p>
              <div className="mt-4 font-pixel text-moon-mist text-base">
                {p.href.replace(/^https?:\/\//, '')} →
              </div>
            </div>
          );
          return p.external ? (
            <a key={p.name} href={p.href} target="_blank" rel="noreferrer" className="block">
              {inner}
            </a>
          ) : (
            <Link key={p.name} href={p.href} className="block">
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
