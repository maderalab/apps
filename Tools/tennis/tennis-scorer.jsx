import React, { useState } from "react";
import { RotateCcw, RefreshCw, Trophy, Settings2 } from "lucide-react";

/* ============================================================
   TENNIS SCORER  —  scoring engine (pure functions)
   ============================================================ */

const setsToWinFor = (fmt) => (fmt === "one" ? 1 : fmt === "best3" ? 2 : 3);

const clone = (s) => JSON.parse(JSON.stringify(s));

// Are we in the deciding set (both players one set from the match)?
function isDecidingSet(s) {
  const stw = setsToWinFor(s.config.matchFormat);
  return stw > 1 && s.setsWon[0] === stw - 1 && s.setsWon[1] === stw - 1;
}

// Is the CURRENT set played as a single 10-point match tiebreak (whole set)?
function isSuperTbSet(s) {
  const c = s.config;
  if (c.setFormat === "superTb") return true;
  if (c.decidingSet === "matchTb10" && isDecidingSet(s)) return true;
  return false;
}

// Effective ad rule (Fast4 always forces No-AD)
const effAd = (s) => (s.config.setFormat === "fast4" ? "noAd" : s.config.adType);

// Tiebreak parameters for the current situation
function tbParams(s) {
  if (isSuperTbSet(s)) return { target: 10, winByTwo: true, isSet: true };
  // deciding set played to a 10-point tiebreak at 6–6 (modern Grand Slam / pro)
  if (s.config.decidingSet === "tb10at66" && isDecidingSet(s)) return { target: 10, winByTwo: true, isSet: false };
  if (s.config.setFormat === "fast4") return { target: 5, winByTwo: false, isSet: false };
  return { target: 7, winByTwo: true, isSet: false }; // regular6 + advSet + pro
}

function initState(config, names) {
  const s = {
    config,
    names,
    pts: [0, 0],
    games: [0, 0],
    completedSets: [],
    setsWon: [0, 0],
    inTiebreak: false,
    server: config.firstServer ?? 0,
    done: false,
    winner: null,
    setNum: 0,
    changeEnds: false,
  };
  if (isSuperTbSet(s)) s.inTiebreak = true;
  return s;
}

// Which side the current server serves from: deuce court (right) on an even
// point total, ad court (left) on an odd total. (Same rule in tiebreaks.)
function serveSide(s) {
  if (s.done) return null;
  return (s.pts[0] + s.pts[1]) % 2 === 0 ? "deuce" : "ad";
}

function startTiebreak(s) {
  s.inTiebreak = true;
  s.pts = [0, 0];
}

function winSet(s, p, detail) {
  let entry;
  if (detail.tb && detail.isSet) {
    entry = { type: "superTb", tb: detail.tb, winner: p };
  } else if (s.inTiebreak && detail.tb) {
    const g = [...s.games];
    g[p] += 1; // 6-6 -> 7-6, 8-8 -> 9-8, 3-3(fast4) -> 4-3
    entry = { type: "games", g, tb: detail.tb, winner: p };
    s.changeEnds = ((g[0] + g[1]) % 2 === 1); // odd total games -> change ends
  } else {
    entry = { type: "games", g: detail.games, winner: p };
  }
  s.completedSets.push(entry);
  s.setsWon[p]++;
  s.games = [0, 0];
  s.pts = [0, 0];
  s.inTiebreak = false;
  s.setNum++;

  const stw = setsToWinFor(s.config.matchFormat);
  if (s.setsWon[p] >= stw) {
    s.done = true;
    s.winner = p;
    return s;
  }
  s.server = 1 - s.server; // fresh set, swap first server
  if (isSuperTbSet(s)) startTiebreak(s);
  return s;
}

function winGame(s, p) {
  s.games[p]++;
  s.pts = [0, 0];
  s.server = 1 - s.server;
  const o = 1 - p;
  const g = s.games;
  s.changeEnds = ((g[0] + g[1]) % 2 === 1); // change ends after odd games
  const sf = s.config.setFormat;

  if (sf === "fast4") {
    if (g[p] === 4) return winSet(s, p, { games: [...g] });
    if (g[0] === 3 && g[1] === 3) startTiebreak(s);
    return s;
  }
  const need = sf === "pro" ? 8 : 6; // regular6 + advSet + pro
  if (g[p] >= need && g[p] - g[o] >= 2) return winSet(s, p, { games: [...g] });
  // advantage set: no tiebreak — keep playing until a 2-game lead
  if (sf !== "advSet" && g[0] === need && g[1] === need) startTiebreak(s);
  return s;
}

function applyPoint(prev, p) {
  if (prev.done) return prev;
  const s = clone(prev);
  const o = 1 - p;
  s.changeEnds = false;

  if (s.inTiebreak) {
    s.pts[p]++;
    const { target, winByTwo, isSet } = tbParams(s);
    const won = s.pts[p] >= target && (winByTwo ? s.pts[p] - s.pts[o] >= 2 : true);
    if (won) return winSet(s, p, { tb: [...s.pts], isSet });
    const total = s.pts[0] + s.pts[1];
    if (total % 6 === 0) s.changeEnds = true; // change ends every 6 points in a tiebreak
    if (total === 1 || (total > 1 && (total - 1) % 2 === 0)) s.server = 1 - s.server;
    return s;
  }

  // regular game
  s.pts[p]++;
  const ad = effAd(s);
  let won = false;
  if (ad === "ad") {
    if (s.pts[p] >= 4 && s.pts[p] - s.pts[o] >= 2) won = true;
  } else {
    if (s.pts[p] >= 4 && (s.pts[p] - s.pts[o] >= 2 || s.pts[o] >= 3)) won = true;
  }
  if (won) return winGame(s, p);
  return s;
}

/* ---------- display helpers ---------- */

const PT = ["0", "15", "30", "40"];

function gameLabel(s, p) {
  const o = 1 - p;
  const a = s.pts[p],
    b = s.pts[o];
  if (a <= 3 && b <= 3 && !(a === 3 && b === 3)) return PT[a];
  if (effAd(s) === "ad") {
    if (a === b) return "40";
    if (a === b + 1) return "AD";
    return "40";
  }
  return "40"; // No-AD deciding region
}

function pointDisplay(s, p) {
  if (s.done) return "—";
  if (s.inTiebreak) return String(s.pts[p]);
  return gameLabel(s, p);
}

function statusBanner(s) {
  if (s.done) return null;
  if (s.inTiebreak) {
    const { target, isSet } = tbParams(s);
    if (isSet) return `MATCH TIEBREAK · first to ${target}`;
    return `TIEBREAK · first to ${target}`;
  }
  const [a, b] = s.pts;
  if (a >= 3 && b >= 3) {
    if (effAd(s) === "noAd") return "DECIDING POINT";
    if (a === b) return "DEUCE";
    return `AD · ${s.names[a > b ? 0 : 1]}`;
  }
  return null;
}

const fmtLabel = {
  one: "1 Set", best3: "Best of 3", best5: "Best of 5",
};
const setLabel = {
  regular6: "Regular 6", advSet: "Advantage Set", pro: "Pro Set (8)", fast4: "Fast4", superTb: "Super Tiebreak (10)",
};

/* ============================================================
   UI
   ============================================================ */

const C = {
  bg: "#ffffff", panel: "#f4f6fb", panel2: "#eef0fb", line: "#e3e6ef",
  chalk: "#1f2330", muted: "#8a90a2", ball: "#667eea", clay: "#764ba2",
  onAccent: "#ffffff",
};

function Segment({ options, value, onChange, accent }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map((o) => {
        const on = value === o.v;
        return (
          <button key={o.v} onClick={() => onChange(o.v)} style={{
            flex: "1 1 auto", minWidth: 78, padding: "11px 12px", cursor: "pointer",
            background: on ? accent : "transparent",
            color: on ? C.onAccent : C.chalk,
            border: `1.5px solid ${on ? accent : C.line}`,
            borderRadius: 11, fontFamily: "system-ui,-apple-system,'Segoe UI',sans-serif",
            fontWeight: 700, fontSize: 13.5, letterSpacing: 0.2, transition: "all .15s",
          }}>{o.t}</button>
        );
      })}
    </div>
  );
}

function Setup({ onStart }) {
  const [matchFormat, setMatchFormat] = useState("best3");
  const [setFormat, setSetFormat] = useState("regular6");
  const [adType, setAdType] = useState("ad");
  const [decidingSet, setDecidingSet] = useState("standard");
  const [n1, setN1] = useState("Player 1");
  const [n2, setN2] = useState("Player 2");
  const [firstServer, setFirstServer] = useState(0);

  const showAd = setFormat !== "fast4" && setFormat !== "superTb";
  const showDecider = matchFormat !== "one" && setFormat !== "superTb";

  const lbl = { fontFamily: "system-ui,-apple-system,'Segoe UI',sans-serif", fontSize: 11.5, fontWeight: 800,
    letterSpacing: 2, color: C.muted, textTransform: "uppercase", marginBottom: 11, display: "block" };
  const input = (accent) => ({
    width: "100%", padding: "13px 14px", background: C.panel, color: C.chalk,
    border: `1.5px solid ${C.line}`, borderRadius: 11, fontFamily: "system-ui,-apple-system,'Segoe UI',sans-serif",
    fontSize: 15.5, fontWeight: 700, outline: "none", borderLeft: `4px solid ${accent}`,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
      <div>
        <span style={lbl}>Players</span>
        <div style={{ display: "flex", gap: 10 }}>
          <input value={n1} onChange={(e) => setN1(e.target.value)} style={input(C.ball)} />
          <input value={n2} onChange={(e) => setN2(e.target.value)} style={input(C.clay)} />
        </div>
      </div>
      <div>
        <span style={lbl}>First Serve</span>
        <Segment accent={C.ball} value={firstServer} onChange={setFirstServer}
          options={[{ v: 0, t: n1.trim() || "Player 1" }, { v: 1, t: n2.trim() || "Player 2" }]} />
      </div>
      <div>
        <span style={lbl}>Match</span>
        <Segment accent={C.ball} value={matchFormat} onChange={setMatchFormat}
          options={[{ v: "one", t: "1 Set" }, { v: "best3", t: "Best of 3" }, { v: "best5", t: "Best of 5" }]} />
      </div>
      <div>
        <span style={lbl}>Set Format</span>
        <Segment accent={C.ball} value={setFormat} onChange={setSetFormat}
          options={[{ v: "regular6", t: "Regular 6" }, { v: "advSet", t: "Adv. Set" }, { v: "pro", t: "Pro Set" }, { v: "fast4", t: "Fast4" }, { v: "superTb", t: "Super Tiebreak" }]} />
        <p style={{ fontFamily: "system-ui,-apple-system,'Segoe UI',sans-serif", fontSize: 12.5, color: C.muted, margin: "10px 2px 0", lineHeight: 1.5 }}>
          {setFormat === "regular6" && "First to 6 games, win by 2. Tiebreak (to 7) at 6–6."}
          {setFormat === "advSet" && "First to 6 games, win by 2. No tiebreak — the set is played out."}
          {setFormat === "pro" && "First to 8 games, win by 2. Tiebreak (to 7) at 8–8."}
          {setFormat === "fast4" && "First to 4 games, No-AD. Tiebreak (to 5) at 3–3."}
          {setFormat === "superTb" && "Each set is a 10-point match tiebreak, win by 2."}
        </p>
      </div>
      {showAd && (
        <div>
          <span style={lbl}>Game Scoring</span>
          <Segment accent={C.ball} value={adType} onChange={setAdType}
            options={[{ v: "ad", t: "AD" }, { v: "noAd", t: "No-AD" }]} />
        </div>
      )}
      {showDecider && (
        <div>
          <span style={lbl}>Deciding Set</span>
          <Segment accent={C.ball} value={decidingSet} onChange={setDecidingSet}
            options={[{ v: "standard", t: "Standard" }, { v: "tb10at66", t: "10-pt TB at 6–6" }, { v: "matchTb10", t: "Match Tiebreak (10)" }]} />
          <p style={{ fontFamily: "system-ui,-apple-system,'Segoe UI',sans-serif", fontSize: 12.5, color: C.muted, margin: "10px 2px 0", lineHeight: 1.5 }}>
            {decidingSet === "standard" && "Final set is played like the others."}
            {decidingSet === "tb10at66" && "Final set: at 6–6, play a 10-point tiebreak (modern Grand Slam / pro)."}
            {decidingSet === "matchTb10" && "Final set is replaced by a 10-point match tiebreak (junior / doubles)."}
          </p>
        </div>
      )}
      <button onClick={() => onStart({ matchFormat, setFormat, adType, decidingSet, firstServer }, [n1.trim() || "Player 1", n2.trim() || "Player 2"])}
        style={{ marginTop: 4, padding: "16px", cursor: "pointer", background: C.ball, color: C.onAccent,
          border: "none", borderRadius: 13, fontFamily: "system-ui,-apple-system,'Segoe UI',sans-serif", fontSize: 26,
          letterSpacing: 2, boxShadow: "0 8px 24px rgba(102,126,234,.22)" }}>
        START MATCH
      </button>
    </div>
  );
}

function PlayerRow({ s, p, accent, onPoint }) {
  const serving = !s.done && s.server === p && s.config.setFormat !== "superTb";
  const side = serving ? serveSide(s) : null;
  const won = s.done && s.winner === p;
  const banner = statusBanner(s);
  const ad = banner && banner.startsWith("AD · ") && s.names[p] === banner.replace("AD · ", "");
  const pt = pointDisplay(s, p);

  return (
    <button onClick={() => onPoint(p)} disabled={s.done} style={{
      display: "grid", gridTemplateColumns: "1fr auto auto", alignItems: "center", gap: 14,
      width: "100%", padding: "26px 20px", cursor: s.done ? "default" : "pointer",
      background: won ? "rgba(102,126,234,.07)" : C.panel,
      border: `1.5px solid ${won ? accent : C.line}`, borderLeft: `6px solid ${accent}`,
      borderRadius: 16, textAlign: "left", transition: "transform .08s",
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 11, height: 11, borderRadius: "50%", flexShrink: 0,
            background: serving ? accent : "transparent", border: serving ? "none" : `1.5px solid ${C.line}` }} />
          <span style={{ fontFamily: "system-ui,-apple-system,'Segoe UI',sans-serif", fontWeight: 800, fontSize: 25,
            color: C.chalk, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {s.names[p]}
          </span>
          {side && (
            <span title={side === "deuce" ? "Deuce court (right)" : "Ad court (left)"}
              style={{ fontSize: 12, fontWeight: 800, color: accent, border: `1.3px solid ${accent}`,
                borderRadius: 6, padding: "1px 6px", flexShrink: 0, letterSpacing: 0.5 }}>
              {side === "deuce" ? "R" : "L"}
            </span>
          )}
          {won && <Trophy size={20} color={accent} style={{ flexShrink: 0 }} />}
        </div>
      </div>

      {/* completed sets + current games */}
      <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
        {s.completedSets.map((set, i) => {
          const val = set.type === "superTb" ? set.tb[p] : set.g[p];
          const w = set.winner === p;
          return (
            <div key={i} style={{ position: "relative", textAlign: "center" }}>
              <span style={{ fontFamily: "system-ui,-apple-system,'Segoe UI',sans-serif", fontSize: 33, lineHeight: 1,
                color: w ? C.chalk : C.muted }}>{val}</span>
              {set.tb && set.type !== "superTb" && (
                <sup style={{ fontFamily: "system-ui,-apple-system,'Segoe UI',sans-serif", fontSize: 10, color: C.muted,
                  fontWeight: 700, position: "absolute", top: 0, right: -9 }}>{set.tb[p]}</sup>
              )}
            </div>
          );
        })}
        {!s.done && s.config.setFormat !== "superTb" && (
          <span style={{ fontFamily: "system-ui,-apple-system,'Segoe UI',sans-serif", fontSize: 40, lineHeight: 1,
            color: C.chalk, minWidth: 26, textAlign: "center" }}>{s.games[p]}</span>
        )}
      </div>

      {/* current point / tiebreak point */}
      <div style={{ minWidth: 78, textAlign: "center" }}>
        <span style={{ fontFamily: "system-ui,-apple-system,'Segoe UI',sans-serif", fontSize: 64, fontWeight: 700, lineHeight: 0.8,
          color: ad || (s.inTiebreak && !s.done) ? accent : C.chalk }}>{pt}</span>
      </div>
    </button>
  );
}

function Scoreboard({ s, onPoint, onUndo, onReset, canUndo, notice }) {
  const banner = statusBanner(s);
  const stw = setsToWinFor(s.config.matchFormat);
  const side = serveSide(s);
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, minHeight: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[fmtLabel[s.config.matchFormat], setLabel[s.config.setFormat],
            s.config.setFormat === "fast4" ? "No-AD" : s.config.setFormat === "superTb" ? null : (s.config.adType === "ad" ? "AD" : "No-AD"),
            s.config.decidingSet === "matchTb10" ? "Final: Match TB10" : s.config.decidingSet === "tb10at66" ? "Final: 6–6 TB10" : null].filter(Boolean).map((t, i) => (
            <span key={i} style={{ fontFamily: "system-ui,-apple-system,'Segoe UI',sans-serif", fontSize: 10.5, fontWeight: 800,
              letterSpacing: 0.8, color: C.muted, background: C.panel2, padding: "5px 9px",
              borderRadius: 7, textTransform: "uppercase" }}>{t}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onUndo} disabled={!canUndo} title="Undo"
            style={{ padding: 10, background: C.panel, border: `1.5px solid ${C.line}`, borderRadius: 10,
              cursor: canUndo ? "pointer" : "default", opacity: canUndo ? 1 : 0.4, color: C.chalk, lineHeight: 0 }}>
            <RotateCcw size={17} />
          </button>
          <button onClick={onReset} title="New match"
            style={{ padding: 10, background: C.panel, border: `1.5px solid ${C.line}`, borderRadius: 10,
              cursor: "pointer", color: C.chalk, lineHeight: 0 }}>
            <RefreshCw size={17} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18, minHeight: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "system-ui,-apple-system,'Segoe UI',sans-serif",
          fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: C.muted, padding: "0 20px", textTransform: "uppercase" }}>
          <span>Player · Sets {s.setsWon[0]}–{s.setsWon[1]} · first to {stw}</span>
          <span style={{ display: "flex", gap: 30 }}>
            <span>{s.config.setFormat === "superTb" ? "TB" : "Games"}</span><span>Point</span>
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <PlayerRow s={s} p={0} accent={C.ball} onPoint={onPoint} />
          <PlayerRow s={s} p={1} accent={C.clay} onPoint={onPoint} />
        </div>

        <div style={{ minHeight: 30, textAlign: "center", display: "flex", flexDirection: "column",
          alignItems: "center", gap: 8 }}>
          {s.done ? (
            <span style={{ fontFamily: "system-ui,-apple-system,'Segoe UI',sans-serif", fontSize: 30, fontWeight: 800,
              color: s.winner === 0 ? C.ball : C.clay }}>
              🎾 {s.names[s.winner]} wins the match
            </span>
          ) : (
            <React.Fragment>
              <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1, color: "#c2671c",
                background: "#fff4e6", border: "1px solid #f4d6ad", borderRadius: 999, padding: "6px 14px",
                opacity: notice ? 1 : 0, maxHeight: notice ? 34 : 0, overflow: "hidden",
                transition: "opacity .5s ease, max-height .4s ease", pointerEvents: "none" }}>
                🔄 Change ends
              </span>

              {side && (
                <span style={{ fontSize: 13.5, fontWeight: 700, color: C.muted }}>
                  <b style={{ color: s.server === 0 ? C.ball : C.clay }}>{s.names[s.server]}</b> to serve ·{" "}
                  {side === "deuce" ? "Deuce court (right)" : "Ad court (left)"}
                </span>
              )}
              {banner && (
                <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: 2, color: C.ball, textTransform: "uppercase" }}>{banner}</span>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TennisScorer() {
  const [match, setMatch] = useState(null);
  const [history, setHistory] = useState([]);
  const [ceNotice, setCeNotice] = useState(false); // "change ends" — auto-fades
  const ceTimer = React.useRef(null);
  const clearNotice = () => { clearTimeout(ceTimer.current); setCeNotice(false); };

  // flash the "change ends" notice when a point triggers it, then fade after ~3.5s
  React.useEffect(() => {
    if (match && match.changeEnds) {
      setCeNotice(true);
      clearTimeout(ceTimer.current);
      ceTimer.current = setTimeout(() => setCeNotice(false), 3500);
    }
  }, [match]);

  const start = (config, names) => { clearNotice(); setMatch(initState(config, names)); setHistory([]); };
  const point = (p) => { setHistory((h) => [...h, match]); setMatch((m) => applyPoint(m, p)); };
  const undo = () => { if (!history.length) return; clearNotice(); setMatch(history[history.length - 1]); setHistory((h) => h.slice(0, -1)); };
  const reset = () => { clearNotice(); setMatch(null); };

  return (
    <div style={{ flex: 1, minHeight: 0, background: C.bg, padding: "16px 16px 28px",
      fontFamily: "system-ui,-apple-system,'Segoe UI',sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        button:active:not(:disabled) { transform: scale(.985); }
      `}</style>

      <div style={{ maxWidth: 520, width: "100%", margin: "0 auto", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: 1.5, color: C.muted, textTransform: "uppercase", marginBottom: 18, flexShrink: 0 }}>
          {match ? "Live scoreboard" : <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Settings2 size={12} /> Configure your match</span>}
        </div>

        {match
          ? <Scoreboard s={match} onPoint={point} onUndo={undo} onReset={reset} canUndo={history.length > 0} notice={ceNotice} />
          : <Setup onStart={start} />}
      </div>
    </div>
  );
}
