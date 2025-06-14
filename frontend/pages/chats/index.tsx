import React from 'react';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import ChatBot from '@/components/ChatInterface';
import { useEffect } from "react";

// import FileUpload from '/components/FileUpload';

export default function Home() {
  return (
    <>
        <Header />
        <Navbar />
    
        <main className="main-container">
          <ChatBot/>
        </main>
    </>
  );
} 