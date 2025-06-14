import React from 'react';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import axios from 'axios';
import { useEffect , useState } from 'react';

interface DocumentItem {
    total_document : number
}


export default function Home() {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/documents/total")
          .then((res) => {
            const data = res.data;
            setDocuments(data.total_uploaded);
          })
          .catch((err) => {
            console.error("Error get documents:", err);
          })
    }, []);

  return (
    <>
        <Header />
        <Navbar />
    
        <main className="main-container">
            <div className="pc-container">
                <div className="pc-content">
                    <div className="grid">
                        <div className="col-span-12 xl:col-span-4 md:col-span-6">
                            <div className="card">
                                <div className="card-header !pb-0 !border-b-0">
                                    <h5>Uploaded Documents</h5>
                                </div>
                                <div className="card-body">
                                    <div className="flex items-center justify-between gap-3 flex-wrap">
                                        <h3 className="font-light flex items-center mb-0">
                                            {documents}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </>
  );
} 