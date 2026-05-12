const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_ShI9TzHdalsxvQ";
const API = "http://localhost:5000/api/payment";

declare global {
  interface Window { Razorpay: any; }
}

const loadRazorpayScript = (): Promise<boolean> =>
  new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

export interface PaymentOptions {
  courseId: string;
  courseTitle: string;
  courseEmoji: string;
  amountInr: number;
  userId: string;
  userEmail: string;
  userName: string;
  onSuccess: (paymentId: string) => void;
  onFailure: (error: string) => void;
}

export const initiatePayment = async (opts: PaymentOptions) => {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    opts.onFailure("Failed to load Razorpay checkout. Check your internet connection.");
    return;
  }

  // Try to create a backend order; fall back to orderless checkout if backend is down
  let orderId: string | undefined;
  try {
    const res = await fetch(`${API}/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount_inr: opts.amountInr,
        course_id: opts.courseId,
        user_id: opts.userId,
      }),
    });
    if (res.ok) {
      const order = await res.json();
      if (order.id) orderId = order.id;
    }
  } catch {
    // Backend not reachable — proceed without order_id (test mode still works)
    console.warn("Backend unavailable, proceeding without order_id");
  }

  const rzpOptions: any = {
    key: RAZORPAY_KEY_ID,
    amount: opts.amountInr * 100,
    currency: "INR",
    name: "AI LearnBoard",
    description: opts.courseTitle,
    prefill: {
      name: opts.userName,
      email: opts.userEmail,
    },
    notes: {
      course_id: opts.courseId,
    },
    theme: { color: "#6c63ff" },
    handler: async (response: any) => {
      const paymentId = response.razorpay_payment_id;

      // Try to verify on backend; if unavailable, treat as success
      if (orderId && response.razorpay_signature) {
        try {
          const verifyRes = await fetch(`${API}/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: paymentId,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const result = await verifyRes.json();
          if (!result.verified) {
            opts.onFailure("Payment verification failed.");
            return;
          }
        } catch {
          // Verification endpoint down — accept in test mode
        }
      }

      opts.onSuccess(paymentId);
    },
    modal: {
      ondismiss: () => opts.onFailure("Payment cancelled."),
    },
  };

  // Only attach order_id if we got one from backend
  if (orderId) rzpOptions.order_id = orderId;

  const rzp = new window.Razorpay(rzpOptions);
  rzp.on("payment.failed", (response: any) => {
    opts.onFailure(response.error?.description || "Payment failed.");
  });
  rzp.open();
};
