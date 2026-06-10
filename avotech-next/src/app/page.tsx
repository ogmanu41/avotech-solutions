"use client"

import { useState, useEffect, useCallback } from "react"
import { submitContactForm } from "./actions"

// ─── Real content only — no fabricated stats, no fake testimonials ───────────

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
]

// Real Unsplash food processing / industry photos — free to use
const HERO_SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1600&q=80",
    alt: "Fruit processing and packaging facility",
    caption: "Fruit Processing",
  },
  {
    url: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=1600&q=80",
    alt: "Commercial dairy processing plant",
    caption: "Dairy Processing",
  },
  {
    url: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1600&q=80",
    alt: "Industrial grain milling and flour production",
    caption: "Grain Milling",
  },
  {
    url: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1600&q=80",
    alt: "Modern food factory production line",
    caption: "Factory Setup",
  },
  {
    url: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=1600&q=80",
    alt: "Agricultural supply chain and farm linkage",
    caption: "Farm Linkage",
  },
]

const SERVICES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20"/>
        <path d="M5 17V7l4 4V7l4 4V7l4 4h3v10H5z"/>
      </svg>
    ),
    title: "Industry Setup",
    desc: "Complete factory setup and infrastructure planning from site selection to commissioning.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
    title: "Machinery Sourcing",
    desc: "Professional equipment procurement with quality assurance and optimal pricing.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
    title: "Market Linkages",
    desc: "Strategic connections with suppliers, distributors, and end-market customers.",
  },
  {
    icon: "📋",
    title: "Project Management",
    desc: "End-to-end project oversight ensuring timely delivery and budget compliance.",
  },
  {
    icon: "🎓",
    title: "Training & Support",
    desc: "Staff training, technical documentation, and ongoing operational support.",
  },
  {
    icon: "📊",
    title: "Business Consulting",
    desc: "Market analysis, feasibility studies, and business planning services.",
  },
  {
    icon: "📄",
    title: "Compliance & Licensing",
    desc: "Assistance with regulatory compliance and industry certifications.",
  },
  {
    icon: "🤝",
    title: "Financing Support",
    desc: "Guidance on funding options, loans, and investor connections.",
  },
]

// Portfolio uses descriptive Unsplash photos — not claimed as actual Avotech projects
const PORTFOLIO = [
  {
    img: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80",
    title: "Fruit Processing Plant",
    desc: "State-of-the-art facility producing juice, jams, and dried fruits.",
  },
  {
    img: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=600&q=80",
    title: "Dairy Processing Unit",
    desc: "Modern dairy facility with pasteurization and packaging systems.",
  },
  {
    img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=600&q=80",
    title: "Industrial Bakery",
    desc: "Commercial bakery with advanced ovens and automated packaging.",
  },
]

const FAQS = [
  {
    q: "How long does a typical project take?",
    a: "Most projects take 6–12 months depending on scale and complexity. We provide a detailed timeline during the consultation phase.",
  },
  {
    q: "What is your investment range?",
    a: "Projects range from small-scale operations (KES 500K – 2M) to large industrial plants (KES 50M+). We customize solutions to fit your budget.",
  },
  {
    q: "Do you provide post-launch support?",
    a: "Yes. We provide 12 months of operational support including staff training, troubleshooting, and optimization guidance.",
  },
  {
    q: "Which regions do you operate in?",
    a: "We primarily operate in Kenya but have experience with projects in East Africa. Contact us for region-specific inquiries.",
  },
  {
    q: "What makes you different from competitors?",
    a: "We offer end-to-end solutions with dedicated project managers, genuine commitment to client success, and transparent communication at every stage.",
  },
]

// ─── Hero Slider ─────────────────────────────────────────────────────────────

function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const goTo = useCallback(
    (index: number) => {
      if (transitioning) return
      setTransitioning(true)
      setTimeout(() => {
        setCurrent(index)
        setTransitioning(false)
      }, 300)
    },
    [transitioning]
  )

  const next = useCallback(() => {
    goTo((current + 1) % HERO_SLIDES.length)
  }, [current, goTo])

  useEffect(() => {
    const interval = setInterval(next, 5000)
    return () => clearInterval(interval)
  }, [next])

  const slide = HERO_SLIDES[current]

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: 8 }}>
      {/* Image */}
      <img
        key={current}
        src={slide.url}
        alt={slide.alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: transitioning ? 0 : 1,
          transition: "opacity 0.4s ease",
          display: "block",
        }}
      />

      {/* Caption */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          background: "rgba(0,0,0,0.55)",
          color: "#fff",
          fontSize: 12,
          fontWeight: 600,
          padding: "4px 10px",
          borderRadius: 4,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {slide.caption}
      </div>

      {/* Dot navigation */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          display: "flex",
          gap: 6,
        }}
      >
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === current ? 20 : 8,
              height: 8,
              borderRadius: 4,
              background: i === current ? "#C09E5A" : "rgba(255,255,255,0.5)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={() => goTo((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
        aria-label="Previous slide"
        style={{
          position: "absolute",
          top: "50%",
          left: 12,
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.4)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 36,
          height: 36,
          cursor: "pointer",
          fontSize: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ‹
      </button>
      <button
        onClick={() => next()}
        aria-label="Next slide"
        style={{
          position: "absolute",
          top: "50%",
          right: 12,
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.4)",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 36,
          height: 36,
          cursor: "pointer",
          fontSize: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ›
      </button>
    </div>
  )
}

// ─── Accordion ───────────────────────────────────────────────────────────────

function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            background: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%",
              textAlign: "left",
              background: "none",
              border: "none",
              padding: "16px 20px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 15,
              fontWeight: 600,
              color: "#1E293B",
            }}
          >
            {item.q}
            <span style={{ fontSize: 18, color: "#94A3B8", flexShrink: 0, marginLeft: 12 }}>
              {open === i ? "−" : "+"}
            </span>
          </button>
          {open === i && (
            <div
              style={{
                padding: "0 20px 16px",
                fontSize: 14,
                color: "#64748B",
                lineHeight: 1.7,
              }}
            >
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormState("sending")
    setFormError(null)

    const formData = new FormData(e.currentTarget)
    try {
      const result = await submitContactForm(null, formData)
      if (result.success) {
        setFormState("sent")
      } else {
        setFormState("error")
        setFormError(result.error || "An error occurred during submission.")
      }
    } catch (err) {
      setFormState("error")
      setFormError("Could not connect to the form server.")
    }
  }

  return (
    <>
      {/* ── Global Styles ── */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1E293B; background: #fff; }
        a { text-decoration: none; color: inherit; }

        .nav-link {
          color: rgba(255,255,255,0.8);
          font-size: 14px;
          font-weight: 500;
          padding: 6px 0;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #C09E5A; }

        .btn-primary {
          background: #C09E5A;
          color: #0F1B2D;
          border: none;
          border-radius: 6px;
          padding: 12px 28px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          display: inline-block;
        }
        .btn-primary:hover { background: #b08e4f; transform: translateY(-1px); }

        .btn-outline {
          background: transparent;
          color: #fff;
          border: 2px solid rgba(255,255,255,0.5);
          border-radius: 6px;
          padding: 10px 28px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
          display: inline-block;
        }
        .btn-outline:hover { border-color: #C09E5A; color: #C09E5A; }

        .section-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #C09E5A;
          margin-bottom: 12px;
        }

        .section-title {
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 800;
          color: #0F172A;
          line-height: 1.2;
          margin-bottom: 16px;
        }

        .section-subtitle {
          font-size: 17px;
          color: #64748B;
          line-height: 1.7;
          max-width: 540px;
        }

        .service-card {
          background: #fff;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 28px;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .service-card:hover {
          border-color: #C09E5A;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }

        .portfolio-card {
          border-radius: 12px;
          overflow: hidden;
          background: #fff;
          border: 1px solid #E2E8F0;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .portfolio-card:hover {
          box-shadow: 0 12px 32px rgba(0,0,0,0.1);
          transform: translateY(-3px);
        }
        .portfolio-img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          display: block;
          transition: transform 0.3s;
        }
        .portfolio-card:hover .portfolio-img { transform: scale(1.03); }

        .contact-card {
          background: #fff;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 28px;
          text-align: center;
        }
        .contact-icon {
          width: 52px;
          height: 52px;
          background: #FEF3C7;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          margin: 0 auto 16px;
        }

        .form-input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 14px;
          color: #1E293B;
          background: #fff;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus { border-color: #C09E5A; }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }

        @media (max-width: 900px) {
          .grid-2 { grid-template-columns: 1fr; }
          .grid-3 { grid-template-columns: 1fr 1fr; }
          .grid-4 { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .grid-3, .grid-4 { grid-template-columns: 1fr; }
          .hide-mobile { display: none !important; }
          .hero-buttons { flex-direction: column; gap: 12px; }
        }
      `}</style>

      {/* ── Navigation ── */}
      <nav
        id="navbar"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#1a1a1a",
          boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.3)" : "none",
          transition: "box-shadow 0.3s",
        }}
      >
        <div
          className="container"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}
        >
          {/* Logo — original style: icon + wordmark */}
          <a href="#home" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 24h16" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10 22V12l4 4V12l4 4V12l4 4h2v6H10z" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 20, letterSpacing: "-0.01em" }}>
              Avotech Solutions
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hide-mobile" style={{ display: "flex", gap: 32 }}>
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="nav-link">
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a href="#contact" className="btn-primary hide-mobile" style={{ fontSize: 13, padding: "8px 20px" }}>
            Get Free Consultation
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: 24,
              cursor: "pointer",
            }}
            className="show-mobile"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            style={{
              background: "#111",
              padding: "12px 24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="nav-link"
                style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <a href="#contact" className="btn-primary" style={{ marginTop: 12, textAlign: "center" }}>
              Get Free Consultation
            </a>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section
        id="home"
        style={{
          background: "linear-gradient(135deg, #111827 0%, #1F2937 100%)",
          padding: "80px 0",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container">
          <div className="grid-2" style={{ gap: 56 }}>
            {/* Left */}
            <div>
              <p className="section-label">Food Processing Industry Experts</p>
              <h1
                style={{
                  fontSize: "clamp(32px, 5vw, 52px)",
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1.1,
                  marginBottom: 20,
                  letterSpacing: "-0.02em",
                }}
              >
                Building Food Processing Industries{" "}
                <span style={{ color: "#C09E5A" }}>From Scratch</span>
              </h1>
              <p
                style={{
                  fontSize: 18,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.7,
                  marginBottom: 36,
                  maxWidth: 480,
                }}
              >
                From Idea to Market — Complete Industry Setup Solutions. We handle everything from site planning to
                factory commissioning.
              </p>
              <div className="hero-buttons" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <a href="#contact" className="btn-primary">
                  Get Free Consultation
                </a>
                <a href="#services" className="btn-outline">
                  Learn More
                </a>
              </div>
            </div>

            {/* Right — image slider */}
            <div style={{ height: 420, borderRadius: 12, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.4)" }}>
              <HeroSlider />
            </div>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" style={{ padding: "96px 0", background: "#fff" }}>
        <div className="container">
          <div className="grid-2">
            <div>
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=700&q=80"
                alt="Professional team in a food processing facility"
                style={{ width: "100%", borderRadius: 12, display: "block" }}
              />
            </div>
            <div>
              <p className="section-label">About Us</p>
              <h2 className="section-title">About Avotech Solutions</h2>
              <p className="section-subtitle" style={{ marginBottom: 20 }}>
                Avotech Solutions is a consultancy firm specializing in establishing successful food processing and
                value-addition industries. We transform business ideas into profitable ventures.
              </p>
              <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.7, marginBottom: 28 }}>
                Our comprehensive approach covers every aspect of industry establishment, from initial feasibility
                studies to post-launch support and continuous optimization.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  "End-to-end industry setup and commissioning",
                  "Global machinery sourcing and installation",
                  "Regulatory compliance and licensing support",
                  "Ongoing operational training and support",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        background: "#FEF3C7",
                        borderRadius: "50%",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        marginTop: 1,
                      }}
                    >
                      ✓
                    </span>
                    <span style={{ fontSize: 15, color: "#374151", fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" style={{ padding: "96px 0", background: "#F8FAFC" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p className="section-label">What We Do</p>
            <h2 className="section-title" style={{ margin: "0 auto 16px" }}>
              Our Services
            </h2>
            <p className="section-subtitle" style={{ margin: "0 auto", textAlign: "center" }}>
              Comprehensive solutions for your food processing industry setup
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {SERVICES.map((s) => (
              <div key={s.title} className="service-card">
                <div
                  style={{
                    marginBottom: 16,
                    width: 52,
                    height: 52,
                    background: "#EDE9FE",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {s.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portfolio ── */}
      <section id="portfolio" style={{ padding: "96px 0", background: "#fff" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p className="section-label">Our Work</p>
            <h2 className="section-title" style={{ margin: "0 auto 16px" }}>
              Types of Industries We Set Up
            </h2>
            <p className="section-subtitle" style={{ margin: "0 auto", textAlign: "center" }}>
              We have the expertise to set up processing facilities across a range of food sectors
            </p>
          </div>
          <div className="grid-3">
            {PORTFOLIO.map((p) => (
              <div key={p.title} className="portfolio-card">
                <div style={{ overflow: "hidden" }}>
                  <img src={p.img} alt={p.title} className="portfolio-img" />
                </div>
                <div style={{ padding: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section style={{ background: "#111827", padding: "80px 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(26px, 4vw, 38px)",
              fontWeight: 800,
              color: "#fff",
              marginBottom: 16,
              letterSpacing: "-0.02em",
            }}
          >
            Ready to Build Your Processing Industry?
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", marginBottom: 36, maxWidth: 520, margin: "0 auto 36px" }}>
            Talk to us today and get a free initial consultation on your food processing project.
          </p>
          <a href="#contact" className="btn-primary" style={{ fontSize: 16, padding: "14px 36px" }}>
            Get Free Consultation
          </a>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: "96px 0", background: "#F8FAFC" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p className="section-label">Questions & Answers</p>
            <h2 className="section-title" style={{ margin: "0 auto 16px" }}>
              Frequently Asked Questions
            </h2>
            <p className="section-subtitle" style={{ margin: "0 auto", textAlign: "center" }}>
              Find answers to common questions about our services
            </p>
          </div>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <Accordion items={FAQS} />
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" style={{ padding: "96px 0", background: "#fff" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p className="section-label">Get In Touch</p>
            <h2 className="section-title" style={{ margin: "0 auto 16px" }}>
              Contact Us
            </h2>
            <p className="section-subtitle" style={{ margin: "0 auto", textAlign: "center" }}>
              We are here to help you build your success story
            </p>
          </div>

          {/* Contact info cards */}
          <div className="grid-3" style={{ marginBottom: 48 }}>
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Phone</h4>
              <a
                href="tel:+254703178385"
                style={{ fontSize: 15, color: "#64748B", fontWeight: 500, textDecoration: "none" }}
              >
                +254 703 178 385
              </a>
            </div>
            <div className="contact-card">
              <div className="contact-icon">✉️</div>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Email</h4>
              <a
                href="mailto:avotechsolutions@yahoo.com"
                style={{ fontSize: 14, color: "#64748B", fontWeight: 500, wordBreak: "break-all" }}
              >
                avotechsolutions@yahoo.com
              </a>
            </div>
            <div className="contact-card">
              <div className="contact-icon">🕐</div>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Working Hours</h4>
              <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.6 }}>
                Mon–Fri & Sun
                <br />
                8:00 AM – 5:00 PM
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: 16,
                padding: "40px 40px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              }}
            >
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 28, color: "#0F172A" }}>
                Send Us Your Inquiry
              </h3>

              {formState === "sent" ? (
                <div
                  style={{
                    padding: 24,
                    background: "#F0FDF4",
                    border: "1px solid #BBF7D0",
                    borderRadius: 10,
                    textAlign: "center",
                  }}
                >
                  <p style={{ fontSize: 16, color: "#166534", fontWeight: 600 }}>
                    Thank you — your inquiry has been sent. We will be in touch shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {formState === "error" && (
                    <div
                      style={{
                        padding: 12,
                        background: "#FEE2E2",
                        border: "1px solid #FCA5A5",
                        borderRadius: 6,
                        color: "#DC2626",
                        fontSize: 14,
                        marginBottom: 16,
                      }}
                    >
                      {formError}
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <label className="form-label" htmlFor="fullName">
                        Full Name <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        className="form-input"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="email">
                        Email <span style={{ color: "#EF4444" }}>*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="form-input"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label className="form-label" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="form-input"
                      placeholder="+254..."
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label className="form-label" htmlFor="subject">
                      Subject <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      className="form-input"
                      placeholder="What is this about?"
                    />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label className="form-label" htmlFor="message">
                      Message <span style={{ color: "#EF4444" }}>*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      className="form-input"
                      placeholder="Tell us about your project..."
                      style={{ resize: "vertical" }}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: "100%", fontSize: 15 }} disabled={formState === "sending"}>
                    {formState === "sending" ? "Sending..." : "Send Inquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "#111827", color: "#fff", padding: "56px 0 32px" }}>
        <div className="container">
          <div className="grid-3" style={{ marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 24h16" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M10 22V12l4 4V12l4 4V12l4 4h2v6H10z" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontWeight: 800, fontSize: 20 }}>Avotech Solutions</span>
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 260 }}>
                Building food processing industries from concept to successful market operation.
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: "rgba(255,255,255,0.8)" }}>
                Quick Links
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["#services", "#portfolio", "#faq", "#contact"].map((href) => (
                  <a
                    key={href}
                    href={href}
                    style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#C09E5A")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >
                    {href.replace("#", "").replace("-", " ").replace(/^\w/, (c) => c.toUpperCase())}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 20, color: "rgba(255,255,255,0.8)" }}>
                Contact
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a
                  href="tel:+254703178385"
                  style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                >
                  +254 703 178 385
                </a>
                <a
                  href="mailto:avotechsolutions@yahoo.com"
                  style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                >
                  avotechsolutions@yahoo.com
                </a>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Mon–Fri & Sun, 8am–5pm</span>
              </div>
            </div>
          </div>
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              paddingTop: 28,
              textAlign: "center",
              fontSize: 13,
              color: "rgba(255,255,255,0.35)",
            }}
          >
            &copy; {new Date().getFullYear()} Avotech Solutions. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* ── Back to top ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          width: 44,
          height: 44,
          background: "#C09E5A",
          color: "#0F1B2D",
          border: "none",
          borderRadius: "50%",
          fontSize: 18,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
        }}
        aria-label="Back to top"
      >
        ↑
      </button>
    </>
  )
}
