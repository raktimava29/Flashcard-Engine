from fastapi import APIRouter, UploadFile, File
from app.utils.pdf_parser import extract_text

router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    contents = await file.read()
    
    extracted_text = extract_text(contents)
    
    return{
        "filename": file.filename,
        "content_type": extracted_text[:1000]
    }