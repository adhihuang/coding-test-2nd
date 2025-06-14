import os
from typing import List, Dict, Any

import pdfplumber
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from config import (
    settings , 
    WEBUI_DB
)
import logging

logger = logging.getLogger(__name__)

class PDFProcessor:
    def __init__(self , file_path):
        self.file_path = file_path
        self.splitter = RecursiveCharacterTextSplitter(chunk_size=settings.chunk_size, chunk_overlap=settings.chunk_overlap)
            
    def extract_text_from_pdf(self) -> List[Dict[str, Any]]:
        """Extract text from PDF and return page-wise content"""
        documents = []
        with pdfplumber.open(self.file_path) as pdf:
            for page_num, page in enumerate(pdf.pages, start=1):
                text = page.extract_text()
                if text:
                    documents.append(Document(
                        page_content=text,
                        metadata={
                            "source": os.path.basename(self.file_path),
                            "page": page_num
                        }
                    ))
        return documents
    
    def split_into_chunks(self, documents: List[Document]) -> List[Document]:
        splitter = self.splitter
        return splitter.split_documents(documents)

    def process_pdf(self):
        """Process PDF file and return list of Document objects"""
        extracted_docs = self.extract_text_from_pdf()
        chunked_docs = self.split_into_chunks(extracted_docs)

        return chunked_docs

