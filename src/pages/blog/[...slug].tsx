import { GetStaticPaths, GetStaticProps } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import fs from 'fs';
import path from 'path';
import MDXComponents from '@/components/MDXComponents';
import Link from 'next/link';
import { FaRegNewspaper } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { useEffect, useRef } from 'react';
import matter from 'gray-matter';
import GistEmbed from '@/components/GistEmbed';
import remarkGfm from 'remark-gfm';
import Head from 'next/head'
import HeroBanner from '@/components/HeroBanner';


// Define the path to your posts directory
const postsDirectory = path.join(process.cwd(), 'posts');

const UtterancesComments = () => {
    const ref = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const script = document.createElement('script');
  
      const config = {
        src: 'https://utteranc.es/client.js',
        repo: 'praisethemoon/blog',
        'issue-term': 'pathname',
        theme: 'photon-dark',
        crossOrigin: 'anonymous',
        defer: true,
      };
  
      Object.entries(config).forEach(([key, value]) => {
        script.setAttribute(key, value as string);
      });
  
      setTimeout(() => {
        ref.current?.append(script);
      }, 300);
    }, []);
  
    return <div ref={ref} />;
  };

  export const getStaticProps: GetStaticProps = async (context) => {
    // @ts-ignore
    const slug = context.params?.slug[0];
    const mdxPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(mdxPath, 'utf8');

    // Parse the file content to get metadata and content
    const { data: meta, content } = matter(fileContents);

    // Use MDXRemote to serialize the MDX content, including excerpt extraction if needed
    const mdxSource = await serialize(content, {
        // Configuration for MDX serialization
        mdxOptions: {
            remarkPlugins: [remarkGfm], // Use remarkGfm for GitHub Flavored Markdown
            // Add other configurations or plugins if needed
        },
    });

    // Assuming you adjust the structure to include author directly in post metadata
    // If not, you'll need a separate approach to link authors to posts

    return {
        props: {
            source: mdxSource,
            meta, // Pass the post metadata directly
        },
    };
};


export const getStaticPaths: GetStaticPaths = async () => {
    const filenames = fs.readdirSync(postsDirectory);
    const paths = filenames.filter(filename => /\.mdx?$/.test(filename)).map(filename => ({
        params: { slug: [filename.replace(/\.mdx?$/, '')] },
    }));

    return { paths, fallback: false };
};

const PostPage = ({ source, meta }: any) => {
    return (
        <div className="starfield-bg">
            <Head>
                <title>{meta.title}</title>
            </Head>

            <HeroBanner title={meta.title} subtitle={meta.date}>
                {meta.tags && meta.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {meta.tags.map((tag: string) => (
                            <span key={tag} className="font-pixel text-sm px-2 py-0.5 border border-moon-silver/30 text-moon-mist bg-moon-deep/40 backdrop-blur-sm">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
                <nav className="mt-4 font-pixel text-base text-moon-mist flex items-center justify-center gap-2">
                    <Link href="/blog" className="hover:text-moon-glow inline-flex items-center gap-1">
                        <FaRegNewspaper /> blog
                    </Link>
                    <span>/</span>
                    <span className="inline-flex items-center gap-1 text-moon-silver">
                        <HiOutlineDocumentText /> {meta.title}
                    </span>
                </nav>
            </HeroBanner>

            <article className="max-w-3xl mx-auto px-6 pt-12 pb-24">
                <div className="prose prose-invert lg:prose-md mx-auto">
                    <MDXRemote {...source} components={{ GistEmbed, ...MDXComponents }} />
                </div>
            </article>

            <section className="border-t border-moon-silver/10 bg-moon-night/40 py-12 px-6">
                <div className="max-w-3xl mx-auto">
                    <UtterancesComments />
                </div>
            </section>

            <section className="py-10 px-6 text-center">
                <p className="max-w-3xl mx-auto text-sm text-moon-mist/80">
                    Articles written in this blog are my own opinions and do not reflect the views of my employer.
                    Content is original unless stated otherwise, and licensed CC BY 4.0. Some passages may be
                    AI-polished for clarity.
                </p>
            </section>
        </div>
    );
};

export default PostPage;
