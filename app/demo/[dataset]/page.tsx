"use client";

import { useEffect, useState, useCallback, useRef, use } from "react";
import Link from "next/link";
import styles from "./dashboard.module.css";
import {
  Target,
  MessageSquareQuote,
  TriangleAlert,
  Lightbulb,
  Route,
  Frown,
  Bot,
  ClipboardList,
  BarChart2,
  Flame,
  TrendingUp,
  FileText,
  Printer,
  X
} from "lucide-react";

/* ── Types ───────────────────────────────────────────────────── */
interface DatasetMeta {
  name: string;
  description: string;
  totalReviews: number;
  dateRange: string;
  source: string;
}

interface Summary {
  reviewsAnalyzed: number;
  painPointsIdentified: number;
  churnRiskPercent: number;
  mostMentionedIssue: string;
  topPainPoint: string;
  highestChurnDriver: string;
  mostRequestedFeature: string;
  estimatedTimeSaved: string;
  priorities: { level: string; label: string }[];
}

interface Quote {
  text: string;
  rating: number;
  reason: string;
}

interface Cluster {
  clusterId: string;
  label: string;
  reviewCount: number;
  sentiment: string;
  summary: string;
  reviews: string[];
  aiSummary: string;
  representativeReview: string;
  quotes: Quote[];
}

interface ChurnSignal {
  review: string;
  confidence: number;
  reasoning: string;
  clusterId: string;
}

interface Recommendation {
  problem: string;
  evidence: string;
  recommendation: string;
  whyItMatters: string;
  expectedKPI: string;
  priority: string;
}

interface RoadmapItem {
  problem: string;
  recommendation: string;
  reasoning: string;
  successMetric: string;
  businessImpact: string;
}

interface Dataset {
  meta: DatasetMeta;
  summary: Summary;
  clusters: Cluster[];
  churnSignals: ChurnSignal[];
  recommendations: Recommendation[];
  roadmap: { P0: RoadmapItem[]; P1: RoadmapItem[]; P2: RoadmapItem[] };
}

const STEPS = [
  { id: 1, name: "Pain Points", icon: <Target size={18} /> },
  { id: 2, name: "Quotes", icon: <MessageSquareQuote size={18} /> },
  { id: 3, name: "Churn", icon: <TriangleAlert size={18} /> },
  { id: 4, name: "Recommendations", icon: <Lightbulb size={18} /> },
  { id: 5, name: "Roadmap", icon: <Route size={18} /> },
];

const LOADING_STEPS = [
  "Ingesting customer reviews...",
  "Clustering pain points with NLP...",
  "Extracting verbatim quotes...",
  "Detecting churn signals...",
  "Generating recommendations...",
  "Building prioritized roadmap...",
];

/* ── Main Component ──────────────────────────────────────────── */
export default function DashboardPage({ params }: { params: Promise<{ dataset: string }> }) {
  const resolvedParams = use(params);
  const [data, setData] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(true);
  const [simStep, setSimStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClusters, setSelectedClusters] = useState<Set<string>>(new Set());
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);
  const [showBrief, setShowBrief] = useState(false);
  const stepContentRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/data/${resolvedParams.dataset}.json`);
      if (!res.ok) throw new Error("Dataset not found");
      const json = await res.json();
      setData(json);
      setSelectedClusters(new Set(json.clusters.map((c: Cluster) => c.clusterId)));
    } catch {
      setError("Could not load dataset. Please go back and select a valid dataset.");
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.dataset]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Simulated loading animation
  useEffect(() => {
    if (loading || error) return;
    if (!simulating) return;

    const interval = setInterval(() => {
      setSimStep((prev) => {
        if (prev >= LOADING_STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => setSimulating(false), 400);
          return prev;
        }
        return prev + 1;
      });
    }, 350);

    return () => clearInterval(interval);
  }, [loading, error, simulating]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  /* ── Helpers ─────────────────────────────────────────────── */
  const toggleCluster = (id: string) => {
    setSelectedClusters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleExpandCluster = (id: string) => {
    setExpandedCluster((prev) => (prev === id ? null : id));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const starsDisplay = (rating: number) => {
    return "★".repeat(Math.min(rating, 5)) + "☆".repeat(Math.max(5 - rating, 0));
  };

  const confidenceLevel = (conf: number) => {
    if (conf >= 0.8) return "high";
    if (conf >= 0.5) return "medium";
    return "low";
  };

  const sentimentBadgeClass = (sentiment: string) => {
    const s = sentiment.toLowerCase();
    if (s.includes("very negative")) return "badge-danger";
    if (s.includes("negative")) return "badge-warning";
    if (s.includes("mixed")) return "badge-neutral";
    return "badge-success";
  };

  const selectedClusterData = data?.clusters.filter((c) =>
    selectedClusters.has(c.clusterId)
  );

  const generateMarkdown = (): string => {
    if (!data) return "";
    const lines: string[] = [];
    lines.push(`# Product Manager Brief — ${data.meta.name}`);
    lines.push(`\n*Generated from ${data.summary.reviewsAnalyzed} reviews | ${data.meta.dateRange} | ${data.meta.source}*\n`);
    lines.push(`## Executive Summary\n`);
    lines.push(`- **Reviews Analyzed:** ${data.summary.reviewsAnalyzed}`);
    lines.push(`- **Pain Points Identified:** ${data.summary.painPointsIdentified}`);
    lines.push(`- **Churn Risk:** ${data.summary.churnRiskPercent}%`);
    lines.push(`- **Top Pain Point:** ${data.summary.topPainPoint}`);
    lines.push(`- **Highest Churn Driver:** ${data.summary.highestChurnDriver}`);
    lines.push(`- **Most Requested Feature:** ${data.summary.mostRequestedFeature}`);
    lines.push(`- **Estimated Time Saved:** ${data.summary.estimatedTimeSaved} of manual review\n`);
    lines.push(`## Top Pain Points\n`);
    data.clusters.forEach((c) => {
      lines.push(`### ${c.label}`);
      lines.push(`- ${c.reviewCount} reviews | Sentiment: ${c.sentiment}`);
      lines.push(`- ${c.summary}\n`);
    });
    lines.push(`## Supporting Quotes\n`);
    data.clusters.forEach((c) => {
      c.quotes.slice(0, 2).forEach((q) => {
        lines.push(`> "${q.text}" — ★${q.rating}/5`);
        lines.push(`> *AI Reason: ${q.reason}*\n`);
      });
    });
    lines.push(`## Churn Drivers\n`);
    data.churnSignals.forEach((s) => {
      lines.push(`- **${Math.round(s.confidence * 100)}% confidence** — ${s.reasoning}`);
      lines.push(`  > "${s.review.substring(0, 100)}..."\n`);
    });
    lines.push(`## Product Recommendations\n`);
    lines.push(`| Priority | Problem | Recommendation | Expected KPI |`);
    lines.push(`|----------|---------|----------------|--------------|`);
    data.recommendations.forEach((r) => {
      lines.push(`| ${r.priority} | ${r.problem} | ${r.recommendation} | ${r.expectedKPI} |`);
    });
    lines.push(`\n## Prioritized Roadmap\n`);
    (["P0", "P1", "P2"] as const).forEach((p) => {
      lines.push(`### ${p} — ${p === "P0" ? "Critical" : p === "P1" ? "Important" : "Nice to Have"}\n`);
      data.roadmap[p]?.forEach((item) => {
        lines.push(`**${item.recommendation}**`);
        lines.push(`- Problem: ${item.problem}`);
        lines.push(`- Success Metric: ${item.successMetric}`);
        lines.push(`- Business Impact: ${item.businessImpact}\n`);
      });
    });
    lines.push(`\n---\n*Voice of Customer Copilot — AI-Powered Product Intelligence*`);
    return lines.join("\n");
  };

  const downloadMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data?.meta.name || "brief"}_pm_brief.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    window.print();
  };

  /* ── Error State ───────────────────────────────────────────── */
  if (error) {
    return (
      <div className={styles.dashboardPage}>
        <div className={styles.loading}>
          <div className={styles.emptyIcon} style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <Frown size={48} className="text-secondary" />
          </div>
          <p className={styles.loadingText}>{error}</p>
          <Link href="/demo" className="btn btn-primary">← Back to Datasets</Link>
        </div>
      </div>
    );
  }

  /* ── Simulated Loading Screen ──────────────────────────────── */
  if (loading || simulating) {
    const progress = loading ? 10 : Math.min(((simStep + 1) / LOADING_STEPS.length) * 100, 100);
    return (
      <div className={styles.dashboardPage}>
        <nav className={styles.dashNav}>
          <div className={styles.dashNavInner}>
            <div className={styles.dashNavLeft}>
              <Link href="/" className={styles.dashNavLogo}>
                <span className={styles.dashNavLogoIcon}>✦</span>
                VoC Copilot
              </Link>
              <div className={styles.dashNavDivider} />
              <span className={styles.dashNavDataset}>Analyzing...</span>
            </div>
          </div>
        </nav>
        <div className={styles.simulatedLoading}>
          <div className={styles.loadingCard}>
            <div className={styles.loadingIcon} style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
              <Bot size={48} className="text-primary" />
            </div>
            <h2 className={styles.loadingTitle}>Running AI Analysis</h2>
            <p className={styles.loadingSubtitle}>
              Processing {data?.meta.name || "dataset"} reviews...
            </p>
            <div className={styles.loadingProgress}>
              <div
                className={styles.loadingProgressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className={styles.loadingSteps}>
              {LOADING_STEPS.map((step, i) => (
                <div
                  key={step}
                  className={`${styles.loadingStepItem} ${
                    i === simStep ? styles.active : i < simStep ? styles.done : ""
                  }`}
                >
                  <div className={styles.loadingStepDot}>
                    {i < simStep ? "✓" : i === simStep ? "●" : "○"}
                  </div>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  /* ── Render ────────────────────────────────────────────────── */
  return (
    <div className={styles.dashboardPage}>
      {/* Nav */}
      <nav className={styles.dashNav}>
        <div className={styles.dashNavInner}>
          <div className={styles.dashNavLeft}>
            <Link href="/" className={styles.dashNavLogo}>
              <span className={styles.dashNavLogoIcon}>✦</span>
              VoC Copilot
            </Link>
            <div className={styles.dashNavDivider} />
            <span className={styles.dashNavDataset}>{data.meta.name} Analysis</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/demo" className="btn btn-ghost btn-sm">← Datasets</Link>
            <button className="btn btn-primary btn-sm" onClick={() => setShowBrief(true)} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ClipboardList size={16} /> Generate Brief
            </button>
          </div>
        </div>
      </nav>

      <div className={styles.mainContent}>
        {/* Executive Summary */}
        <div className={styles.execSummary}>
          <h2 className={styles.execTitle} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ClipboardList size={24} className="text-primary" /> Executive Summary
          </h2>
          <div className={styles.execGrid}>
            <div className={styles.execItem}>
              <div className={styles.execItemLabel}>Top Pain Point</div>
              <div className={styles.execItemValue}>{data.summary.topPainPoint}</div>
            </div>
            <div className={styles.execItem}>
              <div className={styles.execItemLabel}>Highest Churn Driver</div>
              <div className={styles.execItemValue}>{data.summary.highestChurnDriver}</div>
            </div>
            <div className={styles.execItem}>
              <div className={styles.execItemLabel}>Most Requested Feature</div>
              <div className={styles.execItemValue}>{data.summary.mostRequestedFeature}</div>
            </div>
            <div className={styles.execItem}>
              <div className={styles.execItemLabel}>Suggested Priorities</div>
              <div className={styles.priorityTags}>
                {data.summary.priorities.map((p) => (
                  <span key={p.level} className={`${styles.priorityTag} ${styles[p.level.toLowerCase()]}`}>
                    {p.level} {p.label}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.execItem}>
              <div className={styles.execItemLabel}>Estimated Time Saved</div>
              <div className={styles.execItemValue}>{data.summary.estimatedTimeSaved} of manual review</div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className={styles.kpiRow}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)" }}><BarChart2 size={24} /></div>
            <div className={styles.kpiValue}>{data.summary.reviewsAnalyzed.toLocaleString()}</div>
            <div className={styles.kpiLabel}>Reviews Analyzed</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#16A34A" }}><Target size={24} /></div>
            <div className={styles.kpiValue}>{data.summary.painPointsIdentified}</div>
            <div className={styles.kpiLabel}>Pain Points Identified</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#DC2626" }}><TriangleAlert size={24} /></div>
            <div className={styles.kpiValue}>{data.summary.churnRiskPercent}%</div>
            <div className={styles.kpiLabel}>Churn Risk</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#EA580C" }}><Flame size={24} /></div>
            <div className={styles.kpiValue} style={{ fontSize: "1.1rem" }}>{data.summary.mostMentionedIssue}</div>
            <div className={styles.kpiLabel}>Most Mentioned Issue</div>
          </div>
        </div>

        {/* Step Progress */}
        <div className={styles.stepProgress}>
          {STEPS.map((step, i) => (
            <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
              <div
                className={`${styles.stepItem} ${currentStep === step.id ? styles.activeStep : ""}`}
                onClick={() => goToStep(step.id)}
                style={currentStep === step.id ? { background: "var(--color-primary-50)" } : undefined}
              >
                <div
                  className={`${styles.stepDot} ${
                    currentStep === step.id
                      ? styles.active
                      : currentStep > step.id
                      ? styles.completed
                      : styles.upcoming
                  }`}
                >
                  {currentStep > step.id ? "✓" : step.id}
                </div>
                <span className={styles.stepName} style={{ display: "flex", alignItems: "center", gap: "6px" }}>{step.icon} {step.name}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`${styles.stepConnector} ${currentStep > step.id ? styles.completed : ""}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className={styles.stepContent} ref={stepContentRef} key={currentStep}>
          {/* ── Step 1: Clusters ────────────────────────────────── */}
          {currentStep === 1 && (
            <>
              <div className={styles.stepHeader}>
                <div>
                  <h2 className={styles.stepTitle}>Pain Point Clusters</h2>
                  <p className={styles.stepSubtitle}>
                    {data.clusters.length} clusters identified — select which ones to analyze further
                  </p>
                </div>
                <span className="badge badge-primary">
                  {selectedClusters.size}/{data.clusters.length} selected
                </span>
              </div>
              <div className={styles.clusterGrid}>
                {data.clusters.map((cluster) => (
                  <div
                    key={cluster.clusterId}
                    className={`${styles.clusterCard} ${
                      selectedClusters.has(cluster.clusterId) ? styles.selected : ""
                    }`}
                  >
                    <div className={styles.clusterCardHeader} onClick={() => toggleCluster(cluster.clusterId)}>
                      <div className={styles.clusterCheck}>
                        {selectedClusters.has(cluster.clusterId) && (
                          <span style={{ fontSize: 14, lineHeight: 1 }}>✓</span>
                        )}
                      </div>
                      <div className={styles.clusterInfo}>
                        <div className={styles.clusterLabel}>{cluster.label}</div>
                        <div className={styles.clusterMeta}>
                          <span className={`badge ${sentimentBadgeClass(cluster.sentiment)}`}>
                            {cluster.sentiment}
                          </span>
                          <span className="badge badge-neutral">
                            {cluster.reviewCount} reviews
                          </span>
                        </div>
                        <div className={styles.clusterSummary}>{cluster.summary}</div>
                      </div>
                    </div>
                    <div style={{ padding: "0 20px 12px" }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => toggleExpandCluster(cluster.clusterId)}
                        style={{ fontSize: "0.78rem" }}
                      >
                        {expandedCluster === cluster.clusterId ? "▲ Hide Details" : "▼ View Details"}
                      </button>
                    </div>
                    {expandedCluster === cluster.clusterId && (
                      <div className={styles.clusterExpanded}>
                        <div className={styles.expandSection}>
                          <div className={styles.expandSectionTitle}>AI Analysis</div>
                          <div className={styles.expandAI}>{cluster.aiSummary}</div>
                        </div>
                        <div className={styles.expandSection}>
                          <div className={styles.expandSectionTitle}>Representative Review</div>
                          <div className={styles.expandReview} style={{
                            borderLeft: "3px solid var(--color-primary)",
                            fontStyle: "italic"
                          }}>
                            &ldquo;{cluster.representativeReview}&rdquo;
                          </div>
                        </div>
                        <div className={styles.expandSection}>
                          <div className={styles.expandSectionTitle}>Sample Reviews ({cluster.reviews.length})</div>
                          {cluster.reviews.slice(0, 4).map((r, i) => (
                            <div key={i} className={styles.expandReview}>&ldquo;{r}&rdquo;</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className={styles.stepNav}>
                <button className="btn btn-primary" onClick={() => goToStep(2)}>
                  Continue with {selectedClusters.size} clusters →
                </button>
              </div>
            </>
          )}

          {/* ── Step 2: Quotes ─────────────────────────────────── */}
          {currentStep === 2 && (
            <>
              <div className={styles.stepHeader}>
                <div>
                  <h2 className={styles.stepTitle}>Customer Quotes</h2>
                  <p className={styles.stepSubtitle}>
                    Representative quotes from {selectedClusters.size} selected clusters
                  </p>
                </div>
              </div>
              {selectedClusterData && selectedClusterData.length > 0 ? (
                <div className={styles.quoteList}>
                  {selectedClusterData.map((cluster) =>
                    cluster.quotes.map((q, qi) => (
                      <div key={`${cluster.clusterId}-${qi}`} className={styles.quoteCard}>
                        <div className={styles.quoteClusterTag} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <Target size={14} /> {cluster.label}
                        </div>
                        <div className={styles.quoteStars}>{starsDisplay(q.rating)}</div>
                        <div className={styles.quoteText}>{q.text}</div>
                        <div className={styles.quoteReason}>
                          <span className={styles.quoteReasonLabel}>AI Reason:</span>
                          {q.reason}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon} style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                    <MessageSquareQuote size={48} className="text-secondary" />
                  </div>
                  <h3 className={styles.emptyTitle}>No clusters selected</h3>
                  <p className={styles.emptyDesc}>Go back and select clusters to see their quotes.</p>
                </div>
              )}
              <div className={styles.stepNav}>
                <button className="btn btn-secondary" onClick={() => goToStep(1)}>
                  ← Back
                </button>
                <button className="btn btn-primary" onClick={() => goToStep(3)}>
                  Continue to Churn Signals →
                </button>
              </div>
            </>
          )}

          {/* ── Step 3: Churn ──────────────────────────────────── */}
          {currentStep === 3 && (
            <>
              <div className={styles.stepHeader}>
                <div>
                  <h2 className={styles.stepTitle}>Churn Signals</h2>
                  <p className={styles.stepSubtitle}>
                    {data.churnSignals.length} reviews indicating potential churn
                  </p>
                </div>
                <span className="badge badge-danger">
                  {data.summary.churnRiskPercent}% churn risk
                </span>
              </div>
              <div className={styles.churnList}>
                {data.churnSignals.map((signal, i) => {
                  const level = confidenceLevel(signal.confidence);
                  return (
                    <div key={i} className={styles.churnCard}>
                      <div className={styles.churnHeader}>
                        <span className={`badge badge-${level === "high" ? "danger" : level === "medium" ? "warning" : "neutral"}`}>
                          {level === "high" ? "High Risk" : level === "medium" ? "Medium Risk" : "Low Risk"}
                        </span>
                        <div className={styles.churnConfidence}>
                          <div className={styles.confidenceBar}>
                            <div
                              className={`${styles.confidenceFill} ${styles[level]}`}
                              style={{ width: `${signal.confidence * 100}%` }}
                            />
                          </div>
                          <span className={styles.confidenceText} style={{
                            color: level === "high" ? "#EF4444" : level === "medium" ? "#F59E0B" : "#94A3B8"
                          }}>
                            {Math.round(signal.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                      <div className={styles.churnReview}>
                        &ldquo;{signal.review}&rdquo;
                      </div>
                      <div className={styles.churnReasoning}>
                        <span className={styles.churnReasonLabel}>Reasoning:</span>
                        {signal.reasoning}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.stepNav}>
                <button className="btn btn-secondary" onClick={() => goToStep(2)}>
                  ← Back
                </button>
                <button className="btn btn-primary" onClick={() => goToStep(4)}>
                  Continue to Recommendations →
                </button>
              </div>
            </>
          )}

          {/* ── Step 4: Recommendations ────────────────────────── */}
          {currentStep === 4 && (
            <>
              <div className={styles.stepHeader}>
                <div>
                  <h2 className={styles.stepTitle}>Product Recommendations</h2>
                  <p className={styles.stepSubtitle}>
                    {data.recommendations.length} evidence-backed recommendations
                  </p>
                </div>
              </div>
              <div className={styles.recList}>
                {data.recommendations.map((rec, i) => (
                  <div key={i} className={styles.recCard}>
                    <div className={styles.recHeader}>
                      <div className={styles.recProblem}>{rec.problem}</div>
                      <span className={`${styles.recPriorityBadge} ${styles[rec.priority.toLowerCase()]}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <div className={styles.recBody}>
                      <div className={styles.recField}>
                        <div className={styles.recFieldLabel}>Evidence</div>
                        <div className={styles.recFieldValue}>{rec.evidence}</div>
                      </div>
                      <div className={styles.recField}>
                        <div className={styles.recFieldLabel}>Recommendation</div>
                        <div className={styles.recFieldValue}>{rec.recommendation}</div>
                      </div>
                      <div className={styles.recField}>
                        <div className={styles.recFieldLabel}>Why It Matters</div>
                        <div className={styles.recFieldValue}>{rec.whyItMatters}</div>
                      </div>
                      <div className={styles.recField}>
                        <div className={styles.recFieldLabel}>Expected KPI Impact</div>
                        <div className={styles.kpiBadge} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <TrendingUp size={16} /> {rec.expectedKPI}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.stepNav}>
                <button className="btn btn-secondary" onClick={() => goToStep(3)}>
                  ← Back
                </button>
                <button className="btn btn-primary" onClick={() => goToStep(5)}>
                  Continue to Roadmap →
                </button>
              </div>
            </>
          )}

          {/* ── Step 5: Roadmap ────────────────────────────────── */}
          {currentStep === 5 && (
            <>
              <div className={styles.stepHeader}>
                <div>
                  <h2 className={styles.stepTitle}>Prioritized Roadmap</h2>
                  <p className={styles.stepSubtitle}>
                    Grouped by priority for quarterly planning
                  </p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setShowBrief(true)} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <ClipboardList size={16} /> Generate PM Brief
                </button>
              </div>
              <div className={styles.roadmapContainer}>
                {(["P0", "P1", "P2"] as const).map((priority) => {
                  const items = data.roadmap[priority];
                  if (!items || items.length === 0) return null;
                  return (
                    <div key={priority} className={styles.roadmapGroup}>
                      <div className={styles.roadmapGroupTitle}>
                        <span className={`${styles.roadmapGroupBadge} ${styles[priority.toLowerCase()]}`}>
                          {priority}
                        </span>
                        {priority === "P0" ? "Critical — Fix Immediately" : priority === "P1" ? "Important — Next Sprint" : "Nice to Have — Backlog"}
                      </div>
                      <div className={`${styles.roadmapItems} ${styles[priority.toLowerCase()]}`}>
                        {items.map((item, i) => (
                          <div key={i} className={styles.roadmapItem}>
                            <div className={styles.roadmapItemTitle}>{item.recommendation}</div>
                            <div className={styles.roadmapItemFields}>
                              <div className={styles.roadmapField}>
                                <div className={styles.roadmapFieldLabel}>Problem</div>
                                <div className={styles.roadmapFieldValue}>{item.problem}</div>
                              </div>
                              <div className={styles.roadmapField}>
                                <div className={styles.roadmapFieldLabel}>Reasoning</div>
                                <div className={styles.roadmapFieldValue}>{item.reasoning}</div>
                              </div>
                              <div className={styles.roadmapField}>
                                <div className={styles.roadmapFieldLabel}>Success Metric</div>
                                <div className={styles.roadmapFieldValue}>{item.successMetric}</div>
                              </div>
                              <div className={styles.roadmapField}>
                                <div className={styles.roadmapFieldLabel}>Business Impact</div>
                                <span className={`${styles.impactBadge} ${styles[item.businessImpact.toLowerCase()]}`}>
                                  {item.businessImpact}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.stepNav}>
                <button className="btn btn-secondary" onClick={() => goToStep(4)}>
                  ← Back
                </button>
                <button className="btn btn-primary" onClick={() => setShowBrief(true)} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <ClipboardList size={18} /> Generate Product Manager Brief
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── PM Brief Modal ───────────────────────────────────── */}
      {showBrief && (
        <div className={`${styles.briefOverlay} no-print`} onClick={() => setShowBrief(false)}>
          <div className={styles.briefModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.briefHeader}>
              <h2 className={styles.briefHeaderTitle} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ClipboardList size={24} className="text-primary" /> Product Manager Brief — {data.meta.name}
              </h2>
              <div className={styles.briefActions}>
                <button className="btn btn-secondary btn-sm" onClick={downloadMarkdown} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <FileText size={16} /> Download MD
                </button>
                <button className="btn btn-secondary btn-sm" onClick={downloadPDF} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Printer size={16} /> Print / PDF
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowBrief(false)} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4px" }}>
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className={styles.briefBody}>
              {/* Executive Summary */}
              <div className={styles.briefSection}>
                <h3 className={styles.briefSectionTitle}>Executive Summary</h3>
                <div className={styles.execGrid} style={{ marginBottom: 0 }}>
                  <div className={styles.execItem}>
                    <div className={styles.execItemLabel}>Reviews Analyzed</div>
                    <div className={styles.execItemValue}>{data.summary.reviewsAnalyzed.toLocaleString()}</div>
                  </div>
                  <div className={styles.execItem}>
                    <div className={styles.execItemLabel}>Pain Points</div>
                    <div className={styles.execItemValue}>{data.summary.painPointsIdentified}</div>
                  </div>
                  <div className={styles.execItem}>
                    <div className={styles.execItemLabel}>Churn Risk</div>
                    <div className={styles.execItemValue} style={{ color: "#DC2626" }}>{data.summary.churnRiskPercent}%</div>
                  </div>
                  <div className={styles.execItem}>
                    <div className={styles.execItemLabel}>Time Saved</div>
                    <div className={styles.execItemValue}>{data.summary.estimatedTimeSaved}</div>
                  </div>
                </div>
              </div>

              {/* Pain Points */}
              <div className={styles.briefSection}>
                <h3 className={styles.briefSectionTitle}>Top Pain Points</h3>
                <table className={styles.briefTable}>
                  <thead>
                    <tr>
                      <th>Cluster</th>
                      <th>Reviews</th>
                      <th>Sentiment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.clusters.map((c) => (
                      <tr key={c.clusterId}>
                        <td style={{ fontWeight: 600, color: "var(--color-text)" }}>{c.label}</td>
                        <td>{c.reviewCount}</td>
                        <td>
                          <span className={`badge ${sentimentBadgeClass(c.sentiment)}`}>
                            {c.sentiment}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Quotes */}
              <div className={styles.briefSection}>
                <h3 className={styles.briefSectionTitle}>Supporting Quotes</h3>
                {data.clusters.slice(0, 3).map((c) => (
                  <div key={c.clusterId} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: 6 }}>
                      {c.label}
                    </div>
                    {c.quotes.slice(0, 1).map((q, qi) => (
                      <div key={qi} className={styles.briefQuote}>
                        &ldquo;{q.text}&rdquo; — ★{q.rating}/5
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Churn */}
              <div className={styles.briefSection}>
                <h3 className={styles.briefSectionTitle}>Highest Churn Drivers</h3>
                {data.churnSignals.slice(0, 3).map((s, i) => (
                  <div key={i} style={{
                    padding: "8px 0",
                    borderBottom: i < 2 ? "1px solid var(--color-border-light)" : "none",
                    fontSize: "0.85rem",
                    color: "var(--color-text-secondary)"
                  }}>
                    <span style={{ fontWeight: 700, color: "#DC2626" }}>
                      {Math.round(s.confidence * 100)}%
                    </span>
                    {" "} — {s.reasoning}
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div className={styles.briefSection}>
                <h3 className={styles.briefSectionTitle}>Product Recommendations</h3>
                <table className={styles.briefTable}>
                  <thead>
                    <tr>
                      <th>Priority</th>
                      <th>Problem</th>
                      <th>Recommendation</th>
                      <th>KPI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recommendations.map((r, i) => (
                      <tr key={i}>
                        <td>
                          <span className={`${styles.recPriorityBadge} ${styles[r.priority.toLowerCase()]}`}>
                            {r.priority}
                          </span>
                        </td>
                        <td>{r.problem}</td>
                        <td>{r.recommendation}</td>
                        <td><span className={styles.kpiBadge}>{r.expectedKPI}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Roadmap */}
              <div className={styles.briefSection}>
                <h3 className={styles.briefSectionTitle}>Prioritized Roadmap</h3>
                {(["P0", "P1", "P2"] as const).map((p) => (
                  <div key={p} style={{ marginBottom: 16 }}>
                    <span className={`${styles.roadmapGroupBadge} ${styles[p.toLowerCase()]}`} style={{ marginBottom: 8, display: "inline-block" }}>
                      {p}
                    </span>
                    {data.roadmap[p]?.map((item, i) => (
                      <div key={i} style={{
                        padding: "8px 0 8px 16px",
                        borderLeft: `3px solid ${p === "P0" ? "#EF4444" : p === "P1" ? "#F59E0B" : "#2563EB"}`,
                        marginBottom: 4,
                        fontSize: "0.85rem"
                      }}>
                        <div style={{ fontWeight: 600, color: "var(--color-text)" }}>{item.recommendation}</div>
                        <div style={{ color: "var(--color-text-tertiary)", fontSize: "0.78rem" }}>
                          Metric: {item.successMetric} | Impact: {item.businessImpact}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
