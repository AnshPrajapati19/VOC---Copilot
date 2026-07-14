"use client";

import Link from "next/link";
import styles from "./page.module.css";

import {
  Target,
  MessageSquareQuote,
  TriangleAlert,
  Route,
  UploadCloud,
  BrainCircuit,
  Lightbulb,
  Sparkles,
  ArrowRight,
  BarChart,
  Bot
} from "lucide-react";

const features = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "Cluster Pain Points",
    desc: "Automatically group reviews into coherent pain point clusters with sentiment analysis.",
    color: "blue",
  },
  {
    icon: <MessageSquareQuote className="w-6 h-6" />,
    title: "Surface Customer Quotes",
    desc: "Extract verbatim quotes grounded in real reviews — never hallucinated or paraphrased.",
    color: "purple",
  },
  {
    icon: <TriangleAlert className="w-6 h-6" />,
    title: "Detect Churn Signals",
    desc: "Identify reviews signaling churn intent with confidence scoring and reasoning.",
    color: "amber",
  },
  {
    icon: <Route className="w-6 h-6" />,
    title: "Generate Product Roadmaps",
    desc: "Turn pain points into prioritized, evidence-backed roadmap recommendations.",
    color: "green",
  },
];

const workflowSteps = [
  { label: "Upload Reviews", icon: <UploadCloud size={20} /> },
  { label: "AI Analysis", icon: <BrainCircuit size={20} /> },
  { label: "Pain Points", icon: <Target size={20} /> },
  { label: "Customer Quotes", icon: <MessageSquareQuote size={20} /> },
  { label: "Churn Signals", icon: <TriangleAlert size={20} /> },
  { label: "Recommendations", icon: <Lightbulb size={20} /> },
  { label: "Roadmap", icon: <Route size={20} /> },
];

const trustNumbers = [
  { number: "5,800+", label: "Reviews Analyzed" },
  { number: "24", label: "Pain Points Found" },
  { number: "4", label: "Sample Datasets" },
  { number: "< 1s", label: "Analysis Time" },
];

export default function LandingPage() {
  return (
    <>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navbarInner}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>✦</span>
            VoC Copilot
          </Link>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#workflow" className={styles.navLink}>How it Works</a>
            <Link href="/demo" className="btn btn-primary btn-sm">
              Try Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <Sparkles size={14} className="text-primary" />
            AI-Powered Product Intelligence
          </div>
          <h1 className={styles.heroTitle}>
            Voice of Customer{" "}
            <span className="text-gradient">Copilot</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Transform thousands of customer reviews into prioritized product
            decisions using AI. Evidence-first — always showing data before
            recommendations.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/demo" className="btn btn-primary btn-lg">
              Try Demo <ArrowRight size={18} style={{ marginLeft: "6px" }} />
            </Link>
            <Link href="/demo#datasets" className="btn btn-secondary btn-lg">
              <BarChart size={18} style={{ marginRight: "6px" }} /> View Sample Datasets
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Numbers */}
      <section className={styles.trust}>
        <div className="container">
          <div className={styles.trustGrid}>
            {trustNumbers.map((t, i) => (
              <div
                key={t.label}
                className={styles.trustItem}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={styles.trustNumber}>{t.number}</div>
                <div className={styles.trustLabel}>{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={styles.features}>
        <div className="container">
          <p className={styles.sectionLabel}>Capabilities</p>
          <h2 className={styles.sectionTitle}>
            Everything a PM needs, from reviews to roadmap
          </h2>
          <p className={styles.sectionSubtitle}>
            An end-to-end workflow that converts raw customer feedback into
            structured, prioritized product decisions.
          </p>
          <div className={styles.featureGrid}>
            {features.map((f, i) => (
              <div
                key={f.title}
                className={styles.featureCard}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className={`${styles.featureIcon} ${styles[f.color]}`}>
                  {f.icon}
                </div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className={styles.workflow}>
        <div className="container">
          <p className={styles.sectionLabel}>Workflow</p>
          <h2 className={styles.sectionTitle}>
            From raw reviews to product roadmap
          </h2>
          <p className={styles.sectionSubtitle}>
            A transparent, step-by-step pipeline — always showing evidence
            before making recommendations.
          </p>
          <div className={styles.workflowSteps}>
            {workflowSteps.map((step, i) => (
              <div key={step.label}>
                <div
                  className={styles.workflowStep}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <span className={styles.stepNumber}>{step.icon}</span>
                  <span className={styles.stepLabel}>{step.label}</span>
                </div>
                {i < workflowSteps.length - 1 && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div className={styles.workflowConnector} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Ready to see it in action?</h2>
            <p className={styles.ctaSubtitle}>
              Explore pre-analyzed datasets from Zingbus, Swiggy, Spotify, and
              Duolingo.
            </p>
            <Link href="/demo" className={styles.ctaBtnWhite}>
              Try the Demo <ArrowRight size={18} style={{ marginLeft: "6px" }} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <p className={styles.footerText}>
            Built as a portfolio MVP to demonstrate product thinking, AI product
            design, and the ability to ship independently.
          </p>
          <p className={styles.footerText} style={{ marginTop: "8px" }}>
            Voice of Customer Copilot — A Product Management Portfolio Project
          </p>
        </div>
      </footer>
    </>
  );
}
