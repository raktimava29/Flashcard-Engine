import fitz

def clean_text(text:str) -> str:
    text = text.replace("\n", " ")
    
    text = " ".join(text.split())
    
    return text

def extract_text(file_bytes: bytes) -> str:
    text = ""
    
    with fitz.open(stream = file_bytes, filetype = "pdf") as doc:
        for page in doc:
            text += page.get_text()
            
    return clean_text(text)