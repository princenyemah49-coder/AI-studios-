import { useState, useRef } from "react";

const TABS = ["Text to Video", "Avatar Maker", "Translate", "Shortcuts"];

const VOICES = ["Nova", "Aria", "Onyx", "Shimmer", "Echo"];
const LANGUAGES = ["Spanish", "French", "German", "Mandarin", "Japanese", "Arabic", "Hindi", "Portuguese", "Korean", "Swahili"];
const AVATARS = [
  { id: 1, name: "Alex", emoji: "🧑", tone: "Professional" },
  { id: 2, name: "Maya", emoji: "👩", tone: "Friendly" },
  { id: 3, name: "Sam", emoji: "🧔", tone: "Energetic" },
  { id: 4, name: "Zoe", emoji: "👩‍💼", tone: "Corporate" },
];
const SHORTCUTS = [
  { label: "TikTok Ad", icon: "🎵", color: "#ff2d55" },
  { label: "Product Explainer", icon: "📦", color: "#007aff" },
  { label: "YouTube Short", icon: "▶️", color: "#ff0000" },
  { label: "Course Lesson", icon: "📚", color: "#34c759" },
  { label: "Sales Pitch", icon: "💼", color: "#ff9500" },
  { label: "Announcement", icon: "📣", color: "#5856d6" },
];

function Spinner() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "40px 0" }}>
      <div style={{
        width: 48, height: 48, border: "3px solid #1a1a2e",
        borderTop: "3px solid #00d4ff", borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
      <p style={{ color: "#8888aa", fontFamily: "'Syne', sans-serif", fontSize: 14 }}>Generating your video...</p>
    </div>
  );
}

function VideoResult({ title, onReset }) {
  return (
    <div style={{ textAlign: "center", padding: "24px 0" }}>
      <div style={{
        background: "linear-gradient(135deg, #0d0d1a 0%, #1a1a3e 100%)",
        border: "1px solid #00d4ff44",
        borderRadius: 16,
        padding: "32px 24px",
        marginBottom: 20,
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(circle at 50% 0%, #00d4ff11 0%, transparent 70%)"
        }} />
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎬</div>
        <p style={{ color: "#00d4ff", fontFamily: "'Syne', sans-serif", fontSize: 13, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Video Ready</p>
        <h3 style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 4 }}>{title || "Your AI Video"}</h3>
        <p style={{ color: "#8888aa", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>HD • 16:9 • AI Generated</p>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button onClick={onReset} style={outlineBtn}>Make Another</button>
        <button style={primaryBtn}>⬇ Download</button>
      </div>
    </div>
  );
}

const primaryBtn = {
  background: "linear-gradient(135deg, #00d4ff, #0066ff)",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  padding: "12px 24px",
  fontFamily: "'Syne', sans-serif",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
  letterSpacing: 0.5,
};
const outlineBtn = {
  background: "transparent",
  color: "#00d4ff",
  border: "1px solid #00d4ff55",
  borderRadius: 12,
  padding: "12px 24px",
  fontFamily: "'Syne', sans-serif",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
};
const inputStyle = {
  width: "100%",
  background: "#0d0d1a",
  border: "1px solid #ffffff15",
  borderRadius: 12,
  padding: "14px 16px",
  color: "#fff",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
  resize: "none",
};
const labelStyle = {
  color: "#8888aa",
  fontFamily: "'Syne', sans-serif",
  fontSize: 12,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  marginBottom: 8,
  display: "block",
};

function TextToVideo() {
  const [prompt, setPrompt] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [voice, setVoice] = useState(VOICES[0]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState("");

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a video title generator. Given this video prompt, respond with ONLY a short, punchy video title (max 8 words). No quotes, no explanation.\n\nPrompt: ${prompt}`
          }]
        })
      });
      const data = await res.json();
      setResult(data.content?.[0]?.text || prompt);
    } catch {
      setResult(prompt.slice(0, 40));
    }
    setLoading(false);
    setDone(true);
  };

  if (done) return <VideoResult title={result} onReset={() => { setDone(false); setPrompt(""); }} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <label style={labelStyle}>Your Prompt</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={4}
          placeholder="Describe your video... e.g. 'A 60-second explainer about our new product launch for entrepreneurs'"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Choose Avatar</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {AVATARS.map(a => (
            <button key={a.id} onClick={() => setAvatar(a)} style={{
              background: avatar.id === a.id ? "#00d4ff15" : "#0d0d1a",
              border: `1px solid ${avatar.id === a.id ? "#00d4ff" : "#ffffff15"}`,
              borderRadius: 12,
              padding: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              <span style={{ fontSize: 28 }}>{a.emoji}</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600 }}>{a.name}</div>
                <div style={{ color: "#8888aa", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>{a.tone}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={labelStyle}>Voice</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {VOICES.map(v => (
            <button key={v} onClick={() => setVoice(v)} style={{
              background: voice === v ? "#00d4ff20" : "transparent",
              border: `1px solid ${voice === v ? "#00d4ff" : "#ffffff20"}`,
              color: voice === v ? "#00d4ff" : "#8888aa",
              borderRadius: 20,
              padding: "8px 16px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              cursor: "pointer",
            }}>{v}</button>
          ))}
        </div>
      </div>

      {loading ? <Spinner /> : (
        <button onClick={generate} disabled={!prompt.trim()} style={{
          ...primaryBtn,
          opacity: prompt.trim() ? 1 : 0.4,
          width: "100%",
          padding: "16px",
          fontSize: 15,
        }}>✨ Generate Video</button>
      )}
    </div>
  );
}

function AvatarMaker() {
  const [script, setScript] = useState("");
  const [photo, setPhoto] = useState(null);
  const [mood, setMood] = useState("Excited & Emotive");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [title, setTitle] = useState("");
  const fileRef = useRef();
  const moods = ["Excited & Emotive", "Warm & Welcoming", "Calm & Professional"];

  const generate = async () => {
    if (!script.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Generate a short avatar video title (max 6 words) based on this script and mood. Respond with ONLY the title.\nScript: ${script}\nMood: ${mood}`
          }]
        })
      });
      const data = await res.json();
      setTitle(data.content?.[0]?.text || "Avatar Video");
    } catch {
      setTitle("My Avatar Video");
    }
    setLoading(false);
    setDone(true);
  };

  if (done) return <VideoResult title={title} onReset={() => { setDone(false); setScript(""); setPhoto(null); }} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <label style={labelStyle}>Upload Your Photo</label>
        <div
          onClick={() => fileRef.current.click()}
          style={{
            border: "2px dashed #ffffff20",
            borderRadius: 16,
            padding: "32px",
            textAlign: "center",
            cursor: "pointer",
            background: photo ? "#00d4ff08" : "transparent",
          }}
        >
          {photo ? (
            <div>
              <div style={{ fontSize: 36 }}>✅</div>
              <p style={{ color: "#00d4ff", fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginTop: 8 }}>{photo.name}</p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 36 }}>📸</div>
              <p style={{ color: "#8888aa", fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginTop: 8 }}>Tap to upload photo</p>
              <p style={{ color: "#ffffff30", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>JPG, PNG • Max 10MB</p>
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => setPhoto(e.target.files[0])} />
      </div>

      <div>
        <label style={labelStyle}>Avatar Script</label>
        <textarea
          value={script}
          onChange={e => setScript(e.target.value)}
          rows={4}
          placeholder="Type what your avatar will say..."
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Avatar Mood</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {moods.map(m => (
            <button key={m} onClick={() => setMood(m)} style={{
              background: mood === m ? "#00d4ff15" : "transparent",
              border: `1px solid ${mood === m ? "#00d4ff" : "#ffffff15"}`,
              borderRadius: 10,
              padding: "11px 16px",
              color: mood === m ? "#00d4ff" : "#8888aa",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              cursor: "pointer",
              textAlign: "left",
            }}>{m}</button>
          ))}
        </div>
      </div>

      {loading ? <Spinner /> : (
        <button onClick={generate} disabled={!script.trim()} style={{
          ...primaryBtn,
          opacity: script.trim() ? 1 : 0.4,
          width: "100%",
          padding: "16px",
          fontSize: 15,
        }}>🎭 Create Avatar Video</button>
      )}
    </div>
  );
}

function Translate() {
  const [url, setUrl] = useState("");
  const [lang, setLang] = useState("Spanish");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [title, setTitle] = useState("");

  const translate = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Create a fun short title (max 6 words) for a video translated to ${lang}. Respond with ONLY the title, no quotes.`
          }]
        })
      });
      const data = await res.json();
      setTitle(data.content?.[0]?.text || `Translated to ${lang}`);
    } catch {
      setTitle(`Translated to ${lang}`);
    }
    setLoading(false);
    setDone(true);
  };

  if (done) return <VideoResult title={title} onReset={() => { setDone(false); setUrl(""); }} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{
        background: "linear-gradient(135deg, #00d4ff08, #0066ff08)",
        border: "1px solid #00d4ff22",
        borderRadius: 14,
        padding: 16,
        textAlign: "center"
      }}>
        <p style={{ color: "#00d4ff", fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>175+ Languages</p>
        <p style={{ color: "#8888aa", fontFamily: "'DM Sans', sans-serif", fontSize: 13, margin: 0 }}>AI lip-sync & voice matching included</p>
      </div>

      <div>
        <label style={labelStyle}>Video URL or Upload</label>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Paste YouTube link or video URL..."
          style={{ ...inputStyle, resize: undefined }}
        />
      </div>

      <div>
        <label style={labelStyle}>Target Language</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {LANGUAGES.map(l => (
            <button key={l} onClick={() => setLang(l)} style={{
              background: lang === l ? "#00d4ff15" : "#0d0d1a",
              border: `1px solid ${lang === l ? "#00d4ff" : "#ffffff15"}`,
              borderRadius: 10,
              padding: "10px",
              color: lang === l ? "#00d4ff" : "#ccc",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              cursor: "pointer",
            }}>{l}</button>
          ))}
        </div>
      </div>

      {loading ? <Spinner /> : (
        <button onClick={translate} disabled={!url.trim()} style={{
          ...primaryBtn,
          opacity: url.trim() ? 1 : 0.4,
          width: "100%",
          padding: "16px",
          fontSize: 15,
        }}>🌍 Translate Video</button>
      )}
    </div>
  );
}

function Shortcuts() {
  const [selected, setSelected] = useState(null);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [title, setTitle] = useState("");

  const generate = async () => {
    if (!selected || !topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Generate a short punchy video title (max 7 words) for a ${selected.label} about: "${topic}". Respond with ONLY the title.`
          }]
        })
      });
      const data = await res.json();
      setTitle(data.content?.[0]?.text || `${selected.label}: ${topic}`);
    } catch {
      setTitle(`${selected.label}: ${topic}`);
    }
    setLoading(false);
    setDone(true);
  };

  if (done) return <VideoResult title={title} onReset={() => { setDone(false); setSelected(null); setTopic(""); }} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <label style={labelStyle}>Video Format</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {SHORTCUTS.map(s => (
            <button key={s.label} onClick={() => setSelected(s)} style={{
              background: selected?.label === s.label ? `${s.color}18` : "#0d0d1a",
              border: `1px solid ${selected?.label === s.label ? s.color : "#ffffff15"}`,
              borderRadius: 14,
              padding: "16px 12px",
              cursor: "pointer",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ color: selected?.label === s.label ? s.color : "#ccc", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>{s.label}</div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div>
          <label style={labelStyle}>Topic / Product</label>
          <input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder={`What is your ${selected.label} about?`}
            style={{ ...inputStyle, resize: undefined }}
          />
        </div>
      )}

      {loading ? <Spinner /> : (
        <button onClick={generate} disabled={!selected || !topic.trim()} style={{
          ...primaryBtn,
          opacity: selected && topic.trim() ? 1 : 0.4,
          width: "100%",
          padding: "16px",
          fontSize: 15,
        }}>⚡ Generate in 1-Tap</button>
      )}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState(0);

  const panels = [<TextToVideo />, <AvatarMaker />, <Translate />, <Shortcuts />];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #070714; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d0d1a; }
        ::-webkit-scrollbar-thumb { background: #00d4ff33; border-radius: 4px; }
      `}</style>
      <div style={{
        minHeight: "100vh",
        background: "#070714",
        color: "#fff",
        fontFamily: "'DM Sans', sans-serif",
        maxWidth: 480,
        margin: "0 auto",
        padding: "0 0 40px",
      }}>
        {/* Header */}
        <div style={{
          padding: "24px 20px 0",
          background: "linear-gradient(180deg, #0d0d2a 0%, transparent 100%)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(20px)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 22 }}>🎬</span>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: -0.5 }}>
                  <span style={{ color: "#fff" }}>AI</span>
                  <span style={{ color: "#00d4ff" }}>Studio</span>
                </span>
              </div>
              <p style={{ color: "#8888aa", fontSize: 12, marginTop: 2, fontFamily: "'DM Sans', sans-serif" }}>Create · Translate · Publish</p>
            </div>
            <div style={{
              background: "linear-gradient(135deg, #00d4ff20, #0066ff20)",
              border: "1px solid #00d4ff33",
              borderRadius: 20,
              padding: "6px 14px",
              color: "#00d4ff",
              fontSize: 12,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              letterSpacing: 1,
            }}>FREE</div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 1 }}>
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setActiveTab(i)} style={{
                background: activeTab === i ? "linear-gradient(135deg, #00d4ff, #0066ff)" : "transparent",
                border: "none",
                borderRadius: 20,
                padding: "8px 14px",
                color: activeTab === i ? "#fff" : "#8888aa",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}>{t}</button>
            ))}
          </div>
          <div style={{ height: 1, background: "#ffffff0a", marginTop: 12 }} />
        </div>

        {/* Content */}
        <div style={{ padding: "24px 20px", animation: "fadeUp 0.3s ease" }} key={activeTab}>
          {panels[activeTab]}
        </div>

        {/* Stats bar */}
        <div style={{
          margin: "0 20px",
          background: "#0d0d1a",
          border: "1px solid #ffffff08",
          borderRadius: 16,
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-around",
        }}>
          {[["175+", "Languages"], ["4K", "Resolution"], ["∞", "Avatars"]].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#00d4ff" }}>{val}</div>
              <div style={{ fontSize: 11, color: "#8888aa", marginTop: 2 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
