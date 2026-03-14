import React, { useEffect, useMemo, useState } from "react";
import { BarChart3, ExternalLink, Mail, RefreshCw, Users } from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Outfit:wght@300;400;500;600&display=swap');

  .nlm-root * { box-sizing: border-box; }
  .nlm-root {
    font-family: 'Outfit', sans-serif;
    color: #2C1F14;
  }
  .nlm-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 24px;
  }
  .nlm-title {
    margin: 0;
    font-family: 'Playfair Display', serif;
    font-size: 1.95rem;
    font-weight: 600;
    color: #2C1F14;
  }
  .nlm-subtitle {
    margin-top: 6px;
    font-size: 0.76rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #8C7A6A;
  }
  .nlm-refresh {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #EDE7DA;
    background: #FFFFFF;
    color: #5A4535;
    border-radius: 999px;
    padding: 10px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .nlm-refresh:hover { border-color: #D9CFBF; background: #FDFBF7; }
  .nlm-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  .nlm-card, .nlm-panel {
    background: #FFFFFF;
    border: 1px solid #EDE7DA;
    border-radius: 18px;
    box-shadow: 0 8px 28px rgba(44,31,20,0.06);
  }
  .nlm-card {
    padding: 20px;
  }
  .nlm-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .nlm-icon-wrap {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: #F5F0E8;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #7A5C3E;
  }
  .nlm-card-label {
    font-size: 0.74rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #8C7A6A;
  }
  .nlm-card-value {
    margin-top: 8px;
    font-family: 'Playfair Display', serif;
    font-size: 2.1rem;
    color: #2C1F14;
  }
  .nlm-card-note {
    margin-top: 8px;
    font-size: 0.88rem;
    color: #6A5748;
  }
  .nlm-panels {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 16px;
  }
  .nlm-panel-head {
    padding: 20px 22px 14px;
    border-bottom: 1px solid #F0E9DE;
  }
  .nlm-panel-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    color: #2C1F14;
  }
  .nlm-panel-copy {
    margin-top: 4px;
    font-size: 0.9rem;
    color: #7D6A5A;
    line-height: 1.6;
  }
  .nlm-list {
    padding: 8px 22px 22px;
  }
  .nlm-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid #F4EFE6;
  }
  .nlm-list-item:last-child { border-bottom: none; }
  .nlm-email {
    font-size: 0.95rem;
    color: #2C1F14;
    word-break: break-word;
  }
  .nlm-meta {
    margin-top: 4px;
    font-size: 0.8rem;
    color: #8C7A6A;
  }
  .nlm-status {
    font-size: 0.73rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #7A5C3E;
    background: #F5F0E8;
    border-radius: 999px;
    padding: 7px 10px;
    white-space: nowrap;
  }
  .nlm-links {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 20px 22px 22px;
  }
  .nlm-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    text-decoration: none;
    color: #2C1F14;
    border: 1px solid #EDE7DA;
    border-radius: 14px;
    padding: 14px 16px;
    transition: all 0.2s ease;
    background: #FFFDFC;
  }
  .nlm-link:hover {
    border-color: #D9CFBF;
    transform: translateY(-1px);
  }
  .nlm-link-title {
    font-weight: 500;
  }
  .nlm-link-copy {
    margin-top: 4px;
    font-size: 0.82rem;
    color: #8C7A6A;
  }
  .nlm-banner {
    margin-bottom: 18px;
    border-radius: 14px;
    padding: 14px 16px;
    font-size: 0.92rem;
    line-height: 1.6;
  }
  .nlm-banner.error {
    background: #FDF0ED;
    border: 1px solid rgba(196,83,58,0.18);
    color: #A24F38;
  }
  .nlm-banner.empty {
    background: #F8F4EC;
    border: 1px solid #EDE7DA;
    color: #7D6A5A;
  }
  @media (max-width: 900px) {
    .nlm-panels { grid-template-columns: 1fr; }
    .nlm-head { flex-direction: column; }
  }
`;

const formatDate = (value) => {
  if (!value) return "No date available";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const NewsletterManage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadSummary = async (silent = false) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter-summary");
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.ok) {
        setErrorMessage(data?.message || "Unable to load newsletter analytics right now.");
        setSummary(null);
        return;
      }

      setSummary(data.summary);
    } catch (error) {
      setErrorMessage("Unable to load newsletter analytics right now.");
      setSummary(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const cards = useMemo(() => {
    const totalSubscribers = summary?.totalSubscribers ?? 0;
    const recentSignups = summary?.recentSignups?.length ?? 0;
    const latestCampaigns = summary?.campaigns?.length ?? 0;

    return [
      {
        label: "Subscribers",
        value: totalSubscribers,
        note: "MailerLite remains the source of truth.",
        icon: <Users size={18} />,
      },
      {
        label: "Recent Signups",
        value: recentSignups,
        note: "Latest audience activity pulled into admin.",
        icon: <Mail size={18} />,
      },
      {
        label: "Campaign Snapshots",
        value: latestCampaigns,
        note: "Recent MailerLite campaign data when available.",
        icon: <BarChart3 size={18} />,
      },
    ];
  }, [summary]);

  return (
    <div className="nlm-root">
      <style>{styles}</style>

      <div className="nlm-head">
        <div>
          <h2 className="nlm-title">Newsletter Manager</h2>
          <p className="nlm-subtitle">Audience insights and MailerLite shortcuts</p>
        </div>

        <button
          type="button"
          className="nlm-refresh"
          onClick={() => loadSummary(true)}
          disabled={loading || refreshing}
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {errorMessage ? <div className="nlm-banner error">{errorMessage}</div> : null}

      <div className="nlm-grid">
        {cards.map((card) => (
          <div className="nlm-card" key={card.label}>
            <div className="nlm-card-top">
              <span className="nlm-card-label">{card.label}</span>
              <div className="nlm-icon-wrap">{card.icon}</div>
            </div>
            <div className="nlm-card-value">{loading ? "-" : card.value}</div>
            <div className="nlm-card-note">{card.note}</div>
          </div>
        ))}
      </div>

      <div className="nlm-panels">
        <section className="nlm-panel">
          <div className="nlm-panel-head">
            <div className="nlm-panel-title">Recent Signups</div>
            <div className="nlm-panel-copy">
              A quick look at the newest newsletter subscribers coming in from the homepage form.
            </div>
          </div>

          <div className="nlm-list">
            {!loading && !summary?.recentSignups?.length ? (
              <div className="nlm-banner empty">No recent signups available yet.</div>
            ) : null}

            {(summary?.recentSignups || []).map((subscriber) => (
              <div className="nlm-list-item" key={subscriber.id || subscriber.email}>
                <div>
                  <div className="nlm-email">{subscriber.email}</div>
                  <div className="nlm-meta">
                    {formatDate(subscriber.createdAt || subscriber.updatedAt)}
                  </div>
                </div>
                <span className="nlm-status">{subscriber.status || "active"}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="nlm-panel">
          <div className="nlm-panel-head">
            <div className="nlm-panel-title">MailerLite</div>
            <div className="nlm-panel-copy">
              Campaign creation and deep analytics still live in MailerLite. These links keep the workflow quick.
            </div>
          </div>

          <div className="nlm-links">
            <a
              className="nlm-link"
              href="https://dashboard.mailerlite.com/campaigns"
              target="_blank"
              rel="noreferrer"
            >
              <div>
                <div className="nlm-link-title">Open Campaigns</div>
                <div className="nlm-link-copy">Create and schedule your next newsletter.</div>
              </div>
              <ExternalLink size={16} />
            </a>

            <a
              className="nlm-link"
              href="https://dashboard.mailerlite.com/subscribers"
              target="_blank"
              rel="noreferrer"
            >
              <div>
                <div className="nlm-link-title">View Subscribers</div>
                <div className="nlm-link-copy">Manage segments, groups, and audience details.</div>
              </div>
              <ExternalLink size={16} />
            </a>

            <a
              className="nlm-link"
              href="https://dashboard.mailerlite.com/automations"
              target="_blank"
              rel="noreferrer"
            >
              <div>
                <div className="nlm-link-title">Open Automations</div>
                <div className="nlm-link-copy">Set welcome flows and recurring nurture emails.</div>
              </div>
              <ExternalLink size={16} />
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NewsletterManage;
