const API = "http://localhost:5000/api/email";

export const sendModuleCompleteEmail = async (
  email: string,
  userName: string,
  moduleTitle: string,
  courseTitle: string,
  progress: number
) => {
  try {
    await fetch(`${API}/module-complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, user_name: userName, module_title: moduleTitle, course_title: courseTitle, progress }),
    });
  } catch (e) {
    console.warn("Email send failed (non-critical):", e);
  }
};

export const sendCourseCompleteEmail = async (
  email: string,
  userName: string,
  courseTitle: string,
  courseEmoji: string,
  certificateBase64: string  // raw base64 PDF
) => {
  try {
    await fetch(`${API}/course-complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email, user_name: userName, course_title: courseTitle,
        course_emoji: courseEmoji, certificate_base64: certificateBase64,
      }),
    });
  } catch (e) {
    console.warn("Email send failed (non-critical):", e);
  }
};

export const sendPaymentSuccessEmail = async (
  email: string,
  userName: string,
  courseTitle: string,
  courseEmoji: string,
  amount: number,
  paymentId: string
) => {
  try {
    await fetch(`${API}/payment-success`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email, user_name: userName, course_title: courseTitle,
        course_emoji: courseEmoji, amount, payment_id: paymentId,
      }),
    });
  } catch (e) {
    console.warn("Email send failed (non-critical):", e);
  }
};
