import os
import hmac
import hashlib
import requests
from flask import Blueprint, request, jsonify

payment_bp = Blueprint('payment', __name__)

RAZORPAY_KEY_ID = os.getenv('VITE_RAZORPAY_KEY_ID', 'rzp_test_ShI9TzHdalsxvQ')
RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET', 'WlKq1X5dY33WiihF174Cpw3s')


@payment_bp.route('/create-order', methods=['POST'])
def create_order():
    data = request.json
    amount_inr = int(data.get('amount_inr', 500))

    payload = {
        'amount': amount_inr * 100,  # convert to paise
        'currency': 'INR',
        'receipt': f"rcpt_{data.get('course_id', 'course')[:8]}",
        'notes': {
            'course_id': data.get('course_id', ''),
            'user_id': data.get('user_id', ''),
        }
    }

    response = requests.post(
        'https://api.razorpay.com/v1/orders',
        auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET),
        json=payload
    )

    if response.status_code == 200:
        return jsonify(response.json())
    return jsonify({'error': 'Failed to create order', 'details': response.text}), 500


@payment_bp.route('/verify', methods=['POST'])
def verify_payment():
    data = request.json
    razorpay_order_id = data.get('razorpay_order_id', '')
    razorpay_payment_id = data.get('razorpay_payment_id', '')
    razorpay_signature = data.get('razorpay_signature', '')

    body = f"{razorpay_order_id}|{razorpay_payment_id}"
    expected = hmac.new(
        RAZORPAY_KEY_SECRET.encode('utf-8'),
        body.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

    if expected == razorpay_signature:
        return jsonify({'verified': True, 'payment_id': razorpay_payment_id})
    return jsonify({'verified': False}), 400
