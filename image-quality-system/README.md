# Image Quality Classification System

A full-stack image quality classification system using **Next.js 14** (App Router) for the frontend and **FastAPI** for the backend. This application analyzes images using computer vision techniques to classify them into quality categories.

## Features

### Authentication
- **Clerk Integration**: Secure user authentication and session management
- **Protected Routes**: All upload and analysis endpoints require authentication
- **JWT Verification**: Backend validates Clerk JWT tokens for API security

### Backend (FastAPI)
- **Quality Analysis Endpoint**: `/classify-quality` - Analyzes single images (Auth Required)
- **Batch Processing**: `/classify-batch` - Processes multiple images simultaneously (Auth Required)
- **Quality Metrics**:
  - Sharpness (Laplacian variance)
  - Brightness levels
  - Contrast ratio
  - Resolution score
- **Quality Categories**:
  - Bad Quality (score < 0.4)
  - Normal Quality (score 0.4-0.7)
  - High Quality (score > 0.7)
- **File Validation**: Format and size checking
- **CORS Support**: Configured for Next.js frontend
- **Comprehensive Error Handling**

### Frontend (Next.js 14)
- **User Authentication**: Secure sign-in/sign-up with Clerk
- **Protected Dashboard**: User-specific upload and analysis history
- **Modern UI**: Built with Next.js 14 App Router and TypeScript
- **Drag & Drop Upload**: Multi-image upload support using react-dropzone
- **Real-time Progress**: Live progress tracking during analysis
- **Quality Dashboard**: Visual representation of results by category
- **Statistics Cards**: Animated counters showing analysis summary
- **Detailed Metrics**: View sharpness, brightness, contrast, and resolution for each image
- **Export Functionality**: Download results as JSON
- **Responsive Design**: Mobile and desktop optimized
- **Tailwind CSS**: Modern, utility-first styling

## Project Structure

```
image-quality-system/
├── backend/
│   ├── main.py                    # FastAPI server
│   ├── models/
│   │   └── quality_classifier.py  # Quality classification logic
│   ├── utils/
│   │   └── image_processing.py    # Image validation utilities
│   ├── requirements.txt           # Python dependencies
│   └── .env                       # Environment variables
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # Main page component
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── ImageUploader.tsx     # Drag & drop uploader
│   │   ├── QualityResults.tsx    # Results display
│   │   ├── ProgressBar.tsx       # Progress indicator
│   │   └── StatsCard.tsx         # Statistics card
│   ├── lib/
│   │   └── api.ts                # API client
│   ├── package.json              # Node dependencies
│   ├── tsconfig.json             # TypeScript config
│   ├── next.config.js            # Next.js config
│   ├── tailwind.config.js        # Tailwind config
│   └── .env.local                # Frontend environment variables
└── README.md
```

## Installation

### Prerequisites
- **Python**: 3.8 or higher
- **Node.js**: 18.x or higher
- **npm** or **yarn**

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment variables in `.env`:
```env
API_HOST=0.0.0.0
API_PORT=8000
ALLOWED_ORIGINS=http://localhost:3000
CLERK_ISSUER=https://your-clerk-instance.clerk.accounts.dev
```

**Important**: Replace `your-clerk-instance` with your actual Clerk instance URL from the Clerk Dashboard.

5. Start the FastAPI server:
```bash
# Development mode with auto-reload
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000

# Clerk Authentication Keys (get from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

**Important**: Get your Clerk API keys from [Clerk Dashboard](https://dashboard.clerk.com) → Configure → API Keys.

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. **Start Both Servers**: Ensure both backend (port 8000) and frontend (port 3000) are running

2. **Open Browser**: Navigate to `http://localhost:3000`

3. **Sign In/Sign Up**: Create an account or sign in using Clerk authentication

4. **Upload Images**:
   - Drag and drop images onto the upload area
   - Or click to select files from your computer
   - Supports: PNG, JPG, JPEG, GIF, BMP, WEBP
   - Max size: 10MB per file

4. **View Results**:
   - Watch real-time progress as images are analyzed
   - View statistics dashboard with quality breakdown
   - Explore detailed metrics for each image
   - Images are grouped by quality category

5. **Export Results**: Click "Export Results" to download analysis as JSON

6. **Upload New Batch**: Click "Upload New Batch" to start over

## API Documentation

### Endpoints

#### `GET /`
Root endpoint with API information
```json
{
  "message": "Image Quality Classification API",
  "version": "1.0.0",
  "endpoints": {...}
}
```

#### `GET /health`
Health check endpoint
```json
{
  "status": "healthy",
  "service": "Image Quality API"
}
```

#### `POST /classify-quality`
Classify a single image (Authentication Required)

**Headers**:
- `Authorization: Bearer {clerk-jwt-token}`

**Request**: `multipart/form-data`
- `file`: Image file

**Response**:
```json
{
  "filename": "example.jpg",
  "quality_score": 0.752,
  "category": "high",
  "metrics": {
    "sharpness": 0.823,
    "brightness": 0.765,
    "contrast": 0.689,
    "resolution_score": 0.731
  },
  "dimensions": {
    "width": 1920,
    "height": 1080,
    "megapixels": 2.07
  }
}
```

#### `POST /classify-batch`
Classify multiple images (max 20) (Authentication Required)

**Headers**:
- `Authorization: Bearer {clerk-jwt-token}`

**Request**: `multipart/form-data`
- `files`: Array of image files

**Response**:
```json
{
  "results": [...],
  "errors": [...],
  "total_processed": 5,
  "total_errors": 0
}
```

### Interactive API Documentation
When the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Quality Metrics Explained

### Sharpness (40% weight)
- Calculated using Laplacian variance
- Measures image focus and detail
- Higher values indicate sharper images

### Brightness (20% weight)
- Optimal at 127 (middle of 0-255 range)
- Scored based on deviation from optimal
- Ensures proper exposure

### Contrast (30% weight)
- Calculated using standard deviation
- Measures difference between light and dark areas
- Higher values indicate better contrast

### Resolution (10% weight)
- Based on image dimensions (megapixels)
- Rewards higher resolution images
- Scaled scoring: 0.5 MP (low) to 5+ MP (excellent)

### Overall Quality Score
Weighted combination of all metrics, normalized to 0-1 range:
- **Bad**: < 0.4 (40%)
- **Normal**: 0.4 - 0.7 (40-70%)
- **High**: > 0.7 (70%+)

## Technologies Used

### Backend
- **FastAPI**: Modern Python web framework
- **OpenCV**: Computer vision operations
- **NumPy**: Numerical computations
- **Pillow**: Image processing
- **PyJWT**: JWT token verification
- **Cryptography**: Secure token validation
- **Uvicorn**: ASGI server

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Clerk**: Authentication and user management
- **Tailwind CSS**: Utility-first CSS framework
- **React Dropzone**: File upload component
- **Axios**: HTTP client
- **Framer Motion**: Animations

## Development

### Running Tests
```bash
# Backend tests (if implemented)
cd backend
pytest

# Frontend tests (if implemented)
cd frontend
npm test
```

### Building for Production

**Backend**:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

**Frontend**:
```bash
cd frontend
npm run build
npm start
```

## Troubleshooting

### Backend Issues

**Port already in use**:
```bash
# Change port in main.py or use different port
uvicorn main:app --reload --port 8001
```

**Module not found errors**:
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

**OpenCV issues on Windows**:
```bash
pip install opencv-python-headless
```

### Frontend Issues

**Module not found errors**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**CORS errors**:
- Ensure backend CORS settings allow `http://localhost:3000`
- Check `.env.local` has correct API URL

**Type errors**:
```bash
# Regenerate TypeScript types
npm run build
```

## Authentication

This application uses **Clerk** for secure user authentication. See [AUTHENTICATION.md](./AUTHENTICATION.md) for detailed setup instructions.

**Key Features**:
- Secure JWT-based authentication
- Protected API endpoints
- User-specific analysis tracking
- Session management

## Future Enhancements

- [x] User authentication and session management (Clerk)
- [ ] Database integration for storing user analysis history
- [ ] Image preprocessing options
- [ ] Batch export in multiple formats (CSV, Excel)
- [ ] Advanced filters and sorting
- [ ] Comparison mode for multiple images
- [ ] AI model integration for enhanced analysis
- [ ] Cloud storage integration
- [ ] Docker containerization
- [ ] API rate limiting

## License

MIT License - feel free to use this project for learning and development.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the project repository.

---

**Built with ❤️ using Next.js 14 and FastAPI**
