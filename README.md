# CodeSight

> A collaborative code analysis and visualization platform for understanding source code structure and execution.

CodeSight combines a **React + TypeScript frontend** with a **FastAPI backend** and **Tree-sitter** for multi-language code analysis.

## ✨ Features

- 🧩 Monaco code editor
- 🌳 Tree-sitter based syntax analysis
- 🔍 Function and class detection
- ⚠️ Syntax-error detection
- 🌐 Multi-language parsing
- ▶️ Python execution tracing
- ⚡ Modular FastAPI backend
- 🎨 React + Tailwind CSS frontend

### Supported Languages

```text
Python • JavaScript • TypeScript • C++ • Java • Go • Rust
```

> Execution tracing is currently supported for Python.

## 🏗️ Project Structure

```text
CodeSight/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── editor/
│   │   │       └── CodeEditor.tsx
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── server/
│   ├── models/
│   │   └── schemas.py
│   ├── routers/
│   │   ├── parse.py
│   │   └── trace.py
│   ├── services/
│   │   ├── tracer.py
│   │   └── tree_sitter_engine.py
│   └── main.py
│
├── .gitignore
└── README.md
```

## 🛠️ Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- Monaco Editor

**Backend**
- Python
- FastAPI
- Pydantic
- Tree-sitter
- Uvicorn

## 🚀 Run Locally

### Backend

```cmd
cd server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..
python -m uvicorn server.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

### Frontend

Open another terminal:

```cmd
cd client
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## 🔌 API

| Endpoint | Method | Purpose |
|---|---|---|
| `/` | GET | Backend health check |
| `/api/parse` | POST | Analyze source code |
| `/api/trace` | POST | Trace Python execution |

## 🗺️ Roadmap

- [x] FastAPI backend
- [x] Tree-sitter parser
- [x] Multi-language parsing
- [x] Monaco Editor
- [x] Python execution tracing
- [ ] Interactive AST visualization
- [ ] Execution-flow visualization
- [ ] AI-assisted code explanation
- [ ] Database integration
- [ ] Automated testing
- [ ] Production deployment

---

**CodeSight** — Making code easier to understand.