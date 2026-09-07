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
cd backend && REACT_FRONTEND_ENABLED=True uv run python manage.py runserver
# Then visit http://localhost:8000 — SPAMiddleware serves the built React app
```

### Fallback — to use Django templates instead:
```bash
cd backend && REACT_FRONTEND_ENABLED=False uv run python manage.py runserver
```

## Backend Template Deprecation & Future Cleanup

With the migration of all UI views, client logic, animations, and state to the React single-page application (`frontend/`), the server-side Django template rendering is now deprecated. The `REACT_FRONTEND_ENABLED=False` toggle remains temporarily available for fallback/reference.

In a future update, the following backend components can be decommissioned:

### 1. Template Views & Controllers
- **`apps/blog/views.py`**:
  - `PostList`, `PostDetail`, `TagIndexView`, `search_results`, and other HTML template rendering views (all replaced by REST API endpoints in `api/` and `apps/blog/api/`).
  - *Keep*: Webhooks (e.g. `update`), API viewsets, and any admin-specific logic.
- **`apps/gallery/views.py`**:
  - `GalleryListView`, `GalleryDetailView`, and server-side filtering logic for rendering template galleries (replaced by `/api/country-albums/`, `/api/city-galleries/`, etc.).
- **`apps/index/views.py`**:
  - `index_view` (replaced by `/api/index/`).
- **`apps/common/views.py`**:
  - Template-based error page handlers (`custom_bad_request_view`, `custom_permission_denied_view`, `custom_page_not_found_view`, `custom_error_view`) that render `400.html`, `403.html`, `404.html`, `500.html`.

### 2. Template Directories & Files
The template files located in the backend apps can be deleted (preserving only templates needed by Django Admin, Summernote, or Photologue):
- `backend/apps/blog/templates/` (`blog.html`, `blog_post.html`, `search_results.html`, `partials/`)
- `backend/apps/gallery/templates/` (`gallery.html`, `gallery_detail.html`, `partials/`)
- `backend/apps/index/templates/` (`index.html`, `partials/`)
- `backend/apps/common/templates/` (`base.html`, `navbar.html`, `footer.html`, `section_break.html`, `400.html`, `403.html`, `404.html`, `500.html`)

### 3. Backend Static Assets for Deprecated Templates
Static files that only served the Django templates can be cleaned up (frontend now bundles or serves them from `frontend/public/` and `frontend/src/`):
- `backend/apps/blog/static/` (`css/blog.css`, etc.)
- `backend/apps/gallery/static/` (`css/gallery.css`, etc.)
- `backend/apps/index/static/` (`css/ide.css`, etc.)
- `backend/static/css/` (custom styles replicated in `frontend/src/index.css`)
- `backend/static/js/` (`BlogPostImageLightbox.js`, `mainGalleryMasonry.js`, `navHoverEffects.js`, `theme.js`, etc.)
- `backend/static/lightbox/` (replicated in `frontend/public/lightbox/`)
- *Keep*: Static assets required by Django Admin, CKEditor, and Summernote.

### 4. URL Routing & Middleware Cleanup
- **`apps/blog/urls.py`**, **`apps/gallery/urls.py`**, **`apps/index/urls.py`**:
  - Remove template route definitions (`PostList.as_view()`, `PostDetail.as_view()`, `index_view`, etc.).
- **`prokope/urls.py`**:
  - Remove includes for template URLs (`apps.index.urls`, `apps.blog.urls`, `apps.gallery.urls`).
- **`prokope/settings.py` & `apps/common/middleware.py`**:
  - Retire the `REACT_FRONTEND_ENABLED` environment variable toggle and make SPA serving the permanent default behavior.
  - Simplify `TEMPLATES` configuration in settings (remove unnecessary template context processors and directories used only by deprecated templates).