from flask import Blueprint, request, jsonify
from config import supabase

courses_bp = Blueprint('courses', __name__)

@courses_bp.route('/', methods=['GET'])
def get_courses():
    try:
        response = supabase.table('courses').select('*').execute()
        
        return jsonify({
            'success': True,
            'courses': response.data
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@courses_bp.route('/<course_id>', methods=['GET'])
def get_course(course_id):
    try:
        response = supabase.table('courses').select('*').eq('id', course_id).execute()
        
        if not response.data:
            return jsonify({
                'success': False,
                'error': 'Course not found'
            }), 404

        return jsonify({
            'success': True,
            'course': response.data[0]
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@courses_bp.route('/', methods=['POST'])
def create_course():
    try:
        data = request.get_json()
        
        response = supabase.table('courses').insert(data).execute()
        
        return jsonify({
            'success': True,
            'message': 'Course created successfully',
            'course': response.data[0]
        }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
