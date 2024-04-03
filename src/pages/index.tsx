import React from 'react';
import fs from 'fs';
import path from 'path';
import { useRouter } from 'next/router';
import matter from 'gray-matter';
import { GiEvilMoon } from 'react-icons/gi';
import Head from 'next/head';

export type BlogPost = {
    name: string,
    title: string
    date: string,
    published: boolean,
    tags: string[],
    excerpt: string
};

interface Posts {
    blogPosts: BlogPost[];
}

const BlogPosts: React.FC<{ posts: BlogPost[] }> = ({ posts }) => {
    const router = useRouter()

    return (

        <div>
            <Head>
                <title>praisethemoon's blog</title>
            </Head>
            <div className="striped1 hero bg-base-100 py-20">
                <div>
                    <div className="hero-content text-center">
                        <div className="gap-x-40 text-center flex flex-col">
                            <p className="text-3xl">Hi.</p>
                        </div>
                    </div>
                </div>

            </div>

            <div className="hero bg-base-100">
                <div className="py-20 w-700">
                    <div className="prose lg:prose-md m-auto">
                        {posts.map((post) => (
                            <>
                                <div id={post.name} className='p-5 hover:bg-base-200 cursor-pointer' onClick={() => router.push(`/blog/${post.name}`)}>
                                    <h1 key={post.name}>{post.title}</h1>
                                    <small>{post.date}</small>
                                    <p>{post.excerpt}</p>
                                    {post.tags.map((tag) => (
                                        <div key={tag} className="badge badge-neutral mx-2">{tag}</div>
                                    ))}
                                </div>
                                <hr />
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    );
};

export async function getStaticProps() {
    // Path to the _meta.json file
    const postsDirectory = path.join(process.cwd(), 'posts');


    let filenames = fs.readdirSync(path.join(process.cwd(), 'posts'));

    const posts = filenames.filter(filename => /\.mdx?$/.test(filename)).map(filename => {
        // Define the full path to the file
        const filePath = path.join(postsDirectory, filename);
        // Read the file contents as a string
        const fileContents = fs.readFileSync(filePath, 'utf8');
        // Use gray-matter to parse the post metadata section
        const { data, content } = matter(fileContents);


        // Extract excerpt
        let excerpt = "";
        const excerptSeparator = "{/* excerpt */}";
        if (content.includes(excerptSeparator)) {
            excerpt = content.split(excerptSeparator)[0];
        }

        // Add the file name (without extension) as the name property
        return {
            name: filename.replace(/\.mdx?$/, ''),
            ...data,
            excerpt
        }
    });

    // sort by date
    posts.sort((a, b) => {
        // @ts-ignore
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });



    // Return the list of posts as props
    return {
        props: {
            posts,
        },
    };
}

export default BlogPosts;
