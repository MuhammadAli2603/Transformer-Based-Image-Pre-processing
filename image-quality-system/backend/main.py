from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Dict
import logging
import os
from dotenv import load_dotenv

from models.quality_classifier import QualityClassifier
from utils.image_processing import ImageProcessor
from middleware.auth import get_current_user, get_current_user_id

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Image Quality Classification API",
    description="API for analyzing and classifying image quality",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize classifier
classifier = QualityClassifier()
image_processor = ImageProcessor()


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Image Quality Classification API",
        "version": "1.0.0",
        "endpoints": {
            "POST /classify-quality": "Classify image quality",
            "GET /health": "Health check"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Image Quality API"
    }


@app.post("/classify-quality")
async def classify_quality(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id)
):
    """
    Classify image quality based on multiple metrics.
    Requires authentication.

    Args:
        file: Uploaded image file
        user_id: Current authenticated user ID (from JWT token)

    Returns:
        JSON with quality score, category, and detailed metrics
    """
    try:
        # Read file contents
        contents = await file.read()

        # Validate image
        is_valid, error_message = image_processor.validate_image(contents, file.filename)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_message)

        # Log file info
        logger.info(f"User {user_id} processing image: {file.filename}, size: {len(contents)} bytes")

        # Classify image
        result = classifier.classify_image(contents)

        # Add filename and user info to result
        result["filename"] = file.filename
        result["user_id"] = user_id

        logger.info(f"Classification complete for user {user_id}: {result['category']} (score: {result['quality_score']})")

        return JSONResponse(content=result)

    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


@app.post("/classify-batch")
async def classify_batch(
    files: List[UploadFile] = File(...),
    user_id: str = Depends(get_current_user_id)
):
    """
    Classify multiple images in batch.
    Requires authentication.

    Args:
        files: List of uploaded image files
        user_id: Current authenticated user ID (from JWT token)

    Returns:
        JSON array with results for each image
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    if len(files) > 20:
        raise HTTPException(status_code=400, detail="Maximum 20 files allowed per batch")

    results = []
    errors = []

    logger.info(f"User {user_id} starting batch processing of {len(files)} images")

    for idx, file in enumerate(files):
        try:
            # Read file contents
            contents = await file.read()

            # Validate image
            is_valid, error_message = image_processor.validate_image(contents, file.filename)
            if not is_valid:
                errors.append({
                    "filename": file.filename,
                    "error": error_message
                })
                continue

            # Classify image
            result = classifier.classify_image(contents)
            result["filename"] = file.filename
            result["user_id"] = user_id

            results.append(result)
            logger.info(f"[{idx+1}/{len(files)}] User {user_id} processed: {file.filename}")

        except Exception as e:
            logger.error(f"Error processing {file.filename}: {str(e)}")
            errors.append({
                "filename": file.filename,
                "error": str(e)
            })

    return JSONResponse(content={
        "results": results,
        "errors": errors,
        "total_processed": len(results),
        "total_errors": len(errors),
        "user_id": user_id
    })


@app.exception_handler(404)
async def not_found_handler(request, exc):
    """Handle 404 errors"""
    return JSONResponse(
        status_code=404,
        content={"detail": "Endpoint not found"}
    )


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
