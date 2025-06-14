from typing import List, Tuple
from langchain.schema import Document
from langchain.vectorstores import VectorStore
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings

from config import settings
import logging , os 

logger = logging.getLogger(__name__)

class VectorStoreService:
    def __init__(self):
        self.path = settings.vector_db_path
        self.embedding_model = SentenceTransformerEmbeddings(model_name="BAAI/bge-m3")

        self.vectorstore = Chroma(
            persist_directory=self.path,
            embedding_function=self.embedding_model
        )
    
    def add_documents(self , documents: List[Document]) -> None:
        """Add documents to the vector store"""
        self.vectorstore.add_documents(documents)
        self.vectorstore.persist()
    
    def similarity_search(self, query: str, k: int) -> List[Tuple[Document, float]]:
        return self.vectorstore.similarity_search_with_score(query, k=k)
    
    def delete_documents(self, document_ids: List[str]) -> None:
        """Delete documents from vector store"""
        # TODO: Implement document deletion
        pass
    
    def get_document_count(self) -> int:
        """Get total number of documents in vector store"""
        # TODO: Return document count
        pass 