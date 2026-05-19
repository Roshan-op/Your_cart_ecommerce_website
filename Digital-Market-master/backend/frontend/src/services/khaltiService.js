import KhaltiCheckout from "khalti-checkout-web";

const KHALTI_PUBLIC_KEY = "test_public_key_37cb6b253b0f4ae5824d4d48bca676e3";
const BACKEND_URL = "http://127.0.0.1:8000";

export const initiateKhaltiPayment = async (orderData) => {
  try {
    // Configure Khalti checkout
    const config = {
      publicKey: KHALTI_PUBLIC_KEY,
      productIdentity: orderData.orderId,
      productName: "Digital Market Order",
      productUrl: `http://localhost:3000/order/${orderData.orderId}`,
      amount: Math.round(orderData.totalAmount * 100), // Amount in paisa (smallest unit)
      eventHandler: {
        onSuccess: async (payload) => {
          // Verify payment with backend
          try {
            const response = await fetch(`${BACKEND_URL}/api/orders/verify-khalti/`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
              body: JSON.stringify({
                orderId: orderData.orderId,
                khaltiToken: payload.token,
                khaltiAmount: payload.amount,
              }),
            });

            if (!response.ok) {
              const errorData = await response.text();
              throw new Error(`Payment verification failed: ${errorData}`);
            }

            const data = await response.json();
            return {
              success: true,
              data: data,
              payload: payload,
            };
          } catch (error) {
            console.error("Payment verification error:", error);
            return {
              success: false,
              error: error.message,
            };
          }
        },
        onError: (error) => {
          console.error("Khalti payment error:", error);
          return {
            success: false,
            error: error,
          };
        },
        onClose: () => {
          console.log("Khalti widget closed");
        },
      },
      paymentPreference: [
        "KHALTI",
        "EBANKING",
        "MOBILE_BANKING",
        "CONNECT_IPS",
        "SCT",
      ],
    };

    // Create and show Khalti checkout
    const checkout = new KhaltiCheckout(config);
    checkout.show();

    return checkout;
  } catch (error) {
    console.error("Khalti initialization error:", error);
    throw error;
  }
};

export const verifyKhaltiPayment = async (orderId, token, amount) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/orders/verify-khalti/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        orderId,
        khaltiToken: token,
        khaltiAmount: amount,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Payment verification failed: ${text}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Khalti verification error:", error);
    throw error;
  }
};
