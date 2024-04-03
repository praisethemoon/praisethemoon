import { GetStaticPaths, GetStaticProps } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import fs from 'fs';
import path from 'path';
import { BlogPost } from '..';
import MDXComponents from '@/components/MDXComponents';
import Link from 'next/link';
import { FaRegNewspaper } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { useEffect, useRef } from 'react';
import matter from 'gray-matter';
import GistEmbed from '@/components/GistEmbed';
import remarkGfm from 'remark-gfm';
import Head from 'next/head'


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
        theme: 'github-light',
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
        <div>
            <Head>
                <title>{meta.title}</title>
            </Head>
            <div className="striped1 hero bg-base-100 py-20">
                <div>
                    <div className="hero-content text-center">
                        <div className="gap-x-40 text-center flex flex-col text-center  items-center">
                            <p className="text-5xl">{meta.title}</p>
                            <p className='m-1'>{meta.date}</p>
                            <div className="flex flex-row gap-x-2">
                                {meta.tags.map((tag: string) => (
                                    <div key={tag} className="badge badge-neutral">{tag}</div>
                                ))}
                            </div>
                            <div className="text-sm breadcrumbs">
                                <ul>
                                    <li>
                                        <Link href="/">
                                            <FaRegNewspaper className='mx-2' /> praisetheblog
                                        </Link>
                                    </li>
                                    <li>
                                        <a>
                                            <HiOutlineDocumentText className='mx-2' />{meta.title}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="hero bg-base-100">
                <div className="py-40 w-700">
                    <div className="prose lg:prose-md m-auto">
                        <MDXRemote {...source} components={{GistEmbed, ...MDXComponents}} />
                    </div>
                </div>
            </div>

            <div className='bg-base-200 min-h-[400px]'>
                <UtterancesComments/>
            </div>
            <div className="striped1 hero bg-base-100 py-20">
                <div className="py-1 w-700">
                    <div className='prose lg:prose-md m-auto b-1'>
                        <p>Articles written in this blog are my own opinions and do not reflect the views of my employer. Content on this website is original unless mentioned otherwise. Original content is licensed under a CC BY 4.0 Deed. Some of the content might have been preprocessed by AI for clarity and articulation.</p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default PostPage;
