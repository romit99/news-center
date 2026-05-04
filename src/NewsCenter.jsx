import { useState, useEffect } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const MARKETS = ["US", "India", "China", "EU", "Japan", "UK", "EM", "Middle_East"];
const SECTORS = ["Banking", "Technology", "Pharma", "Energy", "Utilities", "Chemicals", "Metals", "Real_Estate", "FMCG", "Auto", "Telecom", "Infrastructure"];
const ASSETS  = ["Equities", "Bonds", "Gold", "Crude_Oil", "USD_Index", "Crypto", "INR_USD", "VIX"];

const SUB_SECTORS = {
  Banking: [
    { name: "Private Banks",   stocks: ["HDFCBANK", "ICICIBANK", "KOTAKBANK", "AXISBANK", "INDUSINDBK"] },
    { name: "PSU Banks",       stocks: ["SBIN", "BANKBARODA", "PNB", "CANBK", "UNIONBANK"] },
    { name: "NBFCs",           stocks: ["BAJFINANCE", "CHOLAFIN", "SHRIRAMFIN", "M&MFIN", "TATACAP", "SATIN"] },
    { name: "Housing Finance", stocks: ["LICHSGFIN", "BAJAJHFL", "PNBHOUSING"] },
    { name: "Insurance",       stocks: ["SBILIFE", "HDFCLIFE", "ICICIPRULI", "ICICIGI", "NIACL", "LICI"] },
    { name: "Capital Markets", stocks: ["BSE", "MCX", "ANGELONE", "CDSL", "KFINTECH", "MOTILALOFS", "NSDL", "CMSINFO"] },
  ],
  Technology: [
    { name: "Large-cap IT",    stocks: ["TCS", "INFY", "WIPRO", "HCLTECH", "TECHM"] },
    { name: "Mid-cap IT",      stocks: ["LTIM", "PERSISTENT", "COFORGE", "MPHASIS", "BIRLASOFT", "LATENTVIEW", "SAKSOFT", "ADSL", "REDINGTON"] },
    { name: "IT Products / ER&D", stocks: ["TATAELXSI", "CYIENT", "OFSS", "KPITTECH", "DLINKINDIA"] },
    { name: "New-age Tech",    stocks: ["ZOMATO", "PAYTM", "POLICYBZR", "NYKAA"] },
  ],
  Pharma: [
    { name: "US-exposed",      stocks: ["DRREDDY", "LUPIN", "AUROPHARMA", "SUNPHARMA", "ZYDUSLIFE", "AARTIDRUGS", "AARTIPHARMA"] },
    { name: "Domestic-focused", stocks: ["CIPLA", "ALKEM", "MANKIND", "TORNTPHARM", "JBCHEPHARM"] },
    { name: "CDMO / CRO",      stocks: ["DIVISLAB", "SYNGENE", "LAURUSLABS", "GLAND"] },
    { name: "Hospitals",       stocks: ["APOLLOHOSP", "MAXHEALTH", "FORTIS", "NH", "INDRAMEDCO"] },
    { name: "Diagnostics",     stocks: ["DRLAL", "METROPOLIS", "THYROCARE"] },
  ],
  Energy: [
    { name: "Oil Upstream",    stocks: ["ONGC", "OIL"] },
    { name: "Oil Marketing (OMCs)", stocks: ["BPCL", "HPCL", "IOC"] },
    { name: "Refining + Petchem", stocks: ["RELIANCE"] },
    { name: "Coal",            stocks: ["COALINDIA"] },
    { name: "Gas Distribution", stocks: ["GAIL", "IGL", "MGL", "PETRONET", "GUJGASLTD"] },
  ],
  Utilities: [
    { name: "Electric Utilities", stocks: ["NTPC", "TATAPOWER", "ADANIPOWER", "JSWENERGY", "NHPC", "SWANCORP"] },
    { name: "Power Transmission", stocks: ["POWERGRID"] },
    { name: "Renewables",         stocks: ["ADANIGREEN", "SUZLON", "INOXWIND", "IREDA"] },
  ],
  Chemicals: [
    { name: "Specialty Chemicals", stocks: ["SRF", "NAVINFLUOR", "PIIND", "ATUL", "VINATIORGA", "FINEORG", "AARTIIND", "ROSSARI", "GHCL"] },
    { name: "Agrochemicals",       stocks: ["UPL", "BAYERCROP", "RALLIS", "SUMICHEM", "DHANUKA"] },
    { name: "Commodity Chemicals", stocks: ["TATACHEM", "GNFC", "DCMSHRIRAM", "DEEPAKFERT", "DEEPAKNTR"] },
  ],
  Metals: [
    { name: "Steel / Ferrous", stocks: ["TATASTEEL", "JSWSTEEL", "SAIL", "JINDALSTEL", "JSL", "SARDAEN", "METALIETF"] },
    { name: "Non-Ferrous",     stocks: ["HINDALCO", "VEDL", "HINDZINC", "NATIONALUM", "HINDCOPPER"] },
    { name: "Mining",          stocks: ["NMDC", "MOIL", "GMDCLTD"] },
  ],
  Real_Estate: [
    { name: "Residential Builders", stocks: ["DLF", "GODREJPROP", "OBEROIRLTY", "PRESTIGE", "SOBHA", "BRIGADE", "ANANTRAJ"] },
    { name: "Commercial REITs", stocks: ["EMBASSY", "MINDSPACE", "BIRET", "NXST"] },
    { name: "Cement",          stocks: ["ULTRACEMCO", "SHREECEM", "AMBUJACEM", "ACC", "DALBHARAT", "JKCEMENT"] },
    { name: "Building Materials", stocks: ["ASIANPAINT", "BERGEPAINT", "PIDILITIND", "KAJARIACER"] },
  ],
  FMCG: [
    { name: "Personal & Home Care", stocks: ["HINDUNILVR", "DABUR", "MARICO", "GODREJCP", "COLPAL", "EMAMILTD"] },
    { name: "Foods & Beverages", stocks: ["NESTLEIND", "BRITANNIA", "TATACONSUM", "VBL"] },
    { name: "Cigarettes",      stocks: ["ITC", "GODFRYPHLP"] },
    { name: "Alcobev",         stocks: ["UNITDSPR", "UBL", "RADICO"] },
    { name: "Quick Commerce",  stocks: ["ZOMATO", "DMART"] },
  ],
  Auto: [
    { name: "Passenger Vehicles", stocks: ["MARUTI", "M&M", "TATAMOTORS"] },
    { name: "2-Wheelers",      stocks: ["BAJAJ-AUTO", "HEROMOTOCO", "TVSMOTOR", "EICHERMOT"] },
    { name: "Commercial Vehicles", stocks: ["ASHOKLEY", "TATAMOTORS"] },
    { name: "Tractors",        stocks: ["M&M", "ESCORTS"] },
    { name: "Auto Ancillaries", stocks: ["BOSCHLTD", "BHARATFORG", "MOTHERSON", "SONACOMS"] },
    { name: "Tyres",           stocks: ["MRF", "APOLLOTYRE", "CEAT", "BALKRISIND"] },
  ],
  Telecom: [
    { name: "Telecom Operators", stocks: ["BHARTIARTL", "IDEA", "RELIANCE"] },
    { name: "Tower Infrastructure", stocks: ["INDUSTOWER"] },
    { name: "Wired / Fibre",   stocks: ["TATACOMM", "RAILTEL"] },
  ],
  Infrastructure: [
    { name: "Construction / EPC", stocks: ["LT", "KEC", "NCC", "AFCONS", "KALPATPOWR", "GARUDA", "TRANSRAIL"] },
    { name: "Capital Goods",   stocks: ["SIEMENS", "ABB", "CUMMINSIND", "THERMAX", "BHEL", "ABBPOWER", "GRAPHITE", "DYCL", "TRITURBINE"] },
    { name: "Defense",         stocks: ["HAL", "BEL", "MAZDOCK", "BDL", "GRSE", "COCHINSHIP"] },
    { name: "Railways",        stocks: ["RVNL", "IRCTC", "TITAGARH", "JWL", "RAILTEL"] },
    { name: "Ports / Logistics", stocks: ["ADANIPORTS", "CONCOR", "GMRINFRA", "JSWINFRA", "SCI"] },
    { name: "Roads / Highways", stocks: ["IRB", "ASHOKA", "PNCINFRA", "SRM"] },
    { name: "Paper & Packaging", stocks: ["WSTCSTPAPR", "JKPAPER", "TNPL"] },
  ],
};

const STOCK_LOOKUP = {};
Object.entries(SUB_SECTORS).forEach(([sector, subs]) => {
  subs.forEach(sub => {
    sub.stocks.forEach(stock => {
      if (!STOCK_LOOKUP[stock]) STOCK_LOOKUP[stock] = [];
      STOCK_LOOKUP[stock].push({ sector, subSector: sub.name });
    });
  });
});

function classifyTicker(ticker) {
  const t = ticker.trim().toUpperCase();
  return STOCK_LOOKUP[t] || [];
}

const STORAGE_KEY = "news_center_last_run";
const STOCKS_STORAGE_KEY = "news_center_stocks";

// IMPORTANT: Replace this with YOUR worker URL
const WORKER_URL = "https://news-center-romit.romit-dodhia.workers.dev";

const FETCH_PRESETS = {
  india_focus: { label: "India Focus" },
  global_macro: { label: "Global Macro" },
  combined: { label: "India + Global" },
  commodities: { label: "Commodities & FX" },
};

// Storage abstraction — uses localStorage in standalone mode, window.storage if available
const storage = {
  async get(key) {
    try {
      const v = localStorage.getItem(key);
      return v != null ? { value: v } : null;
    } catch { return null; }
  },
  async set(key, value) {
    try { localStorage.setItem(key, value); return true; } catch { return false; }
  },
  async delete(key) {
    try { localStorage.removeItem(key); return true; } catch { return false; }
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function scoreColor(s) {
  if (s >= 4)  return { bg: "#052e16", text: "#4ade80", border: "#166534" };
  if (s >= 2)  return { bg: "#0f3d20", text: "#86efac", border: "#22c55e" };
  if (s >= 1)  return { bg: "#1a3a1a", text: "#bbf7d0", border: "#4ade80" };
  if (s === 0) return { bg: "#15151c", text: "#64748b", border: "#27272f" };
  if (s >= -1) return { bg: "#3a1414", text: "#fca5a5", border: "#ef4444" };
  if (s >= -2) return { bg: "#4a0f0f", text: "#f87171", border: "#dc2626" };
  return         { bg: "#5a0808", text: "#fca5a5", border: "#b91c1c" };
}

function aggregateScores(stories) {
  const agg = { markets: {}, sectors: {}, assets: {} };
  MARKETS.forEach(k => agg.markets[k] = 0);
  SECTORS.forEach(k => agg.sectors[k] = 0);
  ASSETS.forEach(k => agg.assets[k] = 0);
  stories.forEach(s => {
    if (!s.impacts) return;
    Object.keys(s.impacts.markets || {}).forEach(k => agg.markets[k] = (agg.markets[k] || 0) + s.impacts.markets[k]);
    Object.keys(s.impacts.sectors || {}).forEach(k => agg.sectors[k] = (agg.sectors[k] || 0) + s.impacts.sectors[k]);
    Object.keys(s.impacts.assets  || {}).forEach(k => agg.assets[k]  = (agg.assets[k]  || 0) + s.impacts.assets[k]);
  });
  ["markets","sectors","assets"].forEach(g => {
    Object.keys(agg[g]).forEach(k => agg[g][k] = Math.max(-5, Math.min(5, agg[g][k])));
  });
  return agg;
}

function totalMagnitude(s) {
  if (!s.impacts) return 0;
  let total = 0;
  ["markets","sectors","assets"].forEach(g => {
    Object.values(s.impacts[g] || {}).forEach(v => total += Math.abs(v));
  });
  return total;
}

function netSentiment(stories) {
  let pos = 0, neg = 0;
  stories.forEach(s => {
    if (!s.impacts) return;
    ["markets","sectors","assets"].forEach(g => {
      Object.values(s.impacts[g] || {}).forEach(v => {
        if (v > 0) pos += v;
        if (v < 0) neg += Math.abs(v);
      });
    });
  });
  const net = pos - neg;
  if (net > 15)  return { label: "RISK-ON",  color: "#4ade80", bg: "#052e16", border: "#166534" };
  if (net < -15) return { label: "RISK-OFF", color: "#f87171", bg: "#3a0000", border: "#7f1d1d" };
  return { label: "NEUTRAL", color: "#fbbf24", bg: "#1c1400", border: "#b45309" };
}

function formatPubDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// ─── WORKER API CALLS ─────────────────────────────────────────────────────────

async function fetchAndAnalyze(preset, count) {
  const url = `${WORKER_URL}/fetch-and-analyze?preset=${preset}&count=${count}`;
  const res = await fetch(url);
  if (!res.ok) {
    let detail = "";
    try { const j = await res.json(); detail = j.error || ""; } catch {}
    throw new Error(`Worker ${res.status}${detail ? ": " + detail : ""}`);
  }
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Worker returned ok:false");
  if (!Array.isArray(data.stories) || data.stories.length === 0) {
    throw new Error("Worker returned empty stories array");
  }
  return data.stories;
}

async function analyzeManualHeadlines(headlinesText) {
  const res = await fetch(`${WORKER_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ headlines: headlinesText }),
  });
  if (!res.ok) {
    let detail = "";
    try { const j = await res.json(); detail = j.error || ""; } catch {}
    throw new Error(`Worker ${res.status}${detail ? ": " + detail : ""}`);
  }
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Worker returned ok:false");
  if (!Array.isArray(data.stories) || data.stories.length === 0) {
    throw new Error("Worker returned empty stories array");
  }
  return data.stories;
}

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function LiveDot({ color = "#4ade80" }) {
  return <span style={{
    display: "inline-block", width: 7, height: 7, borderRadius: "50%",
    background: color, marginRight: 6, verticalAlign: "middle",
    animation: "livePulse 1.6s ease-in-out infinite"
  }} />;
}

function Tag({ children, color = "#ffc832" }) {
  return <span style={{
    background: `${color}1a`, color, border: `1px solid ${color}55`,
    borderRadius: 3, padding: "2px 8px", fontSize: 10, fontWeight: 700,
    fontFamily: "ui-monospace, monospace", letterSpacing: "0.06em",
    whiteSpace: "nowrap", textTransform: "uppercase"
  }}>{children}</span>;
}

function SectionLabel({ children, accent = "#ffc832" }) {
  return <div style={{
    fontSize: 10, fontFamily: "ui-monospace, monospace", color: accent,
    letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14, fontWeight: 700
  }}>{children}</div>;
}

function Card({ children, style = {} }) {
  return <div style={{
    background: "#0d0d14", border: "1px solid #1a1a24",
    borderRadius: 8, padding: "18px 20px", ...style
  }}>{children}</div>;
}

function HeatCell({ label, score, large = false }) {
  const c = scoreColor(score);
  return <div style={{
    background: c.bg, border: `1px solid ${c.border}`,
    borderRadius: 6, padding: large ? "10px 12px" : "8px 10px",
    minWidth: large ? 100 : 78, textAlign: "center"
  }}>
    <div style={{ fontSize: 9.5, color: "#71717a", fontFamily: "ui-monospace, monospace", marginBottom: 4 }}>{label.replace(/_/g, " ")}</div>
    <div style={{ fontSize: large ? 20 : 17, fontWeight: 700, color: c.text, fontFamily: "ui-monospace, monospace", lineHeight: 1 }}>
      {score > 0 ? `+${score}` : score}
    </div>
    <div style={{ fontSize: 10, color: c.text, marginTop: 3 }}>{score > 0 ? "▲" : score < 0 ? "▼" : "—"}</div>
  </div>;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function NewsCenter() {
  const [stories, setStories]             = useState([]);
  const [loading, setLoading]             = useState(false);
  const [loadingStage, setLoadingStage]   = useState("");
  const [error, setError]                 = useState(null);
  const [activeStory, setActiveStory]     = useState(null);
  const [view, setView]                   = useState("aggregate");
  const [briefOpen, setBriefOpen]         = useState(true);
  const [lastUpdated, setLastUpdated]     = useState(null);
  const [preset, setPreset]               = useState("combined");
  const [headlineCount, setHeadlineCount] = useState(7);
  const [showManual, setShowManual]       = useState(false);
  const [manualText, setManualText]       = useState("");
  const [hoveredSector, setHoveredSector] = useState(null);
  const [stocks, setStocks]               = useState([]);
  const [stockTab, setStockTab]           = useState("all");
  const [stockFilter, setStockFilter]     = useState("");
  const [newTicker, setNewTicker]         = useState("");
  const [newSector, setNewSector]         = useState("");
  const [newSubSector, setNewSubSector]   = useState("");
  const [addAs, setAddAs]                 = useState("holding");
  const [addError, setAddError]           = useState("");

  useEffect(() => {
    (async () => {
      try {
        const cached = await storage.get(STORAGE_KEY);
        if (cached && cached.value) {
          const parsed = JSON.parse(cached.value);
          if (parsed.stories) setStories(parsed.stories);
          if (parsed.timestamp) setLastUpdated(new Date(parsed.timestamp));
        }
      } catch (e) {}
      try {
        const cachedStocks = await storage.get(STOCKS_STORAGE_KEY);
        if (cachedStocks && cachedStocks.value) {
          const parsed = JSON.parse(cachedStocks.value);
          if (Array.isArray(parsed)) setStocks(parsed);
        }
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    if (!newTicker.trim()) { setNewSector(""); setNewSubSector(""); setAddError(""); return; }
    const matches = classifyTicker(newTicker);
    if (matches.length === 1) {
      setNewSector(matches[0].sector);
      setNewSubSector(matches[0].subSector);
    } else {
      setNewSector(""); setNewSubSector("");
    }
    setAddError("");
  }, [newTicker]);

  async function saveStocks(updated) {
    setStocks(updated);
    try { await storage.set(STOCKS_STORAGE_KEY, JSON.stringify(updated)); } catch {}
  }

  function attemptAdd() {
    const t = newTicker.trim().toUpperCase();
    if (!t) { setAddError("Enter a ticker"); return; }
    if (!newSector || !newSubSector) { setAddError("Pick sector & sub-sector"); return; }
    if (stocks.some(s => s.ticker === t && s.type === addAs)) {
      setAddError(`${t} already in ${addAs}`);
      return;
    }
    saveStocks([...stocks, {
      ticker: t, sector: newSector, subSector: newSubSector,
      type: addAs, addedAt: new Date().toISOString()
    }]);
    setNewTicker(""); setNewSector(""); setNewSubSector(""); setAddError("");
  }

  function removeStock(ticker, type) {
    saveStocks(stocks.filter(s => !(s.ticker === ticker && s.type === type)));
  }

  async function persistResults(sorted, ts) {
    try {
      await storage.set(STORAGE_KEY, JSON.stringify({
        stories: sorted, timestamp: ts.toISOString()
      }));
    } catch {}
  }

  async function handleFetchAndAnalyze() {
    setLoading(true); setError(null);
    try {
      setLoadingStage("Fetching news + analyzing with Opus...");
      const result = await fetchAndAnalyze(preset, headlineCount);
      const sorted = result.sort((a, b) => totalMagnitude(b) - totalMagnitude(a));
      setStories(sorted);
      setActiveStory(null);
      setView("aggregate");
      const ts = new Date();
      setLastUpdated(ts);
      await persistResults(sorted, ts);
    } catch (e) {
      setError(`${e.message}. You can use Manual Paste below as a fallback.`);
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  }

  async function handleManualAnalyze() {
    if (!manualText.trim()) return;
    setLoading(true); setError(null);
    try {
      setLoadingStage(`Analyzing ${manualText.split("\n").filter(l => l.trim()).length} headlines...`);
      const result = await analyzeManualHeadlines(manualText);
      const sorted = result.sort((a, b) => totalMagnitude(b) - totalMagnitude(a));
      setStories(sorted);
      setActiveStory(null);
      setView("aggregate");
      const ts = new Date();
      setLastUpdated(ts);
      await persistResults(sorted, ts);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  }

  const displayStory = view === "story" && activeStory != null ? stories[activeStory] : null;
  const displayImpacts = displayStory ? displayStory.impacts : (stories.length > 0 ? aggregateScores(stories) : null);
  const sentiment = stories.length > 0 ? netSentiment(stories) : null;
  const top3 = stories.slice(0, 3);

  return (
    <div style={{ minHeight: "100vh", background: "#08080c", fontFamily: "'Inter', -apple-system, sans-serif", color: "#e4e4e7" }}>
      <style>{`
        @keyframes livePulse {
          0%   { box-shadow: 0 0 0 0 rgba(74,222,128,0.6); }
          70%  { box-shadow: 0 0 0 6px rgba(74,222,128,0); }
          100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .row-hover:hover { background: #15151c !important; }
      `}</style>

      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,200,50,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,200,50,0.025) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      <div style={{
        background: "rgba(8,8,12,0.95)", borderBottom: "1px solid #1a1a24",
        padding: "12px 28px", display: "flex", alignItems: "center", gap: 18,
        position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(8px)"
      }}>
        <span style={{ fontFamily: "ui-monospace, monospace", fontWeight: 800, color: "#ffc832", fontSize: 14, letterSpacing: 3 }}>NEWS CENTER</span>
        <span style={{ color: "#27272f" }}>·</span>
        <span style={{ fontSize: 11, color: "#71717a", fontFamily: "ui-monospace, monospace", letterSpacing: "0.1em" }}>GLOBAL MARKETS INTELLIGENCE</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14, fontSize: 11, fontFamily: "ui-monospace, monospace", color: "#71717a" }}>
          {lastUpdated && (
            <span><LiveDot />UPDATED {lastUpdated.toTimeString().slice(0, 5)}</span>
          )}
          <span>{new Date().toDateString().toUpperCase()}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "22px 22px 60px", position: "relative", zIndex: 1 }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontFamily: "ui-monospace, monospace", color: "#ffc832", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 4, fontWeight: 700 }}>● PRE-MARKET INTELLIGENCE</div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fafafa", margin: 0, letterSpacing: -0.5 }}>What's moving markets today</h1>
          </div>
          {sentiment && (
            <div style={{
              background: sentiment.bg, border: `1px solid ${sentiment.border}`,
              borderRadius: 6, padding: "8px 14px", textAlign: "right"
            }}>
              <div style={{ fontSize: 9.5, color: "#52525b", fontFamily: "ui-monospace, monospace", letterSpacing: "0.2em", marginBottom: 3 }}>NET SENTIMENT</div>
              <div style={{ fontFamily: "ui-monospace, monospace", fontWeight: 800, color: sentiment.color, fontSize: 14, letterSpacing: "0.12em" }}>{sentiment.label}</div>
            </div>
          )}
        </div>

        <Card style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
            <div style={{ flex: "1 1 240px" }}>
              <div style={{ fontSize: 10, color: "#52525b", fontFamily: "ui-monospace, monospace", letterSpacing: "0.18em", marginBottom: 6 }}>SEARCH SCOPE</div>
              <select
                value={preset}
                onChange={e => setPreset(e.target.value)}
                disabled={loading}
                style={{
                  width: "100%", background: "#08080c", border: "1px solid #1a1a24",
                  borderRadius: 5, padding: "9px 12px", color: "#e4e4e7", fontSize: 13,
                  fontFamily: "ui-monospace, monospace", outline: "none", cursor: "pointer"
                }}>
                {Object.entries(FETCH_PRESETS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: "0 0 130px" }}>
              <div style={{ fontSize: 10, color: "#52525b", fontFamily: "ui-monospace, monospace", letterSpacing: "0.18em", marginBottom: 6 }}>HEADLINES</div>
              <select
                value={headlineCount}
                onChange={e => setHeadlineCount(Number(e.target.value))}
                disabled={loading}
                style={{
                  width: "100%", background: "#08080c", border: "1px solid #1a1a24",
                  borderRadius: 5, padding: "9px 12px", color: "#e4e4e7", fontSize: 13,
                  fontFamily: "ui-monospace, monospace", outline: "none", cursor: "pointer"
                }}>
                {[5, 7, 10].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <button
              onClick={handleFetchAndAnalyze}
              disabled={loading}
              style={{
                background: loading ? "#3f3f46" : "#ffc832",
                color: loading ? "#71717a" : "#08080c",
                border: "none", borderRadius: 5, padding: "10px 24px",
                fontSize: 12, fontWeight: 800, fontFamily: "ui-monospace, monospace",
                letterSpacing: "0.1em", textTransform: "uppercase",
                cursor: loading ? "wait" : "pointer", height: 38
              }}
            >
              {loading ? "Working..." : "▸ Fetch & Analyze"}
            </button>
          </div>

          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #1a1a24" }}>
            <div onClick={() => setShowManual(!showManual)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#71717a", fontFamily: "ui-monospace, monospace", letterSpacing: "0.08em" }}>
                {showManual ? "▼" : "▶"} Manual paste fallback
              </span>
            </div>
            {showManual && (
              <div style={{ marginTop: 10 }}>
                <textarea
                  value={manualText}
                  onChange={e => setManualText(e.target.value)}
                  rows={5}
                  placeholder="Paste headlines here, one per line"
                  spellCheck={false}
                  style={{
                    width: "100%", boxSizing: "border-box", background: "#08080c",
                    border: "1px solid #1a1a24", borderRadius: 5, padding: "10px 12px",
                    color: "#e4e4e7", fontSize: 12.5, fontFamily: "ui-monospace, monospace",
                    lineHeight: 1.6, outline: "none", resize: "vertical"
                  }}
                />
                <button
                  onClick={handleManualAnalyze}
                  disabled={loading || !manualText.trim()}
                  style={{
                    marginTop: 8, background: "transparent", color: "#ffc832",
                    border: "1px solid #ffc832", borderRadius: 5, padding: "7px 16px",
                    fontSize: 11, fontWeight: 700, fontFamily: "ui-monospace, monospace",
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    cursor: loading || !manualText.trim() ? "not-allowed" : "pointer",
                    opacity: !manualText.trim() ? 0.4 : 1
                  }}>Analyze Pasted Headlines</button>
              </div>
            )}
          </div>

          {error && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#3a0000", border: "1px solid #7f1d1d", borderRadius: 5, color: "#fca5a5", fontSize: 12, lineHeight: 1.5 }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          {loading && loadingStage && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#0d2240", border: "1px solid #1e40af", borderRadius: 5, color: "#93c5fd", fontSize: 12, fontFamily: "ui-monospace, monospace", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-block", width: 12, height: 12, border: "2px solid #1e40af", borderTopColor: "#93c5fd", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              {loadingStage} <span style={{ color: "#52525b" }}>(30–90s)</span>
            </div>
          )}
        </Card>

        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <SectionLabel>Your Stocks · News Pull on Each Holding</SectionLabel>
            <div style={{ fontSize: 10, color: "#52525b", fontFamily: "ui-monospace, monospace" }}>
              {stocks.length} TRACKED
            </div>
          </div>

          <div style={{ background: "#08080c", border: "1px solid #1a1a24", borderRadius: 6, padding: "12px 14px", marginBottom: 14 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-end" }}>
              <div style={{ flex: "1 1 160px" }}>
                <div style={{ fontSize: 9.5, color: "#52525b", fontFamily: "ui-monospace, monospace", letterSpacing: "0.16em", marginBottom: 4 }}>TICKER</div>
                <input
                  value={newTicker}
                  onChange={e => setNewTicker(e.target.value.toUpperCase())}
                  onKeyDown={e => { if (e.key === "Enter") attemptAdd(); }}
                  placeholder="e.g. HDFCBANK"
                  spellCheck={false}
                  style={{
                    width: "100%", boxSizing: "border-box", background: "#0d0d14",
                    border: "1px solid #1a1a24", borderRadius: 4, padding: "6px 10px",
                    color: "#e4e4e7", fontSize: 12, fontFamily: "ui-monospace, monospace",
                    outline: "none"
                  }}
                />
              </div>
              <div style={{ flex: "1 1 140px" }}>
                <div style={{ fontSize: 9.5, color: "#52525b", fontFamily: "ui-monospace, monospace", letterSpacing: "0.16em", marginBottom: 4 }}>SECTOR</div>
                <select
                  value={newSector}
                  onChange={e => { setNewSector(e.target.value); setNewSubSector(""); }}
                  style={{
                    width: "100%", background: "#0d0d14", border: "1px solid #1a1a24",
                    borderRadius: 4, padding: "6px 10px", color: "#e4e4e7", fontSize: 12,
                    fontFamily: "ui-monospace, monospace", outline: "none", cursor: "pointer"
                  }}>
                  <option value="">— pick —</option>
                  {SECTORS.map(s => <option key={s} value={s}>{s.replace(/_/g," ")}</option>)}
                </select>
              </div>
              <div style={{ flex: "1 1 140px" }}>
                <div style={{ fontSize: 9.5, color: "#52525b", fontFamily: "ui-monospace, monospace", letterSpacing: "0.16em", marginBottom: 4 }}>SUB-SECTOR</div>
                <select
                  value={newSubSector}
                  onChange={e => setNewSubSector(e.target.value)}
                  disabled={!newSector}
                  style={{
                    width: "100%", background: "#0d0d14", border: "1px solid #1a1a24",
                    borderRadius: 4, padding: "6px 10px", color: "#e4e4e7", fontSize: 12,
                    fontFamily: "ui-monospace, monospace", outline: "none", cursor: "pointer",
                    opacity: !newSector ? 0.4 : 1
                  }}>
                  <option value="">— pick —</option>
                  {newSector && SUB_SECTORS[newSector] && SUB_SECTORS[newSector].map(sub => (
                    <option key={sub.name} value={sub.name}>{sub.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: "0 0 auto" }}>
                <div style={{ fontSize: 9.5, color: "#52525b", fontFamily: "ui-monospace, monospace", letterSpacing: "0.16em", marginBottom: 4 }}>AS</div>
                <select
                  value={addAs}
                  onChange={e => setAddAs(e.target.value)}
                  style={{
                    background: "#0d0d14", border: "1px solid #1a1a24",
                    borderRadius: 4, padding: "6px 10px", color: "#e4e4e7", fontSize: 12,
                    fontFamily: "ui-monospace, monospace", outline: "none", cursor: "pointer"
                  }}>
                  <option value="holding">Holding</option>
                  <option value="watchlist">Watchlist</option>
                </select>
              </div>
              <button
                onClick={attemptAdd}
                style={{
                  background: "#ffc832", color: "#08080c", border: "none", borderRadius: 4,
                  padding: "8px 18px", fontSize: 11, fontWeight: 800, fontFamily: "ui-monospace, monospace",
                  letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", height: 30
                }}>+ Add</button>
            </div>
            {addError && (
              <div style={{ marginTop: 8, fontSize: 11, color: "#fca5a5", fontFamily: "ui-monospace, monospace" }}>
                {addError}
              </div>
            )}
            {newTicker.trim() && classifyTicker(newTicker).length === 1 && (
              <div style={{ marginTop: 8, fontSize: 11, color: "#86efac", fontFamily: "ui-monospace, monospace" }}>
                ✓ Auto-classified as {newSector.replace(/_/g," ")} · {newSubSector}
              </div>
            )}
            {newTicker.trim() && classifyTicker(newTicker).length > 1 && (
              <div style={{ marginTop: 8, fontSize: 11, color: "#fbbf24", fontFamily: "ui-monospace, monospace" }}>
                ⚠ {newTicker.toUpperCase()} appears in multiple sub-sectors — pick which one
              </div>
            )}
            {newTicker.trim() && classifyTicker(newTicker).length === 0 && (
              <div style={{ marginTop: 8, fontSize: 11, color: "#71717a", fontFamily: "ui-monospace, monospace" }}>
                Unknown ticker — pick sector and sub-sector manually
              </div>
            )}
          </div>

          {stocks.length > 0 && (
            <>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center", flexWrap: "wrap" }}>
                {[
                  { key: "all", label: "All" },
                  { key: "holding", label: "Holdings" },
                  { key: "watchlist", label: "Watchlist" }
                ].map(tab => {
                  const count = tab.key === "all" ? stocks.length : stocks.filter(s => s.type === tab.key).length;
                  return (
                    <button key={tab.key} onClick={() => setStockTab(tab.key)} style={{
                      background: stockTab === tab.key ? "#ffc832" : "transparent",
                      color: stockTab === tab.key ? "#08080c" : "#a1a1aa",
                      border: `1px solid ${stockTab === tab.key ? "#ffc832" : "#27272f"}`,
                      borderRadius: 4, padding: "5px 12px", fontSize: 11, fontWeight: 700,
                      fontFamily: "ui-monospace, monospace", letterSpacing: "0.06em", cursor: "pointer"
                    }}>
                      {tab.label} ({count})
                    </button>
                  );
                })}
                <input
                  value={stockFilter}
                  onChange={e => setStockFilter(e.target.value)}
                  placeholder="Filter by ticker..."
                  spellCheck={false}
                  style={{
                    marginLeft: "auto", background: "#08080c", border: "1px solid #1a1a24",
                    borderRadius: 4, padding: "5px 10px", color: "#e4e4e7", fontSize: 11,
                    fontFamily: "ui-monospace, monospace", outline: "none", maxWidth: 200, flex: "1 1 140px"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 6 }}>
                {(() => {
                  const filtered = stocks
                    .filter(s => stockTab === "all" || s.type === stockTab)
                    .filter(s => !stockFilter || s.ticker.includes(stockFilter.toUpperCase()))
                    .map(s => {
                      const sectorScore = displayImpacts ? (displayImpacts.sectors[s.sector] || 0) : 0;
                      return { ...s, score: sectorScore };
                    })
                    .sort((a, b) => Math.abs(b.score) - Math.abs(a.score));

                  if (filtered.length === 0) {
                    return <div style={{ gridColumn: "1 / -1", fontSize: 12, color: "#52525b", padding: "16px", textAlign: "center" }}>
                      No stocks match
                    </div>;
                  }
                  return filtered.map(s => {
                    const c = scoreColor(s.score);
                    return (
                      <div key={`${s.ticker}-${s.type}`} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        background: "#08080c", border: `1px solid ${c.border}`,
                        borderRadius: 5, padding: "8px 10px"
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontFamily: "ui-monospace, monospace", fontWeight: 700, color: "#e4e4e7", fontSize: 12.5 }}>{s.ticker}</span>
                            <span style={{
                              background: s.type === "holding" ? "rgba(74,222,128,0.1)" : "rgba(96,165,250,0.1)",
                              color: s.type === "holding" ? "#86efac" : "#93c5fd",
                              border: `1px solid ${s.type === "holding" ? "rgba(74,222,128,0.3)" : "rgba(96,165,250,0.3)"}`,
                              fontSize: 9, padding: "0px 5px", borderRadius: 2,
                              fontFamily: "ui-monospace, monospace", textTransform: "uppercase", letterSpacing: "0.06em"
                            }}>{s.type === "holding" ? "HOLD" : "WATCH"}</span>
                          </div>
                          <div style={{ fontSize: 10, color: "#71717a", marginTop: 2, fontFamily: "ui-monospace, monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {s.sector.replace(/_/g," ")} · {s.subSector}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontFamily: "ui-monospace, monospace", fontWeight: 700, fontSize: 14, color: c.text, lineHeight: 1 }}>
                            {s.score > 0 ? `+${s.score}` : s.score}
                          </div>
                          <div style={{ fontSize: 10, color: c.text, marginTop: 2 }}>
                            {s.score > 0 ? "▲" : s.score < 0 ? "▼" : "—"}
                          </div>
                        </div>
                        <button onClick={() => removeStock(s.ticker, s.type)} title="Remove" style={{
                          background: "transparent", border: "none", color: "#52525b",
                          fontSize: 16, cursor: "pointer", padding: "0 4px", lineHeight: 1
                        }}>×</button>
                      </div>
                    );
                  });
                })()}
              </div>

              {stories.length === 0 && (
                <div style={{ marginTop: 12, fontSize: 11, color: "#71717a", fontStyle: "italic", textAlign: "center" }}>
                  Run Fetch & Analyze to see news pull on your stocks.
                </div>
              )}
            </>
          )}

          {stocks.length === 0 && (
            <div style={{ fontSize: 12, color: "#71717a", padding: "12px 0", textAlign: "center", fontStyle: "italic" }}>
              Add stocks above to track news pull on your portfolio and watchlist.
            </div>
          )}
        </Card>

        {stories.length === 0 && !loading && (
          <Card style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 13, color: "#71717a", marginBottom: 6 }}>No analysis yet</div>
            <div style={{ fontSize: 11, color: "#52525b", fontFamily: "ui-monospace, monospace", letterSpacing: "0.1em" }}>HIT FETCH & ANALYZE TO PULL TODAY'S NEWS</div>
          </Card>
        )}

        {stories.length > 0 && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, fontSize: 11, fontFamily: "ui-monospace, monospace" }}>
              <span style={{ color: "#52525b", letterSpacing: "0.18em" }}>VIEW:</span>
              <button onClick={() => { setView("aggregate"); setActiveStory(null); }} style={{
                background: view === "aggregate" ? "#ffc832" : "transparent",
                color: view === "aggregate" ? "#08080c" : "#a1a1aa",
                border: `1px solid ${view === "aggregate" ? "#ffc832" : "#27272f"}`,
                borderRadius: 4, padding: "5px 14px", fontSize: 11, fontWeight: 700,
                fontFamily: "ui-monospace, monospace", letterSpacing: "0.08em", cursor: "pointer"
              }}>AGGREGATE</button>
              <button onClick={() => { setView("story"); if (activeStory == null) setActiveStory(0); }} style={{
                background: view === "story" ? "#ffc832" : "transparent",
                color: view === "story" ? "#08080c" : "#a1a1aa",
                border: `1px solid ${view === "story" ? "#ffc832" : "#27272f"}`,
                borderRadius: 4, padding: "5px 14px", fontSize: 11, fontWeight: 700,
                fontFamily: "ui-monospace, monospace", letterSpacing: "0.08em", cursor: "pointer"
              }}>SINGLE STORY</button>
              {view === "story" && displayStory && (
                <span style={{ color: "#71717a", marginLeft: 6, fontSize: 11 }}>
                  → {displayStory.headline.slice(0, 70)}{displayStory.headline.length > 70 ? "…" : ""}
                </span>
              )}
            </div>

            <Card style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <SectionLabel>Impact Map</SectionLabel>
                <div style={{ fontSize: 10, color: "#52525b", fontFamily: "ui-monospace, monospace", letterSpacing: "0.1em" }}>
                  {view === "aggregate" ? `NET OF ${stories.length} STORIES` : "SINGLE-STORY IMPACT"}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: "#3f3f46", fontFamily: "ui-monospace, monospace", letterSpacing: "0.18em", marginBottom: 8 }}>MARKETS</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {MARKETS.map(m => <HeatCell key={m} label={m} score={displayImpacts.markets[m] || 0} large />)}
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: "#3f3f46", fontFamily: "ui-monospace, monospace", letterSpacing: "0.18em", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>SECTORS</span>
                  <span style={{ color: "#52525b", textTransform: "none", letterSpacing: "0.05em", fontSize: 10 }}>↪ hover for sub-sectors & stocks</span>
                </div>
                <div onMouseLeave={() => setHoveredSector(null)} style={{ position: "relative" }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {SECTORS.map(s => (
                      <div key={s} onMouseEnter={() => setHoveredSector(s)} style={{ cursor: "pointer" }}>
                        <HeatCell label={s} score={displayImpacts.sectors[s] || 0} />
                      </div>
                    ))}
                  </div>
                  {hoveredSector && SUB_SECTORS[hoveredSector] && (
                    <div style={{
                      marginTop: 12, padding: "14px 16px",
                      background: "#0a0a10", border: "1px solid #27272f",
                      borderRadius: 6, animation: "fadeIn 0.15s ease"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid #1a1a24" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 11, color: "#ffc832", fontFamily: "ui-monospace, monospace", letterSpacing: "0.16em", fontWeight: 700 }}>
                            {hoveredSector.replace(/_/g, " ").toUpperCase()}
                          </span>
                          <span style={{
                            background: scoreColor(displayImpacts.sectors[hoveredSector] || 0).bg,
                            color: scoreColor(displayImpacts.sectors[hoveredSector] || 0).text,
                            border: `1px solid ${scoreColor(displayImpacts.sectors[hoveredSector] || 0).border}`,
                            borderRadius: 3, padding: "2px 8px", fontSize: 11, fontWeight: 700,
                            fontFamily: "ui-monospace, monospace"
                          }}>
                            {(displayImpacts.sectors[hoveredSector] || 0) > 0 ? "+" : ""}{displayImpacts.sectors[hoveredSector] || 0}
                          </span>
                        </div>
                        <span style={{ fontSize: 10, color: "#52525b", fontFamily: "ui-monospace, monospace", letterSpacing: "0.08em" }}>
                          {SUB_SECTORS[hoveredSector].length} SUB-BUCKETS · {SUB_SECTORS[hoveredSector].reduce((a, x) => a + x.stocks.length, 0)} STOCKS
                        </span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
                        {SUB_SECTORS[hoveredSector].map(sub => (
                          <div key={sub.name} style={{ background: "#08080c", border: "1px solid #1a1a24", borderRadius: 5, padding: "10px 12px" }}>
                            <div style={{ fontSize: 11, color: "#a1a1aa", fontFamily: "ui-monospace, monospace", fontWeight: 700, letterSpacing: "0.06em", marginBottom: 6, textTransform: "uppercase" }}>
                              {sub.name}
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                              {sub.stocks.map(stock => (
                                <span key={stock} style={{
                                  background: "#1a1a24", color: "#e4e4e7",
                                  border: "1px solid #27272f", borderRadius: 3,
                                  padding: "2px 6px", fontSize: 10.5, fontFamily: "ui-monospace, monospace",
                                  letterSpacing: "0.02em"
                                }}>{stock}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: "#3f3f46", fontFamily: "ui-monospace, monospace", letterSpacing: "0.18em", marginBottom: 8 }}>ASSETS</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {ASSETS.map(a => <HeatCell key={a} label={a} score={displayImpacts.assets[a] || 0} />)}
                </div>
              </div>
            </Card>

            <Card style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <SectionLabel>Shock Feed · Ranked by Impact Magnitude</SectionLabel>
                <div style={{ fontSize: 10, color: "#52525b", fontFamily: "ui-monospace, monospace" }}>{stories.length} STORIES</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {stories.map((s, i) => {
                  const mag = totalMagnitude(s);
                  const isActive = view === "story" && activeStory === i;
                  const allImpacts = [
                    ...Object.entries(s.impacts.markets).map(([k,v]) => ({ name: k, score: v })),
                    ...Object.entries(s.impacts.sectors).map(([k,v]) => ({ name: k, score: v })),
                    ...Object.entries(s.impacts.assets ).map(([k,v]) => ({ name: k, score: v })),
                  ].filter(x => x.score !== 0).sort((a,b) => Math.abs(b.score) - Math.abs(a.score)).slice(0, 5);
                  return (
                    <div
                      key={i}
                      onClick={() => { setView("story"); setActiveStory(i); }}
                      className="row-hover"
                      style={{
                        background: isActive ? "#1a1a24" : "#08080c",
                        border: `1px solid ${isActive ? "#ffc832" : "#1a1a24"}`,
                        borderRadius: 6, padding: "12px 14px", cursor: "pointer",
                        transition: "all 0.12s"
                      }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "ui-monospace, monospace", color: "#ffc832", fontSize: 12, fontWeight: 800 }}>#{i + 1}</span>
                          <Tag color="#a78bfa">{s.source}</Tag>
                          <Tag color="#60a5fa">{s.type}</Tag>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 9, color: "#52525b", fontFamily: "ui-monospace, monospace", letterSpacing: "0.1em" }}>MAGNITUDE</div>
                          <div style={{ fontFamily: "ui-monospace, monospace", fontWeight: 800, fontSize: 15, color: "#ffc832" }}>{mag}</div>
                          {formatPubDate(s.published) && (
                            <div style={{ fontSize: 9.5, color: "#71717a", fontFamily: "ui-monospace, monospace", marginTop: 2, letterSpacing: "0.04em" }}>
                              {formatPubDate(s.published)}
                            </div>
                          )}
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: "#e4e4e7", lineHeight: 1.5, margin: "0 0 8px 0", fontWeight: 500 }}>{s.headline}</p>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                        {allImpacts.map((x, idx) => {
                          const c = scoreColor(x.score);
                          return (
                            <span key={idx} style={{
                              background: c.bg, color: c.text, border: `1px solid ${c.border}`,
                              borderRadius: 3, padding: "2px 7px", fontSize: 10,
                              fontFamily: "ui-monospace, monospace", fontWeight: 600
                            }}>
                              {x.name.replace(/_/g, " ")} {x.score > 0 ? `+${x.score}` : x.score}
                            </span>
                          );
                        })}
                        {s.url && (
                          <a href={s.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{
                            marginLeft: "auto", fontSize: 10, color: "#60a5fa",
                            fontFamily: "ui-monospace, monospace", textDecoration: "none", letterSpacing: "0.05em"
                          }}>READ →</a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {view === "story" && displayStory && (
              <Card style={{ marginBottom: 14, borderColor: "#3f3f46" }}>
                <SectionLabel accent="#a78bfa">Analyst View · {displayStory.headline.slice(0, 80)}{displayStory.headline.length > 80 ? "…" : ""}</SectionLabel>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: "#52525b", fontFamily: "ui-monospace, monospace", letterSpacing: "0.18em", marginBottom: 6 }}>CAUSAL CHAIN</div>
                  <p style={{ fontSize: 13, color: "#d4d4d8", lineHeight: 1.7, margin: 0 }}>{displayStory.analysis}</p>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "#52525b", fontFamily: "ui-monospace, monospace", letterSpacing: "0.18em", marginBottom: 6 }}>WHAT TO DO TODAY</div>
                  <p style={{ fontSize: 13, color: "#7dd3fc", lineHeight: 1.7, margin: 0, fontFamily: "ui-monospace, monospace" }}>{displayStory.analyst_brief}</p>
                </div>
              </Card>
            )}

            <Card>
              <div onClick={() => setBriefOpen(!briefOpen)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", userSelect: "none" }}>
                <div>
                  <SectionLabel>📋 Morning Analyst Brief</SectionLabel>
                  <div style={{ fontSize: 13, color: "#fafafa", fontWeight: 600, marginTop: -8 }}>3 Things That Matter Before Your Morning Meeting</div>
                </div>
                <span style={{ color: "#52525b", fontSize: 11, fontFamily: "ui-monospace, monospace" }}>{briefOpen ? "▲ HIDE" : "▼ SHOW"}</span>
              </div>
              {briefOpen && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #1a1a24" }}>
                  {top3.map((s, i) => (
                    <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < 2 ? "1px solid #1a1a24" : "none" }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                        <span style={{
                          background: "#ffc832", color: "#08080c", width: 22, height: 22, borderRadius: 4,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 800, fontSize: 12, fontFamily: "ui-monospace, monospace", flexShrink: 0
                        }}>{i + 1}</span>
                        <p style={{ fontSize: 13.5, color: "#fafafa", margin: 0, fontWeight: 600, lineHeight: 1.5 }}>{s.headline}</p>
                      </div>
                      <p style={{ fontSize: 12.5, color: "#a1a1aa", lineHeight: 1.65, margin: "0 0 8px 32px" }}>{s.analysis}</p>
                      <p style={{ fontSize: 12, color: "#7dd3fc", lineHeight: 1.6, margin: "0 0 0 32px", fontFamily: "ui-monospace, monospace" }}>
                        <span style={{ color: "#52525b" }}>→ ACTION: </span>{s.analyst_brief}
                      </p>
                    </div>
                  ))}
                  {sentiment && (
                    <div style={{
                      marginTop: 4, padding: "10px 14px", background: sentiment.bg,
                      border: `1px solid ${sentiment.border}`, borderRadius: 6,
                      display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}>
                      <span style={{ fontFamily: "ui-monospace, monospace", fontWeight: 800, color: sentiment.color, fontSize: 13, letterSpacing: "0.12em" }}>
                        NET SENTIMENT: {sentiment.label}
                      </span>
                      <span style={{ fontSize: 11, color: sentiment.color, fontFamily: "ui-monospace, monospace", opacity: 0.8 }}>
                        {stories.length} stories analyzed
                      </span>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </>
        )}

        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid #1a1a24", display: "flex", justifyContent: "space-between", fontSize: 10, color: "#3f3f46", fontFamily: "ui-monospace, monospace", letterSpacing: "0.12em" }}>
          <span>NEWS CENTER · CLOUDFLARE PAGES</span>
          <span>NOT INVESTMENT ADVICE</span>
        </div>
      </div>
    </div>
  );
}
