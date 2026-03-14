import { json, sendMailerliteRequest } from "./_mailerlite.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, message: "Method not allowed." });
  }

  try {
    const { email } = req.body || {};
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!EMAIL_RE.test(normalizedEmail)) {
      return json(res, 400, {
        ok: false,
        code: "INVALID_EMAIL",
        message: "Please enter a valid email address.",
      });
    }

    const groupId = process.env.MAILERLITE_GROUP_ID;
    const payload = {
      email: normalizedEmail,
      status: "active",
    };

    if (groupId) {
      payload.groups = [groupId];
    }

    const { response, data } = await sendMailerliteRequest("/subscribers", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return json(res, 200, {
        ok: true,
        message: "You're subscribed. Watch your inbox for quiet notes.",
      });
    }

    const duplicate =
      response.status === 409 ||
      String(data?.message || "").toLowerCase().includes("already") ||
      String(data?.message || "").toLowerCase().includes("exists");

    if (duplicate) {
      return json(res, 200, {
        ok: true,
        message: "You're already on the list. We'll keep sending the good stuff.",
      });
    }

    return json(res, response.status || 502, {
      ok: false,
      code: "MAILERLITE_ERROR",
      message: data?.message || "We couldn't subscribe you right now.",
    });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      code: "SERVER_ERROR",
      message:
        error.message === "Missing MAILERLITE_API_KEY"
          ? "Newsletter is not configured yet."
          : "Something went wrong while subscribing.",
    });
  }
}
