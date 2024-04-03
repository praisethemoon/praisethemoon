// src/pages/CodeOfConduct.tsx
import Head from 'next/head';
import React from 'react';

const Research: React.FC = () => {
    return (
        <div>
        <Head>
            <title>praisethemoon&apos;s research</title>
        </Head>
            <div className="striped1 hero bg-base-100 py-20">
                <div>
                    <div className="hero-content text-center">
                        <div className="gap-x-40">
                            <p className="text-5xl">Research & Papers</p>

                            <p>
                                List of research and papers written by Le Me
                            </p>
                        </div>
                    </div>

                </div>

            </div>

            {/*<div className="hero bg-base-100">*/}

            <div className="flex flex-1">
                <div className='hero bg-base-200 py-20 w-200'>
                    <p>Sadly there is nothing here just yet!</p>
                    {/*
                    <div className="prose lg:prose-md m-auto">
                        <h2>Type-C: A Type-Safe Programming Language</h2>
                        <p>Soulaymen Chouri</p>
                    </div>
                    */}
                </div>
            </div>
        </div>
    );
};

export default Research;
