import React from 'react';
import fs from 'fs';
import path from 'path';
import { useRouter } from 'next/router';
import matter from 'gray-matter';
import Head from 'next/head';
import HeroBanner from '@/components/HeroBanner';

export type BlogPost = {
  name: string;
  title: string;
  date: string;
  published: boolean;
  tags: string[];
  excerpt: string;
};

const BlogIndex: React.FC<{ posts: BlogPost[] }> = ({ posts }) => {
  const router = useRouter();

  return (
    <div className="starfield-bg min-h-[calc(100vh-4rem)]">
      <Head>
        <title>praisethemoon — blog</title>
      </Head>

      <HeroBanner title="Blog" subtitle="notes from the moon" />

      <div className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        <div className="space-y-2">
          {posts.map((post) => (
            <article
              key={post.name}
              onClick={() => router.push(`/blog/${post.name}`)}
              className="group cursor-pointer p-5 border border-transparent hover:border-moon-silver/30 hover:bg-moon-dusk/40 transition-colors"
            >
              <h2 className="font-pixel text-3xl md:text-4xl text-moon-glow group-hover:text-white">
                {post.title}
              </h2>
              <small className="block mt-1 font-pixel text-moon-mist text-base">
                {post.date}
              </small>
              <p className="mt-3 text-moon-silver/85 leading-relaxed">
                {post.excerpt}
              </p>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-pixel text-sm px-2 py-0.5 border border-moon-silver/30 text-moon-mist"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames
    .filter((filename) => /\.mdx?$/.test(filename))
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      let excerpt = '';
      const excerptSeparator = '{/* excerpt */}';
      if (content.includes(excerptSeparator)) {
        excerpt = content.split(excerptSeparator)[0];
      }

      return {
        name: filename.replace(/\.mdx?$/, ''),
        ...data,
        excerpt,
      };
    });

  posts.sort((a, b) => {
    // @ts-ignore
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return { props: { posts } };
}

export default BlogIndex;
