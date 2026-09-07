# Prokope.io
This project is my portfolio "tech-blog" where I describe my experiences and lessons from topics in information technology, computer science, and psychology. It is hosted at my [website](https://www.prokope.io), and is programmed in Django and React where I practice general web-engineering practices.

## Setup
1. Make setup.sh and runserver.sh executable: `chmod +x setup.sh` then run as `./setup.sh` and `./runserver_debug.sh`

## How to Run

### Development (2 terminals):
```bash
# Terminal 1 — Django API
cd backend && uv run python manage.py runserver

# Terminal 2 — React dev server
cd frontend && npm run dev

# If Django runs on a non-default port (e.g. the QA server uses 8001):
cd frontend && VITE_PROXY_TARGET=http://localhost:8001 npm run dev
```

### Production — single server (Django serves React):
```bash
cd frontend && npm run build
cd backend && uv run python manage.py runserver
# Then visit http://localhost:8000 — SPAMiddleware serves the built React app
```

## Frontend / Backend Architecture

The React single page application (`frontend/`) is the sole UI. Django serves the built React bundle (`frontend/dist/`) via `SPAMiddleware` together with the REST API, admin, and OIDC endpoints on the same origin — no CORS is needed in production.

The server-side Django template UI has been decommissioned: template views, `apps/*/templates/`, and the template-only static assets in `backend/static/` were removed. Only templates and static assets required by Django Admin, CKEditor, Summernote, and Photologue remain. The `REACT_FRONTEND_ENABLED` environment-variable toggle is retired; SPA serving is the permanent default. Server-only routes that Django (not the SPA) must handle — e.g. `/.well-known/webfinger` and `/blog/update_server` — are whitelisted in `SPAMiddleware.skip_prefixes` (`backend/apps/common/middleware.py`).

## Deployment (Heroku)

The app is a monorepo deployed to a single Heroku dyno:

- **Frontend** is built by the `heroku/nodejs` buildpack via the root `package.json` `heroku-postbuild` script (`cd frontend && npm ci && npm run build`), producing `frontend/dist/`.
- **Backend** is installed by the `heroku/python` buildpack in its native uv mode (root `pyproject.toml` + `uv.lock` + `.python-version`), running `uv sync --locked`.
- The root `Procfile` runs migrations + `collectstatic` in the `release` phase and gunicorn in the `web` phase.

```bash
# One-time app configuration
heroku buildpacks:set heroku/nodejs
heroku buildpacks:add heroku/python
# Deployment
git push heroku main
```