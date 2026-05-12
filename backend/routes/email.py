import os
import smtplib
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from flask import Blueprint, request, jsonify

email_bp = Blueprint('email', __name__)

SMTP_HOST = os.getenv('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
SMTP_USER = os.getenv('SMTP_USER', '')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD', '')


def send_email(to: str, subject: str, html: str, attachment_name: str = None, attachment_data: str = None):
    """Send an HTML email, optionally with a base64-encoded attachment."""
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = f'AI LearnBoard <{SMTP_USER}>'
    msg['To'] = to
    msg.attach(MIMEText(html, 'html'))

    if attachment_name and attachment_data:
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(base64.b64decode(attachment_data))
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f'attachment; filename="{attachment_name}"')
        msg.attach(part)

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.ehlo()
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, to, msg.as_string())


def module_completed_html(user_name: str, module_title: str, course_title: str, progress: int) -> str:
    return f"""
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8f7ff;font-family:'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(108,99,255,0.1);">
    <div style="background:linear-gradient(135deg,#6c63ff,#a78bfa);padding:32px 40px;text-align:center;">
      <div style="font-size:48px;margin-bottom:8px;">✅</div>
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">Module Completed!</h1>
    </div>
    <div style="padding:32px 40px;">
      <p style="color:#555;font-size:15px;margin:0 0 16px;">Hi <strong>{user_name}</strong>,</p>
      <p style="color:#555;font-size:15px;margin:0 0 24px;">
        Great work! You've successfully completed the module:
      </p>
      <div style="background:#f0eeff;border-left:4px solid #6c63ff;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0;font-size:16px;font-weight:700;color:#1a1a2e;">📖 {module_title}</p>
        <p style="margin:4px 0 0;font-size:13px;color:#888;">from <em>{course_title}</em></p>
      </div>
      <div style="background:#f8f7ff;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-size:13px;color:#888;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Course Progress</p>
        <div style="background:#e0dcff;border-radius:999px;height:10px;overflow:hidden;">
          <div style="background:linear-gradient(90deg,#6c63ff,#a78bfa);height:100%;width:{progress}%;border-radius:999px;"></div>
        </div>
        <p style="margin:8px 0 0;font-size:14px;font-weight:700;color:#6c63ff;">{progress}% Complete</p>
      </div>
      <p style="color:#555;font-size:14px;">Keep going — you're making great progress! 🚀</p>
    </div>
    <div style="background:#f8f7ff;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
      <p style="margin:0;font-size:12px;color:#aaa;">AI LearnBoard · Empowering learners worldwide</p>
    </div>
  </div>
</body>
</html>"""


def course_completed_html(user_name: str, course_title: str, course_emoji: str) -> str:
    return f"""
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8f7ff;font-family:'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(108,99,255,0.15);">
    <div style="background:linear-gradient(135deg,#6c63ff,#a78bfa,#c9a84c);padding:40px;text-align:center;">
      <div style="font-size:64px;margin-bottom:8px;">{course_emoji}</div>
      <h1 style="color:#fff;margin:0;font-size:26px;font-weight:800;">Course Completed! 🎉</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Congratulations on your achievement</p>
    </div>
    <div style="padding:36px 40px;">
      <p style="color:#555;font-size:15px;margin:0 0 16px;">Dear <strong>{user_name}</strong>,</p>
      <p style="color:#555;font-size:15px;margin:0 0 24px;">
        You have successfully completed the course:
      </p>
      <div style="background:linear-gradient(135deg,#f0eeff,#fff8e1);border:2px solid #c9a84c;border-radius:12px;padding:20px 24px;margin-bottom:24px;text-align:center;">
        <p style="margin:0;font-size:20px;font-weight:800;color:#1a1a2e;">{course_emoji} {course_title}</p>
        <p style="margin:8px 0 0;font-size:13px;color:#888;">100% Completed ✓</p>
      </div>
      <p style="color:#555;font-size:14px;margin:0 0 16px;">
        Your certificate of completion is attached to this email. You can also download it anytime from your dashboard.
      </p>
      <div style="background:#f0fff4;border:1px solid #86efac;border-radius:8px;padding:14px 18px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#166534;">🏆 <strong>Achievement Unlocked:</strong> Course Finisher badge has been added to your profile!</p>
      </div>
      <p style="color:#555;font-size:14px;">Keep learning and growing. Check out more courses on AI LearnBoard!</p>
    </div>
    <div style="background:#f8f7ff;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
      <p style="margin:0;font-size:12px;color:#aaa;">AI LearnBoard · Empowering learners worldwide</p>
    </div>
  </div>
</body>
</html>"""


def payment_success_html(user_name: str, course_title: str, course_emoji: str, amount: int, payment_id: str) -> str:
    return f"""
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f8f7ff;font-family:'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(108,99,255,0.1);">
    <div style="background:linear-gradient(135deg,#6c63ff,#a78bfa);padding:32px 40px;text-align:center;">
      <div style="font-size:48px;margin-bottom:8px;">💳</div>
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">Payment Successful!</h1>
    </div>
    <div style="padding:32px 40px;">
      <p style="color:#555;font-size:15px;margin:0 0 16px;">Hi <strong>{user_name}</strong>,</p>
      <p style="color:#555;font-size:15px;margin:0 0 24px;">
        Your payment was successful and you're now enrolled in:
      </p>
      <div style="background:#f0eeff;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
        <p style="margin:0;font-size:18px;font-weight:700;color:#1a1a2e;">{course_emoji} {course_title}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr style="border-bottom:1px solid #f0f0f0;">
          <td style="padding:10px 0;color:#888;font-size:13px;">Amount Paid</td>
          <td style="padding:10px 0;text-align:right;font-weight:700;color:#1a1a2e;font-size:15px;">₹{amount}</td>
        </tr>
        <tr style="border-bottom:1px solid #f0f0f0;">
          <td style="padding:10px 0;color:#888;font-size:13px;">Payment ID</td>
          <td style="padding:10px 0;text-align:right;font-family:monospace;font-size:12px;color:#6c63ff;">{payment_id}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#888;font-size:13px;">Status</td>
          <td style="padding:10px 0;text-align:right;"><span style="background:#f0fff4;color:#166534;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600;">✓ Paid</span></td>
        </tr>
      </table>
      <p style="color:#555;font-size:14px;">Head to your dashboard to start learning right away! 🚀</p>
    </div>
    <div style="background:#f8f7ff;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
      <p style="margin:0;font-size:12px;color:#aaa;">AI LearnBoard · Empowering learners worldwide</p>
    </div>
  </div>
</body>
</html>"""


@email_bp.route('/module-complete', methods=['POST'])
def module_complete():
    data = request.json
    try:
        send_email(
            to=data['email'],
            subject=f"✅ Module Completed: {data['module_title']}",
            html=module_completed_html(data['user_name'], data['module_title'], data['course_title'], data['progress'])
        )
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@email_bp.route('/course-complete', methods=['POST'])
def course_complete():
    data = request.json
    try:
        send_email(
            to=data['email'],
            subject=f"🎉 Course Completed: {data['course_title']} — Your Certificate is Here!",
            html=course_completed_html(data['user_name'], data['course_title'], data['course_emoji']),
            attachment_name=f"Certificate_{data['course_title'].replace(' ', '_')}.pdf",
            attachment_data=data.get('certificate_base64')
        )
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@email_bp.route('/payment-success', methods=['POST'])
def payment_success():
    data = request.json
    try:
        send_email(
            to=data['email'],
            subject=f"💳 Payment Confirmed — {data['course_title']}",
            html=payment_success_html(data['user_name'], data['course_title'], data['course_emoji'], data['amount'], data['payment_id'])
        )
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
