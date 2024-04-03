import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { BsCodeSquare } from 'react-icons/bs';
import { CiCircleMore, CiStickyNote } from 'react-icons/ci';
import { FaBalanceScale, FaBook, FaDiscord, FaDownload, FaGithub, FaHome, FaLinkedin, FaQuestionCircle, FaRegNewspaper, FaUniversity } from "react-icons/fa";
import { GiEvilMoon, GiMaterialsScience, GiMoon, GiSecretBook, GiSpellBook } from 'react-icons/gi';
import { HiUserGroup } from 'react-icons/hi';
import { IoPeopleCircleOutline } from 'react-icons/io5';
import { LuPackageSearch } from 'react-icons/lu';
import { SiAwesomelists } from 'react-icons/si';
import { TbLicense, TbPackages } from 'react-icons/tb';

const Header: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        // Function to close all <details> elements
        const closeAllDetails = () => {
            document.querySelectorAll('#header-menu details[open]').forEach((detailsElement) => {
                detailsElement.removeAttribute('open');
            });
        };

        // Close all <details> elements upon route changes
        router.events.on('routeChangeComplete', closeAllDetails);

        // Cleanup listener when component unmounts
        return () => {
            router.events.off('routeChangeComplete', closeAllDetails);
        };
    }, [router.events]);

    return (
        <div className="navbar bg-base-100 w-full z-50" id="header-menu">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link href={'/'}><FaRegNewspaper size={20} /> Blog</Link></li>
                        <li><Link href={'/research'}><GiMaterialsScience size={20}/> Publications</Link></li>
                        <li><Link href={'/about'}><GiMoon size={20}/> About</Link></li>
                    </ul>
                </div>
                <Link className="btn btn-ghost text-xl dancing-script-moon" href='/'><GiEvilMoon/></Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal menu-hover px-1">
                    <li><Link href={'/'}><FaRegNewspaper size={20} /> Blog</Link></li>
                    <li><Link href={'/research'}><GiMaterialsScience size={20}/> Publications</Link></li>
                    <li><Link href={'/about'}><GiMoon size={20}/> About</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                <Link className="btn btn-ghost" href="https://linkedin.com/in/praisethemoon"><FaLinkedin size={24} /></Link>
                <Link className="btn btn-ghost" href="https://github.com/praisethemoon"><FaGithub size={24} /></Link>
            </div>
        </div>
    );
};

export default Header;
