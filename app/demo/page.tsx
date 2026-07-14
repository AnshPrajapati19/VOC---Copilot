"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./demo.module.css";
import {
  BusFront,
  Utensils,
  Music,
  Bird,
  BarChart2,
  Calendar,
  FileUp,
  FileText,
  Lock,
  ArrowRight
} from "lucide-react";

const datasets = [
  {
    id: "zingbus",
    name: "Zingbus",
    desc: "Inter-city bus booking platform — analyze payment failures, booking issues, and driver complaints from 847 Play Store reviews.",
    icon: <BusFront size={24} />,
    color: "#2563EB",
    bg: "#EFF6FF",
    reviews: "847",
    source: "Google Play Store",
    period: "Jan–Jun 2025",
  },
  {
    id: "swiggy",
    name: "Swiggy",
    desc: "Food delivery platform — explore late delivery complaints, order issues, and refund problems from 1,243 app reviews.",
    icon: <Utensils size={24} />,
    color: "#EA580C",
    bg: "#FFF7ED",
    reviews: "1,243",
    source: "App Store & Play Store",
    period: "Mar–Jun 2025",
  },
  {
    id: "spotify",
    name: "Spotify",
    desc: "Music streaming service — discover shuffle algorithm complaints, ad frequency issues, and feature requests from 2,156 reviews.",
    icon: <Music size={24} />,
    color: "#16A34A",
    bg: "#F0FDF4",
    reviews: "2,156",
    source: "App Store & Play Store",
    period: "Jan–Jun 2025",
  },
  {
    id: "duolingo",
    name: "Duolingo",
    desc: "Language learning app — investigate heart system frustrations, streak anxiety, and content quality issues from 1,587 reviews.",
    icon: <Bird size={24} />,
    color: "#7C3AED",
    bg: "#F5F3FF",
    reviews: "1,587",
    source: "App Store & Play Store",
    period: "Feb–Jun 2025",
  },
];

export default function DemoPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Navbar */}
      <nav className={styles.navbar || ""} style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--color-border-light)"
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between", height: 64
        }}>
          <Link href="/" style={{
            display: "flex", alignItems: "center", gap: 12,
            fontWeight: 700, fontSize: "1.125rem", color: "var(--color-text)"
          }}>
            <span style={{
              width: 32, height: 32, background: "linear-gradient(135deg, #2563EB, #7C3AED)",
              borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 16
            }}>✦</span>
            VoC Copilot
          </Link>
          <Link href="/" className="btn btn-ghost btn-sm">← Back to Home</Link>
        </div>
      </nav>

      <div className={styles.demoPage}>
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.headerTitle}>Choose a Dataset</h1>
            <p className={styles.headerSubtitle}>
              Explore pre-analyzed customer reviews from real companies to see the copilot in action.
            </p>
          </div>

          <div id="datasets" className={styles.datasetGrid}>
            {datasets.map((d, i) => (
              <Link
                key={d.id}
                href={`/demo/${d.id}`}
                className={styles.datasetCard}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={styles.cardTop}>
                  <div className={styles.cardIcon} style={{ background: d.bg, color: d.color }}>
                    {d.icon}
                  </div>
                  <div className={styles.cardMeta}>
                    <h3 className={styles.cardTitle}>{d.name}</h3>
                    <p className={styles.cardSource}>{d.source}</p>
                  </div>
                </div>
                <p className={styles.cardDesc}>{d.desc}</p>
                <div className={styles.cardStats}>
                  <span className={styles.stat} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <BarChart2 size={14} className="text-primary" /> <span className={styles.statValue}>{d.reviews}</span> reviews
                  </span>
                  <span className={styles.stat} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} className="text-secondary" /> {d.period}
                  </span>
                </div>
                <div className={styles.cardArrow}>
                  Explore Analysis →
                </div>
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>or bring your own data</span>
            <div className={styles.dividerLine} />
          </div>

          {/* Upload Section */}
          <div className={styles.uploadSection}>
            <h2 className={styles.uploadTitle}>Use Your Own Reviews</h2>
            <p className={styles.uploadSubtitle}>
              Upload a CSV file or paste reviews directly
            </p>
            <div className={styles.uploadOptions}>
              <div className={styles.uploadCard} onClick={() => setShowModal(true)}>
                <div className={styles.uploadCardIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileUp size={24} />
                </div>
                <div className={styles.uploadCardTitle}>Upload CSV</div>
                <div className={styles.uploadCardDesc}>
                  .csv file with review text column
                </div>
              </div>
              <div className={styles.uploadCard} onClick={() => setShowModal(true)}>
                <div className={styles.uploadCardIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={24} />
                </div>
                <div className={styles.uploadCardTitle}>Paste Reviews</div>
                <div className={styles.uploadCardDesc}>
                  Paste reviews directly, one per line
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={28} className="text-primary" />
            </div>
            <h3 className={styles.modalTitle}>Portfolio Demo Mode</h3>
            <p className={styles.modalDesc}>
              Live AI analysis is not enabled in this portfolio demo. The architecture supports it — but for this MVP, please explore the{" "}
              <strong>pre-analyzed sample datasets</strong> to see the full workflow.
            </p>
            <Link href="/demo#datasets" className="btn btn-primary" onClick={() => setShowModal(false)}>
              Explore Sample Datasets
            </Link>
            <button
              className="btn btn-ghost"
              onClick={() => setShowModal(false)}
              style={{ marginTop: 8 }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
