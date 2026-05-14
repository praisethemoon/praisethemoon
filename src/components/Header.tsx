import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { GiEvilMoon } from 'react-icons/gi';

const YOUTUBE_URL = 'https://www.youtube.com/@moon-writes-code';

const navItems: { label: string; href: string }[] = [
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Projects', href: '/projects' },
];

const Header: React.FC = () => {
  const router = useRouter();
  if (router.pathname === '/' || router.pathname === '/404') return null;

  return (
    <header
      className="absolute md:fixed top-0 left-0 right-0 z-30 w-full bg-moon-deep/80 backdrop-blur border-b border-moon-silver/10"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-6 h-16">
        <Link
          href="/"
          aria-label="praisethemoon — home"
          className="text-moon-glow hover:text-white transition-colors text-3xl"
        >
          <GiEvilMoon />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = router.pathname === item.href || router.pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-pixel text-xl px-3 py-1 transition-colors ${
                  active ? 'text-moon-glow' : 'text-moon-silver/80 hover:text-moon-glow'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href="mailto:doit@praisethemoon.org"
            className="font-pixel text-xl px-3 py-1 text-moon-silver/80 hover:text-moon-glow transition-colors"
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-1">
          <a
            href="https://github.com/praisethemoon"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="p-2 text-moon-silver/80 hover:text-moon-glow transition-colors"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://linkedin.com/in/praisethemoon"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="p-2 text-moon-silver/80 hover:text-moon-glow transition-colors"
          >
            <FaLinkedin size={20} />
          </a>
          <a
            href={YOUTUBE_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="p-2 text-moon-silver/80 hover:text-moon-glow transition-colors"
          >
            <FaYoutube size={20} />
          </a>
        </div>
      </div>

      {/* Mobile nav row */}
      <nav className="md:hidden flex items-center justify-center gap-2 pb-2 px-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-pixel text-base px-2 py-1 text-moon-silver/80 hover:text-moon-glow"
          >
            {item.label}
          </Link>
        ))}
        <a
          href="mailto:doit@praisethemoon.org"
          className="font-pixel text-base px-2 py-1 text-moon-silver/80 hover:text-moon-glow"
        >
          Contact
        </a>
      </nav>
    </header>
  );
};

export default Header;
