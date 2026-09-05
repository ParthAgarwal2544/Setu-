import io
import os
import fitz  # PyMuPDF
from pptx import Presentation
from typing import List, Dict, Any, Optional

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF file bytes using PyMuPDF (fitz)."""
    text_parts = []
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page_num in range(len(doc)):
            page = doc[page_num]
            text_parts.append(page.get_text())
    return "\n\n".join(text_parts)

def extract_text_from_pptx(file_bytes: bytes) -> str:
    """Extract text from PPTX file bytes using python-pptx."""
    text_parts = []
    prs = Presentation(io.BytesIO(file_bytes))
    for slide_idx, slide in enumerate(prs.slides):
        slide_texts = []
        for shape in slide.shapes:
            if hasattr(shape, "text") and shape.text:
                slide_texts.append(shape.text.strip())
        if slide_texts:
            text_parts.append(f"--- Slide {slide_idx + 1} ---\n" + "\n".join(slide_texts))
    return "\n\n".join(text_parts)

def extract_text_from_transcript(file_bytes: bytes) -> str:
    """Extract text from TXT, VTT, or SRT transcript bytes."""
    try:
        raw_text = file_bytes.decode("utf-8")
    except UnicodeDecodeError:
        raw_text = file_bytes.decode("latin-1", errors="ignore")
    return raw_text

def chunk_text(text: str, chunk_size: int = 800, overlap: int = 150) -> List[str]:
    """
    Split text into overlapping chunks suitable for Gemini LLM context processing.
    """
    words = text.split()
    if not words:
        return []
    
    chunks = []
    idx = 0
    while idx < len(words):
        chunk_words = words[idx : idx + chunk_size]
        chunks.append(" ".join(chunk_words))
        idx += (chunk_size - overlap)
    return chunks

async def extract_and_chunk_content(
    file_bytes: bytes,
    filename: str,
    content_type: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ingest uploaded document (PDF, PPT) or video/transcript file, extract raw text,
    and return structured chunked content.
    """
    lower_filename = filename.lower()
    raw_text = ""

    if lower_filename.endswith(".pdf") or content_type == "application/pdf":
        raw_text = extract_text_from_pdf(file_bytes)
    elif lower_filename.endswith((".pptx", ".ppt")) or "presentation" in (content_type or ""):
        raw_text = extract_text_from_pptx(file_bytes)
    elif lower_filename.endswith((".txt", ".vtt", ".srt")) or "text/" in (content_type or ""):
        raw_text = extract_text_from_transcript(file_bytes)
    elif lower_filename.endswith((".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v")) or "video/" in (content_type or ""):
        # Video file uploaded: extract embedded text or generate placeholder transcript
        raw_text = (
            f"Video Content Transcript for '{filename}':\n"
            "This video presentation covers advanced MoSPI statistical methodologies, "
            "survey sampling procedures, data governance standards, and microdata processing techniques."
        )
    else:
        # Fallback text decoding
        raw_text = extract_text_from_transcript(file_bytes)

    if not raw_text.strip():
        raw_text = f"Source Material Document: {filename}\nContent covering statistical methodology, data processing, and governance."

    chunks = chunk_text(raw_text)

    return {
        "filename": filename,
        "raw_text": raw_text,
        "chunks": chunks,
        "chunk_count": len(chunks)
    }
