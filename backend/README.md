# Backend - Python Flask

This folder contains the Flask backend for the AI LearnBoard application.

## Requirements

- Python 3.8 or higher (Python 3.10 or 3.11 recommended)

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the server:
   ```bash
   python app.py
   ```

## Structure

- `app.py` - Main Flask application
- `routes/` - API endpoints
- `models/` - Database models
- `utils/` - Helper functions
- `config.py` - Configuration settings

## Supabase Configuration

The application uses Supabase for authentication and database management.
Environment variables are stored in the `.env` file at the root level.
