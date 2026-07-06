# InterviewAce — AI Virtual Interview Simulator

AI-powered mock interview platform with speech recognition, real-time feedback, resume analysis, and performance tracking.

## Features

- **Speech Recognition** — Real-time voice-to-text answers via Web Speech API
- **AI Feedback** — Groq LLaMA 3 analysis of interview answers with per-question scoring
- **Performance Analytics** — Radar, bar, and doughnut charts powered by Chart.js
- **Resume Analysis** — Upload PDF, get ATS score, skills gap analysis, and keyword matching
- **Achievements System** — 12 badges, streak tracking, daily challenges, leaderboard
- **Code Editor** — Built-in editor for technical coding rounds
- **Whiteboard** — Canvas drawing tool for algorithm explanations
- **Timer** — Countdown with configurable duration, warning states, auto-advance
- **Auth** — JWT-based registration and login with MongoDB persistence

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, React Router 7 |
| Styling | Plain CSS (single `App.css`) |
| Charts | Chart.js, react-chartjs-2 |
| Animations | GSAP, Framer Motion, AOS |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas, Mongoose 9 |
| AI | Groq SDK (llama-3.1-8b-instant) |
| Auth | JWT, bcryptjs |
| File Upload | Multer, express-fileupload |

## Project Structure

```
InterviewAce/
├── client/                    # React + Vite frontend
│   ├── public/
│   │   └── pdf.worker.min.mjs # PDF.js worker (local copy)
│   └── src/
│       ├── components/        # Navbar, Footer, BackgroundEffects, ProtectedRoute
│       ├── context/           # AuthContext, InterviewContext
│       ├── pages/             # 16 page components
│       ├── App.jsx            # Root component with routes
│       ├── App.css            # All styles (single file)
│       ├── index.css          # Global resets
│       └── main.jsx           # Entry point
├── server/                    # Node.js + Express backend
│   ├── config/db.js           # MongoDB connection
│   ├── controllers/           # Business logic + Groq AI calls
│   ├── middleware/            # JWT auth guard
│   ├── models/                # User, InterviewResult, Achievement
│   ├── routes/                # auth, results, achievements, resume, interview, questions
│   ├── server.js              # Entry point
│   └── .env                   # Environment variables (not committed)
├── .gitignore
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB Atlas account (or local MongoDB)
- Groq API key (free at https://console.groq.com)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd InterviewAce

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Environment Configuration

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/interviewace
JWT_SECRET=your_jwt_secret_here
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=development
```

### Run Development Servers

```bash
# Terminal 1 — Backend
cd server
npm run dev        # nodemon with auto-reload

# Terminal 2 — Frontend
cd client
npm run dev        # Vite dev server on port 5173
```

Open http://localhost:5173

### Production Build

```bash
cd client
npm run build      # Output in client/dist/

cd ../server
npm start          # node server.js
```

## Usage

1. **Register / Login** — Create an account via JWT auth
2. **Setup Interview** — Select company, role, difficulty, interview type, and question count
3. **Start Interview** — Answer questions via voice (Web Speech API) or text input
4. **Review Results** — Per-question scores, radar charts, strengths/weaknesses, suggestions
5. **Analyze Resume** — Upload a PDF resume for ATS scoring, skills gap analysis, and keyword matching
6. **Earn Achievements** — Complete interviews and maintain streaks to unlock badges
7. **Daily Challenge** — Solve 5 rotating questions (one per topic) for extra streak credit
8. **Leaderboard** — Compare your scores and streaks with other users
9. **Analytics** — Track performance trends across all your interviews

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Current user profile |
| GET | `/api/auth/leaderboard` | Yes | Leaderboard data |
| GET | `/api/results` | Yes | All user interview results |
| GET | `/api/results/:id` | Yes | Single result by ID |
| POST | `/api/results` | Yes | Save interview result |
| GET | `/api/achievements` | Yes | User badges and achievements |
| POST | `/api/interview/feedback` | Yes | AI feedback for interview answers |
| POST | `/api/resume/analyze` | Yes | AI-based resume ATS analysis |
| GET | `/api/questions` | No | Question bank |

## License

ISC
