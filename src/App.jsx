import { useState, useEffect, useRef } from "react";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzujd77jWOyKCoWHRrs5alb90ndlddA5kLs-VnarIQx_0uvLRMCY3w5xH7fhU6BUMBrCg/exec";

// Particle system for background
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2,
    }));
    let animId;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 80, ${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.6,
      }}
    />
  );
}

// Animated Om symbol
function OmSymbol({ size = 48, color = "#ffd700" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <text
        x="50"
        y="72"
        textAnchor="middle"
        fontSize="72"
        fontFamily="serif"
        fill={color}
        style={{ filter: "drop-shadow(0 0 8px #ffd700aa)" }}
      >
        ॐ
      </text>
    </svg>
  );
}

// Toast notification
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      style={{
        position: "fixed",
        top: 32,
        right: 32,
        zIndex: 9999,
        background:
          type === "success"
            ? "linear-gradient(135deg,#22c55e,#16a34a)"
            : "linear-gradient(135deg,#ef4444,#dc2626)",
        color: "#fff",
        padding: "14px 28px",
        borderRadius: 14,
        fontFamily: "'Playfair Display', serif",
        fontSize: 16,
        boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        animation: "slideIn 0.4s cubic-bezier(.22,1,.36,1)",
      }}
    >
      <span style={{ fontSize: 22 }}>{type === "success" ? "✅" : "❌"}</span>
      {message}
    </div>
  );
}

// Donor card component
function DonorCard({ donor, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "linear-gradient(135deg,rgba(255,200,60,0.18),rgba(180,90,20,0.22))"
          : "linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))",
        border: hovered ? "1.5px solid #ffd70066" : "1.5px solid rgba(255,255,255,0.1)",
        borderRadius: 18,
        padding: "20px 24px",
        cursor: "default",
        transition: "all 0.3s cubic-bezier(.22,1,.36,1)",
        transform: hovered ? "translateY(-4px) scale(1.02)" : "none",
        boxShadow: hovered
          ? "0 16px 40px rgba(255,180,0,0.15), 0 2px 8px rgba(0,0,0,0.2)"
          : "0 4px 16px rgba(0,0,0,0.15)",
        backdropFilter: "blur(12px)",
        animation: `fadeSlide 0.5s ease ${index * 0.07}s both`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg,transparent,#ffd700,transparent)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18,
              fontWeight: 700,
              color: "#ffd700",
              marginBottom: 6,
              textShadow: "0 0 12px rgba(255,215,0,0.3)",
            }}
          >
            🙏 {donor.Name}
          </div>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.7 }}>
            <div>📍 {donor.Address}</div>
            <div>📞 {donor.Contact}</div>
          </div>
        </div>
        <div
          style={{
            background: "linear-gradient(135deg,#ffd700,#f59e0b)",
            color: "#1a0a00",
            padding: "8px 16px",
            borderRadius: 12,
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
            fontSize: 17,
            boxShadow: "0 4px 16px rgba(255,180,0,0.35)",
            whiteSpace: "nowrap",
          }}
        >
          ₹{Number(donor.Amount).toLocaleString("en-IN")}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState({ Name: "", Amount: "", Address: "", Contact: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [donors, setDonors] = useState([]);
  const [fetchingDonors, setFetchingDonors] = useState(false);
  const [activeTab, setActiveTab] = useState("donate");
  const [totalFunds, setTotalFunds] = useState(0);
  const [scene3DPhase, setScene3DPhase] = useState(0);

  // 3D phase animation cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setScene3DPhase((p) => (p + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchDonors = async () => {
    setFetchingDonors(true);
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL);
      const data = await res.json();
      if (data && Array.isArray(data.data)) {
        setDonors(data.data);
        const total = data.data.reduce((sum, d) => sum + (Number(d.Amount) || 0), 0);
        setTotalFunds(total);
      }
    } catch {
      setToast({ message: "Could not fetch donors list.", type: "error" });
    } finally {
      setFetchingDonors(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.Name.trim()) e.Name = "Name is required";
    if (!form.Amount || isNaN(form.Amount) || Number(form.Amount) <= 0)
      e.Amount = "Enter a valid amount";
    if (!form.Address.trim()) e.Address = "Address is required";
    if (!form.Contact.trim() || !/^\d{10}$/.test(form.Contact.trim()))
      e.Contact = "Enter valid 10-digit contact";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const params = new URLSearchParams(form);
      await fetch(`${GOOGLE_SCRIPT_URL}?${params}`, { method: "GET", mode: "no-cors" });
      setToast({ message: "Donation submitted! Jai Shree Shyam 🙏", type: "success" });
      setForm({ Name: "", Amount: "", Address: "", Contact: "" });
      setTimeout(fetchDonors, 1500);
    } catch {
      setToast({ message: "Submission failed. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: errors[field]
      ? "1.5px solid #ef4444"
      : "1.5px solid rgba(255,215,0,0.25)",
    borderRadius: 12,
    padding: "13px 16px",
    color: "#fff",
    fontSize: 15,
    fontFamily: "'Lora', serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.25s",
    backdropFilter: "blur(8px)",
  });

  const labelStyle = {
    display: "block",
    color: "rgba(255,215,0,0.85)",
    fontFamily: "'Playfair Display', serif",
    fontSize: 13,
    letterSpacing: "0.06em",
    marginBottom: 6,
    textTransform: "uppercase",
  };

  // 3D rotating temple visuals
  const templeRotations = [
    "rotateY(0deg) rotateX(5deg)",
    "rotateY(8deg) rotateX(3deg)",
    "rotateY(0deg) rotateX(-3deg)",
    "rotateY(-8deg) rotateX(5deg)",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg,#0d0500 0%,#1a0a02 40%,#0f0800 70%,#000 100%)",
        fontFamily: "'Lora', serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

        * { box-sizing: border-box; }
        body { margin: 0; }

        @keyframes fadeSlide {
          from { opacity:0; transform:translateY(20px); }
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes slideIn {
          from { opacity:0; transform:translateX(60px); }
          to { opacity:1; transform:translateX(0); }
        }
        @keyframes floatDiya {
          0%,100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes flamePulse {
          0%,100% { transform: scaleY(1) scaleX(1); opacity:1; }
          50% { transform: scaleY(1.25) scaleX(0.85); opacity:0.8; }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes glowPulse {
          0%,100% { text-shadow: 0 0 20px #ffd70066, 0 0 40px #ffd70033; }
          50% { text-shadow: 0 0 40px #ffd700aa, 0 0 80px #ffd70066, 0 0 120px #ffd70033; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes counter {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }

        input::placeholder { color: rgba(255,255,255,0.3); }
        input:focus { border-color: rgba(255,215,0,0.6) !important; box-shadow: 0 0 0 3px rgba(255,215,0,0.08); background: rgba(255,255,255,0.09) !important; }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background: rgba(255,215,0,0.3); border-radius: 99px; }

        .tab-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }
        .tab-btn:hover { opacity: 0.85; }
      `}</style>

      <Particles />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Radial glow backgrounds */}
      <div style={{
        position: "fixed", top: "10%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(255,160,0,0.08) 0%,transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: 0, right: 0,
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(200,80,0,0.06) 0%,transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "0 20px 60px" }}>

        {/* HERO HEADER */}
        <div style={{ textAlign: "center", paddingTop: 52, paddingBottom: 32 }}>
          
          {/* 3D Temple illustration */}
          <div style={{
            perspective: "800px",
            width: 180, height: 180,
            margin: "0 auto 20px",
            animation: "floatDiya 5s ease-in-out infinite",
          }}>
            <div style={{
              width: "100%", height: "100%",
              transform: templeRotations[scene3DPhase],
              transition: "transform 1.5s cubic-bezier(.22,1,.36,1)",
              transformStyle: "preserve-3d",
            }}>
              <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Temple base */}
                <rect x="30" y="130" width="120" height="30" rx="4" fill="#8B4513" opacity="0.9"/>
                <rect x="40" y="110" width="100" height="24" rx="3" fill="#A0522D" opacity="0.9"/>
                {/* Temple columns */}
                <rect x="48" y="80" width="14" height="34" rx="2" fill="#CD853F"/>
                <rect x="118" y="80" width="14" height="34" rx="2" fill="#CD853F"/>
                {/* Temple body */}
                <rect x="55" y="75" width="70" height="10" rx="2" fill="#DAA520"/>
                {/* Shikhara tiers */}
                <polygon points="90,15 130,75 50,75" fill="#B8860B"/>
                <polygon points="90,28 122,72 58,72" fill="#DAA520"/>
                <polygon points="90,40 115,70 65,70" fill="#FFD700"/>
                {/* Kalash */}
                <ellipse cx="90" cy="17" rx="7" ry="5" fill="#FFD700"/>
                <rect x="88" y="8" width="4" height="10" fill="#FFD700"/>
                <circle cx="90" cy="7" r="5" fill="#FF8C00"/>
                {/* Flame on kalash */}
                <ellipse cx="90" cy="4" rx="3" ry="5" fill="#FF4500" opacity="0.9" style={{animation:"flamePulse 1.2s ease-in-out infinite"}}/>
                <ellipse cx="90" cy="3" rx="2" ry="3.5" fill="#FFA500" style={{animation:"flamePulse 0.9s ease-in-out infinite"}}/>
                <ellipse cx="90" cy="2" rx="1" ry="2" fill="#FFFF00" style={{animation:"flamePulse 0.7s ease-in-out infinite"}}/>
                {/* Door */}
                <rect x="79" y="98" width="22" height="36" rx="11" fill="#4A2800"/>
                <rect x="81" y="100" width="18" height="33" rx="9" fill="#2D1600"/>
                {/* Glow behind temple */}
                <ellipse cx="90" cy="155" rx="55" ry="8" fill="#FF8C00" opacity="0.15"/>
              </svg>
            </div>
          </div>

          {/* Decorative line */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: "linear-gradient(90deg,transparent,#ffd70055)" }} />
            <OmSymbol size={38} />
            <div style={{ flex: 1, maxWidth: 120, height: 1, background: "linear-gradient(90deg,#ffd70055,transparent)" }} />
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 6vw, 48px)",
            fontWeight: 900,
            color: "#ffd700",
            margin: "0 0 6px",
            letterSpacing: "0.04em",
            animation: "glowPulse 3s ease-in-out infinite",
            lineHeight: 1.2,
          }}>
            Shree Shyam Baba
          </h1>
          <p style={{
            fontFamily: "'Lora', serif",
            fontStyle: "italic",
            color: "rgba(255,200,100,0.75)",
            margin: "0 0 6px",
            fontSize: 16,
            letterSpacing: "0.05em",
          }}>
            सेवा • भक्ति • समर्पण
          </p>
          <p style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 13,
            fontFamily: "'Lora', serif",
            margin: 0,
          }}>
            Fund Collection Portal — श्याम बाबा की कृपा सदा बनी रहे
          </p>

          {/* Total Fund Counter */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            background: "linear-gradient(135deg,rgba(255,180,0,0.12),rgba(180,80,0,0.15))",
            border: "1px solid rgba(255,215,0,0.25)",
            borderRadius: 999,
            padding: "10px 28px",
            marginTop: 24,
            backdropFilter: "blur(16px)",
            boxShadow: "0 4px 24px rgba(255,160,0,0.15)",
            animation: "counter 0.6s ease 0.3s both",
          }}>
            <span style={{ fontSize: 20 }}>🪔</span>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              color: "#ffd700",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: "0.04em",
            }}>
              Total Seva: ₹{totalFunds.toLocaleString("en-IN")}
            </span>
            <span style={{ fontSize: 20 }}>🪔</span>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div style={{
          display: "flex",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,215,0,0.15)",
          borderRadius: 16,
          padding: 5,
          marginBottom: 32,
          backdropFilter: "blur(12px)",
          gap: 4,
        }}>
          {[
            { key: "donate", label: "🙏 Donate Seva", },
            { key: "donors", label: "📜 Donor List", },
          ].map((tab) => (
            <button
              key={tab.key}
              className="tab-btn"
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                padding: "12px 20px",
                borderRadius: 12,
                fontFamily: "'Playfair Display', serif",
                fontSize: 15,
                fontWeight: activeTab === tab.key ? 700 : 400,
                color: activeTab === tab.key ? "#1a0a00" : "rgba(255,215,0,0.65)",
                background: activeTab === tab.key
                  ? "linear-gradient(135deg,#ffd700,#f59e0b)"
                  : "transparent",
                boxShadow: activeTab === tab.key
                  ? "0 4px 20px rgba(255,180,0,0.35)"
                  : "none",
                letterSpacing: "0.03em",
                transition: "all 0.3s cubic-bezier(.22,1,.36,1)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* DONATE FORM */}
        {activeTab === "donate" && (
          <div style={{
            background: "linear-gradient(145deg,rgba(255,255,255,0.07) 0%,rgba(255,255,255,0.03) 100%)",
            border: "1.5px solid rgba(255,215,0,0.18)",
            borderRadius: 24,
            padding: "clamp(24px,5vw,48px)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
            animation: "fadeSlide 0.5s ease both",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Top decorative glow line */}
            <div style={{
              position: "absolute", top: 0, left: "10%", right: "10%", height: 2,
              background: "linear-gradient(90deg,transparent,#ffd700,transparent)",
              borderRadius: 2,
            }} />

            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                color: "#ffd700",
                fontSize: 24,
                fontWeight: 700,
                margin: "0 0 8px",
              }}>
                Make Your Offering
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0, fontStyle: "italic" }}>
                आपकी सेवा बाबा श्याम तक अवश्य पहुंचेगी
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                {/* Name */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Full Name / पूरा नाम</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={form.Name}
                    onChange={(e) => setForm({ ...form, Name: e.target.value })}
                    style={inputStyle("Name")}
                  />
                  {errors.Name && (
                    <span style={{ color: "#f87171", fontSize: 12, marginTop: 4, display: "block" }}>
                      ⚠ {errors.Name}
                    </span>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label style={labelStyle}>Amount (₹) / राशि</label>
                  <div style={{ position: "relative" }}>
                    <span style={{
                      position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                      color: "#ffd700", fontSize: 17, fontWeight: 700,
                    }}>₹</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={form.Amount}
                      onChange={(e) => setForm({ ...form, Amount: e.target.value })}
                      style={{ ...inputStyle("Amount"), paddingLeft: 32 }}
                    />
                  </div>
                  {errors.Amount && (
                    <span style={{ color: "#f87171", fontSize: 12, marginTop: 4, display: "block" }}>
                      ⚠ {errors.Amount}
                    </span>
                  )}
                  {/* Quick amount buttons */}
                  <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    {[101, 251, 501, 1001, 2100, 5100].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setForm({ ...form, Amount: String(amt) })}
                        style={{
                          background: form.Amount === String(amt)
                            ? "linear-gradient(135deg,#ffd700,#f59e0b)"
                            : "rgba(255,215,0,0.08)",
                          border: "1px solid rgba(255,215,0,0.25)",
                          color: form.Amount === String(amt) ? "#1a0a00" : "#ffd700",
                          borderRadius: 8,
                          padding: "4px 10px",
                          fontSize: 12,
                          fontFamily: "'Lora', serif",
                          fontWeight: form.Amount === String(amt) ? 700 : 400,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <label style={labelStyle}>Contact / संपर्क</label>
                  <div style={{ position: "relative" }}>
                    <span style={{
                      position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                      color: "rgba(255,255,255,0.4)", fontSize: 15,
                    }}>📞</span>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={form.Contact}
                      onChange={(e) => setForm({ ...form, Contact: e.target.value })}
                      style={{ ...inputStyle("Contact"), paddingLeft: 38 }}
                      maxLength={10}
                    />
                  </div>
                  {errors.Contact && (
                    <span style={{ color: "#f87171", fontSize: 12, marginTop: 4, display: "block" }}>
                      ⚠ {errors.Contact}
                    </span>
                  )}
                </div>

                {/* Address */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Address / पता</label>
                  <input
                    type="text"
                    placeholder="Village / City, District, State"
                    value={form.Address}
                    onChange={(e) => setForm({ ...form, Address: e.target.value })}
                    style={inputStyle("Address")}
                  />
                  {errors.Address && (
                    <span style={{ color: "#f87171", fontSize: 12, marginTop: 4, display: "block" }}>
                      ⚠ {errors.Address}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  marginTop: 28,
                  padding: "16px",
                  background: loading
                    ? "rgba(255,215,0,0.25)"
                    : "linear-gradient(135deg,#ffd700 0%,#f59e0b 50%,#d97706 100%)",
                  border: "none",
                  borderRadius: 14,
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 17,
                  fontWeight: 700,
                  color: loading ? "rgba(255,215,0,0.5)" : "#1a0a00",
                  cursor: loading ? "not-allowed" : "pointer",
                  letterSpacing: "0.06em",
                  boxShadow: loading ? "none" : "0 8px 32px rgba(255,160,0,0.4), 0 2px 8px rgba(0,0,0,0.2)",
                  transition: "all 0.3s cubic-bezier(.22,1,.36,1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  transform: loading ? "none" : "translateY(0)",
                  backgroundSize: "200% auto",
                  animation: loading ? "none" : "shimmer 2.5s linear infinite",
                  backgroundPosition: "center",
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 18, height: 18, border: "2px solid rgba(255,215,0,0.3)",
                      borderTopColor: "#ffd700", borderRadius: "50%",
                      animation: "spinSlow 0.7s linear infinite", display: "inline-block",
                    }} />
                    Submitting Seva...
                  </>
                ) : (
                  <>🙏 Submit Seva — जय श्री श्याम</>
                )}
              </button>
            </form>

            {/* Bottom decoration */}
            <div style={{ textAlign: "center", marginTop: 24, color: "rgba(255,255,255,0.3)", fontSize: 12, letterSpacing: "0.1em" }}>
              ✦ &nbsp; हर हर महादेव &nbsp; ✦ &nbsp; जय श्री श्याम &nbsp; ✦
            </div>
          </div>
        )}

        {/* DONORS LIST */}
        {activeTab === "donors" && (
          <div style={{ animation: "fadeSlide 0.5s ease both" }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 24,
            }}>
              <div>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#ffd700", fontSize: 22, fontWeight: 700, margin: "0 0 4px",
                }}>
                  Our Blessed Donors
                </h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>
                  {donors.length} devotees have contributed
                </p>
              </div>
              <button
                onClick={fetchDonors}
                disabled={fetchingDonors}
                style={{
                  background: "rgba(255,215,0,0.1)",
                  border: "1px solid rgba(255,215,0,0.3)",
                  color: "#ffd700",
                  borderRadius: 10,
                  padding: "8px 16px",
                  fontFamily: "'Lora', serif",
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                  transition: "all 0.2s",
                }}
              >
                <span style={{ animation: fetchingDonors ? "spinSlow 0.7s linear infinite" : "none", display: "inline-block" }}>
                  🔄
                </span>
                Refresh
              </button>
            </div>

            {fetchingDonors ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,215,0,0.5)" }}>
                <div style={{
                  width: 40, height: 40, border: "3px solid rgba(255,215,0,0.15)",
                  borderTopColor: "#ffd700", borderRadius: "50%",
                  animation: "spinSlow 0.8s linear infinite",
                  margin: "0 auto 16px",
                }} />
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16 }}>
                  Loading devotees...
                </p>
              </div>
            ) : donors.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.35)" }}>
                <OmSymbol size={56} color="rgba(255,215,0,0.3)" />
                <p style={{ fontFamily: "'Playfair Display', serif", marginTop: 16 }}>
                  No entries yet. Be the first donor!
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {donors.map((donor, i) => (
                  <DonorCard key={i} donor={donor} index={i} />
                ))}
              </div>
            )}

            {/* Summary */}
            {donors.length > 0 && (
              <div style={{
                marginTop: 28,
                background: "linear-gradient(135deg,rgba(255,180,0,0.12),rgba(180,60,0,0.15))",
                border: "1.5px solid rgba(255,215,0,0.25)",
                borderRadius: 18,
                padding: "20px 28px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backdropFilter: "blur(12px)",
              }}>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 4, fontStyle: "italic" }}>
                    Total Collected
                  </div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 28,
                    fontWeight: 900,
                    color: "#ffd700",
                    textShadow: "0 0 20px rgba(255,215,0,0.4)",
                  }}>
                    ₹{totalFunds.toLocaleString("en-IN")}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 4, fontStyle: "italic" }}>
                    Donors
                  </div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 28,
                    fontWeight: 900,
                    color: "#f59e0b",
                  }}>
                    {donors.length}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FOOTER */}
        <div style={{ textAlign: "center", marginTop: 52, color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 12, opacity: 0.5 }}>
            {["🪔", "🌸", "ॐ", "🌸", "🪔"].map((s, i) => (
              <span key={i} style={{ fontSize: 16 }}>{s}</span>
            ))}
          </div>
          <p style={{ margin: "0 0 4px", letterSpacing: "0.08em" }}>
            SHREE SHYAM BABA SEVA SAMITI
          </p>
          <p style={{ margin: 0, fontStyle: "italic" }}>
            जो मांगोगे वो मिलेगा, बस श्याम बाबा पे विश्वास रखो
          </p>
        </div>

      </div>
    </div>
  );
}
