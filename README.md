# 🧠 ExamMind — AI-Powered Socratic Tutor for Students

> **Don't just get answers. Understand them.**

ExamMind is a production-ready MVP web application that helps students from Class 6 to College level solve academic doubts using the **Socratic Method** — guided by Google Gemini AI. Instead of giving direct answers, the AI asks guiding questions that lead students to discover answers themselves.

---

## 🎯 What Makes ExamMind Different?

| Feature | ChatGPT / Google | ExamMind |
|---|---|---|
| Response style | Direct answer | Guides you to think |
| Personalization | None | Class, stream, language |
| Indian context | Generic | NCERT, JEE, NEET, Board exams |
| Progress tracking | None | Streaks, badges, subject charts |
| Image support | Paid | Built-in question image upload |

---

## 🚀 Tech Stack

### Backend
- **Node.js + Express.js** — REST API
- **MongoDB + Mongoose** — Database
- **Redis (ioredis)** — Caching & rate limiting
- **Google Gemini AI** — Socratic AI responses
- **ImageKit** — Cloud image storage
- **JWT** — Authentication

### Frontend
- **React.js (Vite)** — UI framework
- **Tailwind CSS** — Styling
- **Redux Toolkit** — Global state
- **Framer Motion** — Animations
- **Recharts** — Progress charts
- **Lucide React** — Icons

---

## 📁 Project Structure

```
examind/
├── backend/
│   ├── src/
│   │   ├── config/          # DB, Redis, Gemini, ImageKit setup
│   │   ├── controllers/     # Auth, Doubt, Progress, Upload logic
│   │   ├── middlewares/     # JWT auth, error handler, file upload
│   │   ├── models/          # User, Doubt schemas
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Gemini AI, ImageKit services
│   │   ├── utils/           # ApiResponse, ApiError, asyncHandler
│   │   └── app.js           # Express app setup
│   ├── server.js            # Entry point
│   └── .env.example
│
└── frontend/
    └── src/
        ├── app/             # Redux store
        ├── components/      # Navbar, Skeleton, Toast, ProtectedRoute
        ├── features/        # Redux slices (auth, doubt, progress, theme)
        ├── pages/           # Landing, Login, Register, Dashboard, Session, Progress, History, Profile
        ├── services/        # Axios API instance
        └── utils/           # cn() utility
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- Redis (local or Redis Cloud)
- Google Gemini API key
- ImageKit account (free tier works)

### 1. Clone and setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (see below)
npm run dev
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Environment Variables (backend/.env)

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/examind
# OR MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/examind

# JWT
JWT_SECRET=any_long_random_string_here
JWT_EXPIRES_IN=7d

# Redis
REDIS_URL=redis://localhost:6379
# OR Redis Cloud:
# REDIS_URL=redis://default:password@host:port

# Google Gemini (get from https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key

# ImageKit (get from https://imagekit.io/)
IMAGEKIT_PUBLIC_KEY=public_xxxx
IMAGEKIT_PRIVATE_KEY=private_xxxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

---

## 🌟 Features

### 1. 🏠 Landing Page
- Animated hero with tagline
- How it works (3 steps)
- Features grid
- Testimonials
- CTA sections

### 2. 👤 Auth System
- Register / Login with JWT
- 2-step profile setup:
  - Education level (Class 6-8 / 9-10 / 11-12 / College)
  - Stream (PCM / PCB / Commerce / Arts / Engineering / Medical / Law)
  - Subjects (multi-select)
  - Language (English / Hinglish)

### 3. 🤔 Doubt Session (Core Feature)
- Chat-style interface (like WhatsApp)
- Upload question images
- AI uses **Socratic Method** — never gives direct answers
- Typing animation while AI responds
- Sessions saved to MongoDB
- Resume any past session

### 4. 📊 Progress Tracker
- Total doubts, resolved doubts
- Daily streak tracker
- Weekly activity bar chart
- Doubts by subject bar chart
- Badges system (7 badges)

### 5. 🎨 Theme System
- Default: **Dark theme** (black & white)
- Toggle to Light theme
- Persisted in localStorage

---

## 🏆 API Endpoints

```
POST   /api/v1/auth/register          Register
POST   /api/v1/auth/login             Login
GET    /api/v1/auth/me                Get current user
PUT    /api/v1/auth/update-profile    Update profile

POST   /api/v1/doubt/session          Create session
POST   /api/v1/doubt/ask/:sessionId   Ask doubt (+ image upload)
GET    /api/v1/doubt/sessions         All sessions
GET    /api/v1/doubt/session/:id      Single session
PATCH  /api/v1/doubt/session/:id/resolve  Mark resolved

GET    /api/v1/progress               Full progress data

POST   /api/v1/upload/image           Upload image to ImageKit
```

---

## 🎬 Hackathon Demo Flow

1. **Open landing page** → wow factor from animations
2. **Register** → Choose Class 11, Science PCM, Hinglish
3. **New Doubt** → Type: *"I don't understand Newton's 3rd Law"*
4. **Watch AI** → It asks: *"Achha socho — jab tum wall ko push karte ho, kya hota hai?"*
5. **Reply** → AI gives hint, then explanation
6. **Show progress** → Streak updated, subject chart updated
7. **Show session history** → All past doubts saved

---

## 👥 Made For

- 🏫 Class 6–12 students (CBSE, ICSE, State Boards)
- 🎓 College students (Engineering, Medical, Commerce, Arts, Law)
- 📚 JEE / NEET / Board exam aspirants
- 🇮🇳 Indian students — with Hinglish support and NCERT context
