"use client";

import { FormEvent, useMemo, useState } from "react";

type Platform = "epic" | "xbl" | "psn" | "account";
type Stat = { value?: number; displayValue?: string };
type Result = {
  account?: { name?: string; id?: string };
  battlePass?: { level?: number; progress?: number };
  stats?: { all?: { overall?: Record<string, Stat> } };
};

const platforms: Array<{ id: Platform; label: string; short: string }> = [
  { id: "epic", label: "Epic Games", short: "EP" },
  { id: "xbl", label: "Xbox", short: "XB" },
  { id: "psn", label: "PlayStation", short: "PS" },
  { id: "account", label: "Account ID", short: "ID" },
];

const placeholders: Record<Platform, string> = {
  epic: "Enter an Epic display name",
  xbl: "Enter an Xbox gamertag",
  psn: "Enter a PlayStation ID",
  account: "Enter an Epic account ID",
};

export default function Home() {
  const [platform, setPlatform] = useState<Platform>("epic");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const selected = useMemo(() => platforms.find((item) => item.id === platform)!, [platform]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = query.trim();
    if (!clean) {
      setError(`Enter ${platform === "account" ? "an account ID" : `a ${selected.label} username`}.`);
      return;
    }
    if (clean.length > 64 || /[\r\n<>]/.test(clean)) {
      setError("That search value is not valid.");
      return;
    }
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const response = await fetch(`/api/lookup?q=${encodeURIComponent(clean)}&platform=${platform}`);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Search failed.");
      setResult(payload.data);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Search failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="ambient ambientOne" />
      <div className="ambient ambientTwo" />
      <section className="shell" aria-labelledby="page-title">
        <header>
          <div className="mark" aria-hidden="true">V</div>
          <div>
            <p className="eyebrow">VITAL TOOLS / PLAYER SEARCH</p>
            <h1 id="page-title">Fortnite Player Lookup</h1>
          </div>
          <span className="status"><i /> Online</span>
        </header>

        <div className="workspace">
          <div className="intro">
            <p className="kicker">ONE SEARCH. ANY PLATFORM.</p>
            <h2>Find a player&apos;s<br /><span>Fortnite profile.</span></h2>
            <p className="lede">Search by Epic display name, Xbox gamertag, PlayStation ID, or Epic account ID. Results open securely on Fortnite Tracker.</p>
          </div>

          <div className="lookupCard">
            <div className="cardTop">
              <span>SEARCH TYPE</span>
              <span className="provider">POWERED BY TRACKER NETWORK</span>
            </div>

            <div className="platforms" role="radiogroup" aria-label="Search platform">
              {platforms.map((item) => (
                <button
                  className={platform === item.id ? "platform active" : "platform"}
                  type="button"
                  role="radio"
                  aria-checked={platform === item.id}
                  key={item.id}
                  onClick={() => { setPlatform(item.id); setError(""); }}
                >
                  <span>{item.short}</span>{item.label}
                </button>
              ))}
            </div>

            <form onSubmit={submit} noValidate>
              <label htmlFor="player">{selected.label} {platform === "account" ? "value" : "username"}</label>
              <div className="searchRow">
                <input
                  id="player"
                  value={query}
                  onChange={(event) => { setQuery(event.target.value); setError(""); }}
                  placeholder={placeholders[platform]}
                  autoComplete="off"
                  maxLength={64}
                  aria-describedby={error ? "search-error" : "search-help"}
                />
                <button className="submit" type="submit" disabled={loading}>{loading ? "Searching…" : "Search player"} <b>→</b></button>
              </div>
              {error ? <p className="error" id="search-error">{error}</p> : <p className="help" id="search-help">The player&apos;s public stats will appear below without leaving this site.</p>}
            </form>

            {result && <PlayerResult result={result} />}

            <div className="example">
              <div className="exampleIcon">i</div>
              <p><strong>Console lookup supported</strong><br />Xbox and PlayStation names are resolved through the selected account type.</p>
            </div>
          </div>
        </div>

        <footer>
          <span>Independent lookup tool</span>
          <span>Not affiliated with Epic Games or Tracker Network</span>
        </footer>
      </section>
    </main>
  );
}

function PlayerResult({ result }: { result: Result }) {
  const overall = result.stats?.all?.overall ?? {};
  const cards = [
    ["Wins", overall.wins],
    ["Matches", overall.matches],
    ["K/D", overall.kd],
    ["Win rate", overall.winRate],
    ["Kills", overall.kills],
    ["Minutes", overall.minutesPlayed],
  ] as const;

  return (
    <section className="result" aria-live="polite">
      <div className="resultHead">
        <div><span>PLAYER FOUND</span><h3>{result.account?.name ?? "Fortnite player"}</h3></div>
        {result.battlePass?.level != null && <div className="level"><span>LEVEL</span><b>{result.battlePass.level}</b></div>}
      </div>
      <div className="statGrid">
        {cards.map(([label, stat]) => <div className="stat" key={label}><span>{label}</span><strong>{stat?.displayValue ?? stat?.value ?? "—"}</strong></div>)}
      </div>
      {result.account?.id && <p className="accountId">Account ID: {result.account.id}</p>}
    </section>
  );
}
