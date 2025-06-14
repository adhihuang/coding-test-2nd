import React from 'react';
import Link from 'next/link';

export default function Navbar() {    
  return (
    <>
      <nav className="pc-sidebar">
        <div className="navbar-wrapper">
        <div className="m-header flex items-center text-white py-4 px-6 h-header-height">
            InterOpera Corporate Intelligence
        </div>
        <div className="navbar-content h-[calc(100vh_-_74px)] py-2.5">
            <ul className="pc-navbar">
                <li className="pc-item pc-caption">
                    <label>Navigation</label>
                </li>
                <li className="pc-item"></li>
                <li className="pc-item">
                    <Link href="/dashboard">
                        <div className='pc-link'>
                            <span className="pc-mtext">Dashboard</span>
                        </div>
                    </Link>
                    <Link href="/documents">
                        <div className='pc-link'>
                            <span className="pc-mtext">Documents</span>
                        </div>
                    </Link>
                    <Link href="/chats">
                        <div className='pc-link'>
                            <span className="pc-mtext">AI Assistant</span>
                        </div>
                    </Link>
                </li>
            </ul>
        </div>
        </div>
    </nav>
    </>
  );
} 


