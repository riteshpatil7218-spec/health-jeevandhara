import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Volume2, ArrowRight } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { translateText } from "@/data/prescriptionAI";

const sampleText = "Take Paracetamol 500mg twice daily after food. This medicine helps bring down fever and relieves pain. Complete full course as prescribed. Consult your doctor if symptoms persist for more than 3 days.";

export default function TranslationPage() {
  const [inputText, setInputText] = useState(sampleText);
  const [selectedLang, setSelectedLang] = useState<"hindi" | "marathi" | "tamil">("hindi");
  const [translated, setTranslated] = useState("");

  const doTranslate = () => {
    setTranslated(translateText(inputText, selectedLang));
  };

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85;
    speechSynthesis.speak(u);
  };

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">🌐 Translation Portal</h1>
        <p className="text-muted-foreground mb-6">Translate medical instructions into your language</p>

        <div className="flex gap-3 mb-6 flex-wrap">
          {(["hindi", "marathi", "tamil"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => { setSelectedLang(lang); setTranslated(""); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selectedLang === lang ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-secondary" /> English (Original)
            </h3>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-secondary outline-none resize-none"
            />
            <button onClick={() => speak(inputText)} className="mt-3 flex items-center gap-2 text-sm text-secondary font-medium hover:underline">
              <Volume2 className="w-4 h-4" /> Listen
            </button>
          </div>

          <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-health-green" /> {selectedLang.charAt(0).toUpperCase() + selectedLang.slice(1)}
            </h3>
            {translated ? (
              <>
                <div className="min-h-[200px] px-4 py-3 rounded-xl bg-muted text-foreground text-sm leading-relaxed">{translated}</div>
                <button onClick={() => speak(translated)} className="mt-3 flex items-center gap-2 text-sm text-health-green font-medium hover:underline">
                  <Volume2 className="w-4 h-4" /> Listen
                </button>
              </>
            ) : (
              <div className="min-h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                Click "Translate" to see result
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={doTranslate}
            disabled={!inputText.trim()}
            className="px-8 py-3.5 rounded-xl gradient-accent text-accent-foreground font-semibold flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
          >
            Translate <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
