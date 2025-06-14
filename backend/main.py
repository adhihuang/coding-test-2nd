from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from models.schemas import ChatRequest, ChatResponse, DocumentSource
from services.pdf_processor import PDFProcessor
from services.vector_store import VectorStoreService
from services.rag_pipeline import RAGPipeline
from config import settings

from migrations import RunMigrations
from services.internal.models.document import ModelDocuments

import logging
import time
import os , base64 , hashlib , datetime

# Configure logging
logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="RAG-based Financial Statement Q&A System",
    description="AI-powered Q&A system for financial documents using RAG",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
rag_pipeline = RAGPipeline()

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("Starting RAG Q&A System...")

    try:
        RunMigrations.apply_migrations()
        logger.info("Migrations applied successfully.")
    except Exception as e:
        logger.error(f"Migration failed: {e}")
        raise


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "RAG-based Financial Statement Q&A System is running"}


def generate_upload_key(filename: str) -> str:
    # Encode filename 
    b64_name = base64.urlsafe_b64encode(filename.encode()).decode().rstrip("=")
    key = f"{b64_name}"

    return key

@app.post("/api/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload and process PDF file"""
    # Get All Metadata file
    try:
        file_name = file.filename
        file_type = file.content_type

        if 'application/pdf' not in file_type:
            return {
                "code" : 0,
                "message" : "Your file is not PDF"
            }

        contents = await file.read()
        file_size = len(contents)
        file_key = generate_upload_key(file_name)
        file_path = settings.pdf_upload_path
        
        uploaded_file = f"{file_path}/{file_key}.pdf"
        with open(uploaded_file , "wb") as f:
            f.write(contents)

        documents =  {
            "filename": file_name,
            "content_type": file_type,
            "filesize": file_size,
            "file_key" : file_key,
            "path": uploaded_file
        }
        docs = ModelDocuments()
        docs.insertDocument(str(f"{file_key}.pdf") ,file_name , file_type , file_size)

        #We will process Extract , Embeddings , And Store to VectorDB
        pdf_processor = PDFProcessor(uploaded_file)
        chunked_doc = pdf_processor.process_pdf()
        vector = VectorStoreService()
        vector.add_documents(chunked_doc)

        return {
            "code" : 200,
            "message" : "Upload file was success"
        }
    except Exception as error:
        logger.info(f"Error Processing Upload: {error}")

        return {
            "code" : "501",
            "message" : "Error Processing Upload File"
        }

@app.post("/api/chat")
async def chat(request: ChatRequest):
    start = time.time()
    logger.info(" ============== Prepare Chat ============== ")
    answer, sources = rag_pipeline.generate_answer(
        question = request.question,
        chat_history = []
    )
    end = time.time()
    duration = end - start
    
    return ChatResponse(
        answer = answer,
        sources = sources,
        processing_time=round(duration, 2)
    )
    
@app.get("/api/documents")
async def get_documents():
    """Get list of processed documents"""
    model = ModelDocuments()
    documents = model.getDocuments()

    return documents

@app.get("/api/documents/total")
async def get_documents():
    """Get list of processed documents"""
    model = ModelDocuments()
    documents = model.getTotal()

    return documents


@app.get("/api/chunks")
async def get_chunks():
    """Get document chunks (optional endpoint)"""
    # TODO: Implement chunk listing
    # - Return document chunks with metadata
    pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.host, port=settings.port, reload=settings.debug) 