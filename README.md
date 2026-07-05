# Prokope.io
This project is my portfolio "tech-blog" where I describe my experiences and lessons from topics in information technology, computer science, and psychology. It is hosted at my [website](https://www.prokope.io), and is programmed in Django where I practice general web-engineering practices.

## Setup
1. Make setup.sh and runserver.sh executable: `chmod +x setup.sh` then run as `./setup.sh` and `./runserver_debug.sh`

How to Run
Development (2 terminals):
# Terminal 1 — Django API
cd backend && uv run python manage.py runserver

# Terminal 2 — React dev server
cd frontend && npm run dev

Production — single server (Django serves React):
cd frontend && npm run build
cd backend && REACT_FRONTEND_ENABLED=True uv run python manage.py runserver
# Then visit http://localhost:8000 — SPAView serves the built React app
Fallback — to use Django templates instead:
cd backend && REACT_FRONTEND_ENABLED=False uv run python manage.py runserver