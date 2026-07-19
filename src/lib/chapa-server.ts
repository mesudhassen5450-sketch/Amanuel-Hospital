import { createServerFn } from "@tanstack/react-start";

export interface InitializePaymentParams {
  amount: number;
  fullName: string;
  phoneNumber: string;
  origin: string;
}

export const initializeChapaPayment = createServerFn({ method: "POST" })
  .validator((data: InitializePaymentParams) => data)
  .handler(async ({ data }) => {
    const { amount, fullName, phoneNumber, origin } = data;
    
    // Split name for Chapa
    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] || "Patient";
    const lastName = parts.slice(1).join(" ") || "Patient";

    // Generate unique transaction reference
    const txRef = `tx-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    try {
      const body = {
        amount: amount.toString(),
        currency: "ETB",
        email: `${phoneNumber.replace(/[^0-9]/g, "") || "patient"}@amanuelhospital.com.et`,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        tx_ref: txRef,
        callback_url: "https://webhook.site/d5e8211b-7a32-4467-bc56-3f3604b90151",
        return_url: `${origin}/payment-success?tx_ref=${txRef}`,
        customization: {
          title: "Doctor Appointment Fee",
          description: "Dr. Amanuel Hospital Appointment Booking"
        }
      };

      const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
        method: "POST",
        headers: {
          "Authorization": "Bearer CHASECK_TEST-pQf9ooXqdEajEHx9Bny1t5oXbLgiYxYn",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      
      if (!response.ok || result.status !== "success") {
        console.error("Chapa initialize failed:", result);
        return {
          success: false,
          message: result.message || "Failed to initialize payment with Chapa."
        };
      }

      return {
        success: true,
        checkoutUrl: result.data?.checkout_url,
        txRef
      };
    } catch (error: any) {
      console.error("Error initializing payment:", error);
      return {
        success: false,
        message: error.message || "An unexpected error occurred."
      };
    }
  });

export const verifyChapaPayment = createServerFn({ method: "POST" })
  .validator((data: { txRef: string }) => data)
  .handler(async ({ data }) => {
    const { txRef } = data;
    try {
      const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
        method: "GET",
        headers: {
          "Authorization": "Bearer CHASECK_TEST-pQf9ooXqdEajEHx9Bny1t5oXbLgiYxYn"
        }
      });

      const result = await response.json();
      if (!response.ok || result.status !== "success") {
        console.error("Chapa verify failed:", result);
        return {
          success: false,
          message: result.message || "Verification failed."
        };
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      console.error("Error verifying payment:", error);
      return {
        success: false,
        message: error.message || "An unexpected error occurred during verification."
      };
    }
  });
