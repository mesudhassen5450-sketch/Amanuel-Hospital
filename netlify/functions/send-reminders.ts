import { createClient } from "@supabase/supabase-js";

// Helper to normalize phone numbers to Ethiopian format (+2519XXXXXXXX)
function normalizeEthiopianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("251") && digits.length === 12) return "+" + digits;
  if ((digits.startsWith("09") || digits.startsWith("07")) && digits.length === 10) {
    return "+251" + digits.slice(1);
  }
  if ((digits.startsWith("9") || digits.startsWith("7")) && digits.length === 9) {
    return "+251" + digits;
  }
  if (phone.startsWith("+")) return phone;
  return "+" + digits;
}

// Scheduled handler to run daily at 8:00 AM EAT (which is 5:00 AM UTC)
export const handler = async (event: any) => {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  const token = process.env.AFROMESSAGE_API_TOKEN;
  const identifierId = process.env.AFROMESSAGE_IDENTIFIER_ID ?? "";

  if (!url || !key) {
    console.error("Supabase environment variables not set.");
    return { statusCode: 500, body: "Supabase environment variables not set." };
  }

  if (!token || token === "your_afromessage_api_token_here") {
    console.error("AfroMessage API token not set.");
    return { statusCode: 500, body: "AfroMessage API token not set." };
  }

  const sb = createClient(url, key);
  const now = new Date();
  
  // Get tomorrow's date string (YYYY-MM-DD) in EAT (UTC+3)
  const eatOffset = 3 * 60 * 60 * 1000;
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000 + eatOffset);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  console.log(`Running automated SMS reminders for date: ${tomorrowStr}`);

  // Query appointments for tomorrow that haven't been sent yet and are not cancelled
  const { data: appts, error } = await sb
    .from("appointments")
    .select("id, full_name, phone, appointment_date, appointment_time, booking_status, reminder_sms_sent")
    .eq("appointment_date", tomorrowStr)
    .neq("booking_status", "cancelled")
    .eq("reminder_sms_sent", false);

  if (error) {
    console.error("Failed to query appointments:", error.message);
    return { statusCode: 500, body: error.message };
  }

  console.log(`Found ${appts?.length ?? 0} eligible appointment(s)`);

  for (const appt of appts ?? []) {
    const apptId = appt.id;
    const patientName = appt.full_name ?? "Patient";
    const apptDate = appt.appointment_date ?? "";
    const apptTime = appt.appointment_time ?? "";
    const toPhone = normalizeEthiopianPhone(appt.phone ?? "");
    const message = `Dear ${patientName}, this is a reminder from Dr. Amanuel Hospital. You have an appointment scheduled for ${apptDate} at ${apptTime}. Please arrive on time. Thank you.`;

    const runTimestamp = new Date().toISOString();
    try {
      const body: Record<string, string> = {
        to: toPhone,
        message: message,
      };
      if (identifierId && identifierId !== "your_identifier_id_here") {
        body["from"] = identifierId;
      }

      const response = await fetch("https://api.afromessage.com/api/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json().catch(() => ({}));
      const isSuccess = response.ok && (result?.acknowledge === "success" || result?.status === "success" || response.status === 200);

      if (isSuccess) {
        await sb.from("appointments").update({
          reminder_sms_sent: true,
          reminder_sms_sent_at: runTimestamp,
          reminder_sms_status: "sent",
          reminder_sms_error: null,
          updated_at: runTimestamp,
        }).eq("id", apptId);
        console.log(`SMS sent successfully to appointment ${apptId}`);
      } else {
        const smsError = result?.response?.errors?.[0] ?? result?.message ?? result?.error ?? `HTTP ${response.status}`;
        await sb.from("appointments").update({
          reminder_sms_sent: false,
          reminder_sms_status: "failed",
          reminder_sms_error: smsError,
          updated_at: runTimestamp,
        }).eq("id", apptId);
        console.error(`SMS failed for appointment ${apptId}: ${smsError}`);
      }
    } catch (fetchErr: any) {
      const smsError = fetchErr?.message ?? "Network error contacting SMS provider.";
      await sb.from("appointments").update({
        reminder_sms_sent: false,
        reminder_sms_status: "failed",
        reminder_sms_error: smsError,
        updated_at: runTimestamp,
      }).eq("id", apptId);
      console.error(`Fetch error for appointment ${apptId}:`, fetchErr);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Processed ${appts?.length ?? 0} reminders.` }),
  };
};

// Netlify scheduled cron configuration
export const config = {
  schedule: "0 5 * * *" // Runs at 5:00 AM UTC (8:00 AM EAT) daily
};
