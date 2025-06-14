'use client';

import React , { useState } from 'react';
import { useEffect } from "react";
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import FileUpload from '@/components/documents/FileUpload';
import ListDocuments from '@/components/documents/ListDocuments';

export default function Documents() {
    const [refreshKey, setRefreshKey] = useState(0);

    // ✅ Fungsi ini harus dideklarasikan dulu
    const handleRefreshDocuments = () => {
        setRefreshKey((prev) => prev + 1);
    };
  return (
    <>
        <Header />
        <Navbar />
    
        <main className="main-container">
            <div className="pc-container">
                <div className="pc-content">
                    <div className="grid uploads">
                        <FileUpload onUploadComplete={handleRefreshDocuments} />
                    </div>

                    <div className="grid documents h-26rem">
                        <ListDocuments></ListDocuments>
                    </div>
                </div>
            </div>
        </main>
    </>
  );
} 