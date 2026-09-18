# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack image quality classification system that analyzes images using computer vision techniques and classifies them into quality categories (bad < 0.4, normal 0.4-0.7, high > 0.7).

**Backend**: FastAPI server (port 8000) with OpenCV-based quality analysis
**Frontend**: Next.js 14 (App Router) with TypeScript (port 3000)

## Development Commands

### Backend (Python/FastAPI)

```bash
cd backend

# Activate virtual environment
venv\Scripts\activate              # Windows
source venv/bin/activate           # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run development server (auto-reload enabled)
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

## Architecture

### Backend Structure

The backend follows a modular FastAPI architecture:

- **main.py**: FastAPI app entry point, defines endpoints (`/classify-quality`, `/classify-batch`, `/health`)
- **models/quality_classifier.py**: Core classification logic - calculates weighted quality score from 4 metrics:
  - Sharpness (40% weight): Laplacian variance for image focus
  - Brightness (20% weight): Optimal at 127, scored by deviation
  - Contrast (30% weight): Standard deviation of pixel intensities
  - Resolution (10% weight): Megapixel-based scoring
- **utils/image_processing.py**: Input validation (file type, size limit 10MB, format verification)

Quality classification pipeline:
1. Upload validation → 2. OpenCV image conversion (RGB→BGR) → 3. Individual metric calculations → 4. Weighted score aggregation → 5. Category assignment

### Frontend Structure

Next.js 14 App Router with client-side state management:

- **app/page.tsx**: Main application page, orchestrates upload flow and state
- **lib/api.ts**: Axios-based API client with TypeScript interfaces for backend communication
- **components/**: Reusable UI components
  - `ImageUploader.tsx`: Drag-and-drop file upload (react-dropzone)
  - `QualityResults.tsx`: Results display grouped by quality category
  - `ProgressBar.tsx`: Real-time upload/analysis progress tracking
  - `DashboardLayout.tsx`: Application layout structure
  - `MetricCard.tsx`, `StatsCard.tsx`: Metric visualization components
  - `QualityChart.tsx`, `CategoryBreakdown.tsx`: Data visualization (recharts)
  - `AIInsightsCard.tsx`, `RecentAnalysis.tsx`: Additional analytics UI

Data flow: File upload → Sequential API calls (one image at a time for progress tracking) → Real-time result updates → Category-grouped display

### Key Technical Details

**Backend**:
- OpenCV processes images in BGR format; handles RGB, RGBA, and grayscale conversions
- All endpoints return JSON responses via `JSONResponse`
- CORS enabled for all origins (development mode)
- Batch processing limited to 20 images max
- Comprehensive error handling with HTTPException

**Frontend**:
- API URL configured via `NEXT_PUBLIC_API_URL` environment variable (defaults to `http://localhost:8000`)
- Sequential image processing (not parallel) to provide real-time progress feedback
- Results stored in component state, not persisted
- All components use TypeScript with strict typing from `lib/api.ts`

## Common Development Patterns

When modifying quality metrics:
1. Update calculation methods in `backend/models/quality_classifier.py`
2. Adjust weights in `__init__` if needed
3. Update TypeScript interfaces in `frontend/lib/api.ts` if response structure changes

When adding new endpoints:
1. Define route in `backend/main.py`
2. Add corresponding method to `ImageQualityAPI` class in `frontend/lib/api.ts`
3. Update TypeScript interfaces for request/response types

Environment variables:
- Backend: Optional `.env` for `API_HOST`, `API_PORT`, `ALLOWED_ORIGINS`
- Frontend: `.env.local` for `NEXT_PUBLIC_API_URL`

## Dependencies

**Backend** (requirements.txt):
- FastAPI, Uvicorn (web framework & ASGI server)
- OpenCV (cv2), NumPy, Pillow (image processing)
- python-multipart (file upload handling)

**Frontend** (package.json):
- Next.js 14, React 18, TypeScript
- Axios (HTTP client)
- react-dropzone (file upload)
- Tailwind CSS (styling)
- framer-motion (animations)
- recharts (data visualization)
- lucide-react (icons)

## Testing & Debugging

Backend API documentation (when server running):
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

Health check: `curl http://localhost:8000/health`

Common issues:
- **CORS errors**: Verify backend CORS settings and frontend API URL
- **OpenCV import errors**: Use `opencv-python-headless` on Windows if needed
- **Port conflicts**: Backend defaults to 8000, frontend to 3000
