from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv('../.env')

app = Flask(__name__)
CORS(app)

# Import routes
from routes.auth import auth_bp
from routes.courses import courses_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(courses_bp, url_prefix='/api/courses')

@app.route('/')
def home():
    return {'message': 'AI LearnBoard API', 'status': 'running'}

@app.route('/health')
def health():
    return {'status': 'healthy'}

if __name__ == '__main__':
    app.run(debug=True, port=5000)
