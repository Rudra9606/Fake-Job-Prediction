# FakeJobShield

### An Explainable Hybrid AI and Cybersecurity Framework for Fraudulent Job Advertisement Detection and Trust Score Generation

FakeJobShield is a research-grade, production-ready full-stack MERN (React, Express, MongoDB, Node) platform integrated with a Python FastAPI AI service. It analyzes online job postings and generates a **Trust Score** and **Security Analysis Report** to protect job seekers from recruitment scams.

---

## 🚀 Architecture Overview

```
                                  ┌────────────────────────┐
                                  │   React Frontend (Vite)│
                                  └───────────┬────────────┘
                                              │ REST API + JWT
                                              ▼
                                  ┌────────────────────────┐
                                  │ Node.js Express Server │
                                  └──────┬──────────┬──────┘
                                         │          │
                                Mongoose │          │ HTTP Request
                                         ▼          ▼
                        ┌──────────────────┐      ┌────────────────────────┐
                        │   MongoDB Atlas  │      │ Python FastAPI Service │
                        └──────────────────┘      └───────────┬────────────┘
                                                              │
                                                              ▼
                                                  ┌────────────────────────┐
                                                  │ XGBoost + SHAP + BERT  │
                                                  └────────────────────────┘
```

---

## 📁 Project Structure

```
Fake-Job-Shield/
├── backend/            # Express.js REST API server & Mongoose Schemas
├── frontend/           # React.js Vite Single-Page Application (SPA)
├── notebooks/          # 10 Jupyter Notebooks (EDA, Preprocessing, ML/DL models, XAI, Hybrid)
├── models/             # Trained ML/DL models & pipelines (joblib/keras)
├── results/            # Performance metrics & publication-quality graphs
├── data/               # Job dataset (fake_job_postings.csv)
├── src/                # Legacy Python modules
├── api/                # FastAPI AI service (api/app.py)
└── scripts/            # Helper scripts & automation runners
```

---

## 🛠️ Tech Stack & Key Libraries

### Frontend
- **React.js & Vite**: Fast SPA build & Hot Module Replacement (HMR)
- **Tailwind CSS**: Glassmorphic dark theme styling
- **Framer Motion**: Micro-animations & page transitions
- **Recharts**: Interactive dashboard charts
- **Redux Toolkit**: Centralized auth & state caching
- **Axios**: Backend REST API requests
- **Lucide Icons**: Clean, consistent vector iconography

### Backend
- **Node.js & Express.js**: Async API routing
- **Mongoose**: MongoDB object modeling
- **JWT (JsonWebToken)**: Stateless secure auth
- **Bcrypt.js**: Cryptographic password hashing
- **PDFKit**: Dynamic PDF report generation & streaming

### Python AI Service
- **FastAPI & Uvicorn**: High-performance ASGI server
- **Scikit-Learn**: Vectorization, encoding, and traditional ML baselines
- **XGBoost & LightGBM**: Tuned ensemble classifiers (Hybrid Model)
- **TensorFlow & Keras**: Deep learning models (LSTM, BiLSTM, GRU)
- **HuggingFace Transformers**: BERT semantic representation & fine-tuning
- **SHAP (SHapley Additive exPlanations)**: TreeExplainer for decision attributions

---

## 💻 Local Setup Guide

### 1. Python AI Service Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Start FastAPI server (run from project root)
uvicorn api.app:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Node.js Backend Setup
```bash
cd backend
npm install

# Create environment file (edit variables as needed)
cp .env.example .env

# Start server
npm run dev
```

### 3. React Frontend Setup
```bash
cd frontend
npm install

# Start Vite dev server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📈 REST API Documentation

### Node.js Backend API

#### Auth Endpoints
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in a user (returns JWT)
- `GET /api/auth/me`: Get profile of logged-in user (requires JWT)

#### Scan Endpoints
- `POST /api/analyze`: Submit a job posting for scanner audit (optional JWT)
- `GET /api/analyze/history`: Get scan history log (requires JWT)
- `GET /api/analyze/:id`: Get detailed scan parameters by ID
- `GET /api/analyze/:id/pdf`: Download structured PDF report of the scan

#### Community Reports
- `POST /api/scams`: Report a job posting as a scam (requires JWT)
- `GET /api/scams`: Get feed of community scam reports
- `PUT /api/scams/:id/status`: Update status of report (requires Admin JWT)

---

## ☁️ Deployment Guidelines

### 1. Database (MongoDB Atlas)
1. Sign up on MongoDB Atlas, create a new cluster, and configure network access IP whitelists.
2. Copy the connection string and paste it as `MONGO_URI` in `backend/.env`.

### 2. Python AI Service (Render / Railway)
- Deploy as a **Web Service** pointing to `api/app.py`.
- Start Command: `uvicorn api.app:app --host 0.0.0.0 --port $PORT`

### 3. Node.js Backend (Render / Heroku)
- Deploy the `backend/` subdirectory.
- Configure Environment variables: `MONGO_URI`, `JWT_SECRET`, and `AI_SERVICE_URL`.

### 4. React Frontend (Vercel / Netlify)
- Deploy the `frontend/` subdirectory.
- Configure Environment variable: `VITE_API_URL` pointing to your deployed Express backend URL.
