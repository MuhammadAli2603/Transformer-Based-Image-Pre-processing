# 📸 Transformer Based Image Pre-processing

![Python](https://img.shields.io/badge/Python-3.8+-blue)
![Node](https://img.shields.io/badge/Node-18+-green)
![Flutter](https://img.shields.io/badge/Flutter-Dart-02569B)
![FastAPI](https://img.shields.io/badge/FastAPI-backend-009688)
![Next.js](https://img.shields.io/badge/Next.js-14-black)

## 🚀 Overview

This repository is a monorepo containing two independent applications:

| Project | Stack | Purpose |
|---|---|---|
| [`image-quality-system/`](./image-quality-system) | FastAPI + Next.js 14 | Uploads images, scores them (sharpness, brightness, contrast, resolution) and classifies them as Bad / Normal / High quality, behind Clerk auth |
| [`Facial App/`](./Facial%20App) | Flutter (Dart) | AI-powered facial-recognition attendance app (`attendance_ai`), targeting Android/iOS/Web/Desktop |

There is no shared code between the two — set up and run whichever one you need.

## 📂 Repository Structure

```
Transformer-Based-Image-Pre-processing/
├── image-quality-system/
│   ├── backend/            ← FastAPI server (image quality scoring)
│   ├── frontend/           ← Next.js 14 app (upload UI, dashboard)
│   └── README.md           ← detailed docs for this subproject
├── Facial App/
│   ├── lib/                ← Flutter/Dart source (screens, services, providers)
│   ├── android/ ios/ web/ windows/ linux/ macos/
│   └── pubspec.yaml
└── README.md                ← you are here
```

## 1️⃣ Image Quality System

Full-stack app: upload an image, get back a quality score and category.

**Prerequisites**: Python 3.8+, Node.js 18+, a [Clerk](https://dashboard.clerk.com) account (auth is required on the API).

### Backend

```bash
cd image-quality-system/backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```

Create `.env`:
```env
API_HOST=0.0.0.0
API_PORT=8000
ALLOWED_ORIGINS=http://localhost:3000
CLERK_ISSUER=https://your-clerk-instance.clerk.accounts.dev
```

Run it:
```bash
python main.py
# or: uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
API is served at `http://localhost:8000` (Swagger docs at `/docs`).

### Frontend

```bash
cd image-quality-system/frontend
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Run it:
```bash
npm run dev
```
App is served at `http://localhost:3000`. See [`image-quality-system/README.md`](./image-quality-system/README.md) and [`AUTHENTICATION.md`](./image-quality-system/AUTHENTICATION.md) for full API reference and Clerk setup.

## 2️⃣ Facial App (Flutter)

AI attendance app built with Flutter.

**Prerequisites**: [Flutter SDK](https://docs.flutter.dev/get-started/install), a configured Firebase project (`lib/firebase_options.dart` is already generated for one — swap in your own via `flutterfire configure` if needed).

```bash
cd "Facial App"
flutter pub get
flutter devices        # list available targets
flutter run             # run on a connected device/emulator
```

Build for a specific platform:
```bash
flutter build apk       # Android
flutter build ios       # iOS (requires macOS/Xcode)
flutter build web       # Web
flutter build windows   # Windows desktop
```

## 🤝 Contributing

1. Fork this repo
2. Make your changes in the relevant subproject
3. Commit & push to your fork
4. Open a Pull Request describing your changes

## License

No license file is currently included in this repository — all rights reserved by default until one is added.
