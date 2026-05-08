# Bipin Interiors - Backend API

The Django-powered backend for Bipin Interiors website.

## Tech Stack
- **Framework**: Django 6.0.4
- **Database**: SQLite (Development)
- **Language**: Python 3.x

## Getting Started

### Prerequisites
- Python 3.x
- pip

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install django
   ```
4. Set up environment variables:
   Copy `.env.example` to `.env` and update the values.

### Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Running the Server
```bash
python manage.py runserver
```

## Project Structure
- `config/`: Project configuration and settings.
- `core/`: Main application logic.
- `db.sqlite3`: Local database file.
- `manage.py`: Django command-line utility.
