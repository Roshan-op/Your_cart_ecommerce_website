import KhaltiCheckout from "khalti-checkout-web";

const BACKEND_URL = "http://localhost:8000";
const KHALTI_PUBLIC_KEY = "test_public_key_37cb6b253b0f4ae5824d4d48bca676e3";

export const initiateKhaltiPayment = async (orderData) => {
    try {
        // Configure Khalti checkout
        const config = {
            publicKey: KHALTI_PUBLIC_KEY,
            productIdentity: orderData.orderId,
            productName: "Digital Market Order",
            productUrl: window.location.href,
            eventHandler: {
                onSuccess(payload) {
                    console.log("Khalti payment successful:", payload);
                    
                    // Verify payment with backend
                    verifyKhaltiPayment(
                        orderData.orderId,
                        payload.token,
                        payload.amount
                    ).then((result) => {
                        if (result.success) {
                            // Redirect to success page
                            window.location.href = `/payment-success/${orderData.orderId}`;
                        } else {
                            alert("Payment verification failed: " + result.error);
                        }
                    }).catch((err) => {
                        console.error("Error verifying Khalti payment:", err);
                        alert("Error verifying payment: " + err.message);
                    });
                },
                onError(error) {
                    console.error("Khalti payment error:", error);
                    alert("Payment failed: " + JSON.stringify(error));
                },
                onClose() {
                    console.log("Khalti widget closed");
                    alert("Payment window closed without completing payment");
                }
            },
            amount: orderData.totalPrice * 100, // Amount in paisa (smallest unit)
            currency: "NPR",
            transactionUUID: `order_${orderData.orderId}_${Date.now()}`,
            mobile: orderData.phone || "",
            email: orderData.email || "",
        };

        // Create and show Khalti checkout
        const checkout = new KhaltiCheckout(config);
        checkout.show();

    } catch (error) {
        console.error("Khalti initialization error:", error);
        alert("Failed to initialize Khalti payment");
        throw error;
    }
};

export const verifyKhaltiPayment = async (orderId, token, amount) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/orders/verify-khalti/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
                orderId: orderId,
                khaltiToken: token,
                khaltiAmount: amount,
            })
        });

        const data = await response.json();

        if (response.ok) {
            return {
                success: true,
                message: 'Payment verified successfully',
                data: data
            };
        } else {
            return {
                success: false,
                error: data.error || 'Payment verification failed'
            };
        }
    } catch (error) {
        console.error("Khalti verification error:", error);
        throw error;
    }
};
