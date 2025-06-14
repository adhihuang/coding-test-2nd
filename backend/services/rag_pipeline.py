from typing import List, Dict, Any
from langchain.schema import Document
from services.vector_store import VectorStoreService
from services.llm_service import LLMClient
import logging

logger = logging.getLogger(__name__)


class RAGPipeline:
    def __init__(self):
        self.vector_store = VectorStoreService()
        self.llm = LLMClient()
    
    def generate_answer(self, question: str, chat_history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        logger.info(" ============== Generate Answer : Start ============== ")
        
        documents = self.vector_store.similarity_search(question , 2)
        context = self._generate_context(documents)
        response = self.llm.ask_with_context(question, context)
        
        sources = []
        for doc , score in documents:
            page = doc.metadata.get("page", 0)
            content = doc.page_content.strip()

            sources.append({
                "content" : content,
                "page" : page, 
                "score" : score,
                "metadata" : doc.metadata
            })

        logger.info(" ============== Generate Answer : Done ============== ")
        return response, sources
    
    def _retrieve_documents(self, query: str) -> List[Document]:
        """Retrieve relevant documents for the query"""
        # TODO: Implement document retrieval
        # - Search vector store for similar documents
        # - Filter by similarity threshold
        # - Return top-k documents
        pass
    
    def _generate_context(self, documents: List[Document]) -> str:
        context_chunks = []
        for doc , _ in documents:
            source = doc.metadata.get("source", "unknown")
            page = doc.metadata.get("page", "unknown")
            content = doc.page_content.strip()
            
            chunk = f"[Source: {source}, Page: {page}]\n{content}"
            context_chunks.append(chunk)
            
        return "\n\n---\n\n".join(context_chunks)
    