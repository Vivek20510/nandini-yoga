const MAILERLITE_API_BASE = "https://connect.mailerlite.com/api";

const buildHeaders = () => {
  const apiKey = process.env.MAILERLITE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing MAILERLITE_API_KEY");
  }

  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};

export const json = (res, status, payload) => {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

export const sendMailerliteRequest = async (path, options = {}) => {
  const response = await fetch(`${MAILERLITE_API_BASE}${path}`, {
    ...options,
    headers: {
      ...buildHeaders(),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  return { response, data };
};

export const mapSubscriber = (subscriber) => ({
  id: subscriber?.id || subscriber?.email,
  email: subscriber?.email || "",
  status: subscriber?.status || "active",
  createdAt: subscriber?.created_at || subscriber?.createdAt || null,
  updatedAt: subscriber?.updated_at || subscriber?.updatedAt || null,
});

export const mapCampaign = (campaign) => ({
  id: campaign?.id || campaign?.name,
  name: campaign?.name || campaign?.subject || "Untitled campaign",
  status: campaign?.status || "draft",
  sentAt: campaign?.sent_at || campaign?.updated_at || null,
});
