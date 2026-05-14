import React from 'react';
import Head from 'next/head';
import HeroBanner from '@/components/HeroBanner';

type Section = {
  cmd: string;
  body: React.ReactNode;
};

const sections: Section[] = [
  {
    cmd: 'whoami',
    body: (
      <>
        <p>I&apos;m Soulaymen Chouri.</p>
        <p className="mt-4">
          Online, I go by{' '}
          <span className="font-pixel text-moon-glow text-xl">praisethemoon</span>{' '}
          — most people just call me{' '}
          <span className="font-pixel text-moon-glow text-xl">moon</span>.
        </p>
      </>
    ),
  },
  {
    cmd: 'whatdoido',
    body: (
      <p>
        I&apos;m a software engineer. Most of my time goes into learning, coding
        random (or not so random) things. I have an obsession with performance
        for some reason, and I like to push things to their limits.
      </p>
    ),
  },
  {
    cmd: 'whereami',
    body: (
      <p>
        I grew up in Tunisia, where I studied and graduated. I now live and work
        in Germany.
      </p>
    ),
  },
  {
    cmd: 'whymoon',
    body: (
      <p>
        Dark Souls fan.
      </p>
    ),
  },
];

const About: React.FC = () => {
  return (
    <div className="starfield-bg min-h-[calc(100vh-4rem)]">
      <Head>
        <title>About</title>
      </Head>

      <HeroBanner title="About" subtitle="who is moon?" />

      <article className="max-w-2xl mx-auto px-6 pt-16 pb-24 text-moon-silver/90 text-lg leading-relaxed">
        {sections.map((s, i) => (
          <section key={s.cmd} className={i === 0 ? '' : 'mt-12'}>
            <h2 className="font-pixel text-2xl md:text-3xl mb-3 select-none">
              <span className="text-moon-mist mr-2">$</span>
              <span className="text-moon-glow">{s.cmd}</span>
            </h2>
            <div className="border-l border-moon-silver/15 pl-4">
              {s.body}
            </div>
          </section>
        ))}
      </article>
    </div>
  );
};

export default About;
