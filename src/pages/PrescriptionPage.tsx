import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Loader2, Sun, Moon, CloudSun, AlertTriangle, Volume2, Globe } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import RiskBadge from "@/components/RiskBadge";
import { analyzePrescription, PrescriptionResult, translateText } from "@/data/prescriptionAI";

export default function PrescriptionPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PrescriptionResult | null>(null);
  const [selectedLang, setSelectedLang] = useState<"english" | "hindi" | "marathi" | "tamil">("english");

  const analyze = () => {
    if (!input.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult(analyzePrescription(input));
      setLoading(false);
    }, 2000);
  };

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85;
    u.pitch = 1;
    speechSynthesis.speak(u);
  };

  const getTranslated = (text: string) => {
    if (selectedLang === "english") return text;
    return translateText(text, selectedLang);
  };

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">📋 Prescription Analysis</h1>
          <p className="text-muted-foreground mb-6">Upload or paste your prescription for AI-powered analysis</p>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-card mb-6">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste prescription text here...&#10;&#10;Example: Paracetamol 500mg twice daily, Amoxicillin 250mg three times daily, Omeprazole 20mg before breakfast"
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-secondary outline-none resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={analyze}
                disabled={loading || !input.trim()}
                className="flex-1 py-3.5 rounded-xl gradient-hero text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
                {loading ? "Analyzing..." : "Analyze with AI"}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                {/* Language Selector */}
                <div className="flex gap-2 flex-wrap">
                  {(["english", "hindi", "marathi", "tamil"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedLang === lang
                          ? "gradient-hero text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <Globe className="w-4 h-4 inline mr-1" />
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Summary */}
                <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
                  <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                    <h2 className="text-lg font-bold text-foreground">AI Analysis Summary</h2>
                    <RiskBadge level={result.riskLevel} large />
                  </div>
                  <p className="text-foreground">{getTranslated(result.summary)}</p>
                  {result.riskLevel === "High" && (
                    <div className="mt-4 p-4 rounded-xl bg-health-red/10 border border-health-red/30 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-health-red flex-shrink-0 mt-0.5" />
                      <p className="text-health-red font-medium">{getTranslated(result.advice)}</p>
                    </div>
                  )}
                  <button onClick={() => speak(result.summary)} className="mt-3 flex items-center gap-2 text-sm text-secondary font-medium hover:underline">
                    <Volume2 className="w-4 h-4" /> Listen to Summary
                  </button>
                </div>

                {/* Medicines */}
                {result.medicines.map((med, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card rounded-2xl border border-border p-6 shadow-card"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-foreground">💊 {med.name}</h3>
                      <button onClick={() => speak(`${med.name}. ${med.explanation}`)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                        <Volume2 className="w-5 h-5 text-secondary" />
                      </button>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4">{getTranslated(med.purpose)}</p>
                    <p className="text-foreground mb-4">{getTranslated(med.explanation)}</p>

                    <div className="flex gap-3 mb-4 flex-wrap">
                      {med.dosage.morning && (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-health-amber/10 text-health-amber text-sm font-medium">
                          <Sun className="w-4 h-4" /> Morning
                        </span>
                      )}
                      {med.dosage.afternoon && (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary text-sm font-medium">
                          <CloudSun className="w-4 h-4" /> Afternoon
                        </span>
                      )}
                      {med.dosage.night && (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                          <Moon className="w-4 h-4" /> Night
                        </span>
                      )}
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${med.beforeFood ? "bg-health-green/10 text-health-green" : "bg-muted text-muted-foreground"}`}>
                        {med.beforeFood ? "Before Food" : "After Food"}
                      </span>
                    </div>

                    {med.precautions.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-foreground mb-1">⚠️ Precautions:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {med.precautions.map((p, j) => <li key={j}>• {getTranslated(p)}</li>)}
                        </ul>
                      </div>
                    )}

                    {med.sideEffects.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-foreground mb-1">Side Effects:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {med.sideEffects.map((s, j) => <li key={j}>• {getTranslated(s)}</li>)}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
