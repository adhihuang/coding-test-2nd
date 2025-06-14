'use client';
import axios from 'axios';
import { useCallback, useState , useEffect} from 'react';

  interface DocumentItem {
    file_name: string;
    file_size: number;
  }

  interface ListDocumentsProps {
    refreshKey: number;
  }
export default function ListDocuments() {
    const [documents, setDocuments] = useState<DocumentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const handleRefreshDocuments = () => {
        setRefreshKey(prev => prev + 1);
    };
    
    useEffect(() => {
        axios.get("http://localhost:8000/api/documents")
          .then((res) => {
            const docs = res.data.map((doc: any, index: number) => ({
              no: index + 1,
              file_name: doc.file_name,
              file_size: doc.file_size,
            }));
            setDocuments(docs);
          })
          .catch((err) => {
            console.error("Error get documents:", err);
          })
          .finally(() => {
            setLoading(false);
          });
    }, [refreshKey]);

  return (
    <div className="p-4 border rounded-md shadow overflow-scroll">
      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
            <tr>
                <th className="border px-4 py-2 text-left cursor-pointer">No</th>
                <th className="border px-4 py-2 text-left cursor-pointer">File Name</th>
                <th className="border px-4 py-2 text-left cursor-pointer">File Size</th>
            </tr>
        </thead>
        <tbody>
            {documents.map((doc, index) => (
                <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{doc.file_name}</td>
                <td className="border px-4 py-2">{(Number(doc.file_size) / 1024).toFixed(2)} KB</td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
