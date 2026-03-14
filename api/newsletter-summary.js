import { json, mapCampaign, mapSubscriber, sendMailerliteRequest } from "./_mailerlite.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return json(res, 405, { ok: false, message: "Method not allowed." });
  }

  try {
    const [subscribersResult, campaignsResult] = await Promise.allSettled([
      sendMailerliteRequest("/subscribers?limit=5"),
      sendMailerliteRequest("/campaigns?limit=3"),
    ]);

    if (subscribersResult.status !== "fulfilled") {
      throw subscribersResult.reason;
    }

    const subscriberPayload = subscribersResult.value.data;
    const subscriberItems = Array.isArray(subscriberPayload?.data)
      ? subscriberPayload.data
      : Array.isArray(subscriberPayload)
        ? subscriberPayload
        : [];

    const totalSubscribers =
      subscriberPayload?.meta?.total ??
      subscriberPayload?.total ??
      subscriberItems.length;

    const campaignsPayload =
      campaignsResult.status === "fulfilled" ? campaignsResult.value.data : null;

    const campaignItems = Array.isArray(campaignsPayload?.data)
      ? campaignsPayload.data
      : Array.isArray(campaignsPayload)
        ? campaignsPayload
        : [];

    return json(res, 200, {
      ok: true,
      summary: {
        totalSubscribers,
        recentSignups: subscriberItems.map(mapSubscriber),
        campaigns: campaignItems.map(mapCampaign),
      },
    });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      message:
        error.message === "Missing MAILERLITE_API_KEY"
          ? "Newsletter analytics are not configured yet."
          : "Unable to load newsletter analytics right now.",
    });
  }
}
