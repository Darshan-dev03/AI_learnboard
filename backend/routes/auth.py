from flask import Blueprint, request, jsonify
from config import supabase

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name')

        response = supabase.auth.sign_up({
            'email': email,
            'password': password,
            'options': {
                'data': {
                    'full_name': full_name
                }
            }
        })

        return jsonify({
            'success': True,
            'message': 'User created successfully',
            'user': response.user
        }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        response = supabase.auth.sign_in_with_password({
            'email': email,
            'password': password
        })

        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': response.user,
            'session': response.session
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    try:
        supabase.auth.sign_out()
        return jsonify({
            'success': True,
            'message': 'Logout successful'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@auth_bp.route('/user', methods=['GET'])
def get_user():
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        user = supabase.auth.get_user(token)
        
        return jsonify({
            'success': True,
            'user': user
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 401
