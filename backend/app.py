from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv('../.env')

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:8080"])

from routes.auth import auth_bp
from routes.courses import courses_bp
from routes.email import email_bp
from routes.payment import payment_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(courses_bp, url_prefix='/api/courses')
app.register_blueprint(email_bp, url_prefix='/api/email')
app.register_blueprint(payment_bp, url_prefix='/api/payment')

@app.route('/')
def home():
    return {'message': 'AI LearnBoard API', 'status': 'running'}

@app.route('/health')
def health():
    return {'status': 'healthy'}

if __name__ == '__main__':
    app.run(debug=True, port=5000)
