import React from 'react';
import getUnicodeFlagIcon from 'country-flag-icons/unicode'

const About: React.FC = () => {
    return (
        <div>
            <div className="hero bg-base-100 py-20 bg-cover bg-center bg-no-repeat min-h-[400px]" style={{backgroundImage: "url('/images/gris-bg.jpeg')"}}>
                <div>
                    <div className="hero-content text-center text-white">
                        <div className="gap-x-40">
                            <p className="text-5xl">About</p>
                        </div>
                    </div>

                </div>

            </div>

            {/*<div className="hero bg-base-100">*/}

            <div className="flex flex-1">
                <div className='hero bg-base-200 py-20 w-200'>
                    <div className="card card-side bg-base-100 shadow-xl">
                        <figure><img src="/images/me.png" alt="Movie" /></figure>
                        <div className="card-body max-w-xl">
                            <h2 className="card-title">About:</h2>
                            <p>Hi! My name is Soulaymen Chouri, I am a Software Engineer and Data Scientist, my projects vary from Data Science, Software Engineering, Programming Language, Fullstack development, Video Game Development and more.
                                I am from {getUnicodeFlagIcon('TN')} where I was raised and studied, and now I live and work in {getUnicodeFlagIcon('DE')}.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='hero bg-base-100 py-5 w-200'>
                <div className="mt-10">
                    {/* Experience Section */}
                    <div className="mb-5">
                        <h2 className="text-3xl font-bold">Fun Facts</h2>
                        <ul className="list-disc list-inside">
                            <li className="mb-2">I am a huge fan of Gris, the video game, the image in the banner of this page is a Gris screenshot.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
