import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Pause, Play, RotateCcw, Globe } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

const sampleTexts = {
  english: "Take Paracetamol two times a day, once in the morning and once at night, after eating your food. This medicine will help reduce your fever. If you have headache or body pain, this will also help. Please complete the full course. Do not stop taking the medicine even if you feel better.",
  hindi: "पैरासिटामोल दिन में दो बार लें, एक बार सुबह और एक बार रात को, खाना खाने के बाद। यह दवा आपका बुखार कम करने में मदद करेगी। अगर सिरदर्द या बदन दर्द है तो यह भी मदद करेगी।",
  marathi: "पॅरासिटामॉल दिवसातून दोनदा घ्या, एकदा सकाळी आणि एकदा रात्री, जेवणानंतर. हे औषध तुमचा ताप कमी करण्यास मदत करेल.",
};

export default function VoiceAssistantPage() {
  const [playing, setPlaying] = useState(false);
  const [lang, setLang] = useState<"english" | "hindi" | "marathi">("english");
  const [customText, setCustomText] = useState("");

  const speak = (text: string) => {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.8;
    u.pitch = 1.05;
    u.onend = () => setPlaying(false);
    setPlaying(true);
    speechSynthesis.speak(u);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setPlaying(false);
  };

  const textToSpeak = customText || sampleTexts[lang];

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">🔊 Voice Assistant</h1>
        <p className="text-muted-foreground mb-6">Listen to medical advice in your language</p>

        <div className="flex gap-3 mb-6 flex-wrap">
          {(["english", "hindi", "marathi"] as const).map((l) => (
            <button
              key={l}
              onClick={() => { setLang(l); setCustomText(""); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                lang === l ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-card mb-6">
          <textarea
            value={customText || sampleTexts[lang]}
            onChange={(e) => setCustomText(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-secondary outline-none resize-none mb-4"
          />

          <div className="flex justify-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => playing ? stop() : speak(textToSpeak)}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-primary-foreground transition-all ${playing ? "bg-health-red" : "gradient-hero"}`}
            >
              {playing ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
            </motion.button>
            <button onClick={stop} className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-all">
              <VolumeX className="w-6 h-6" />
            </button>
            <button onClick={() => speak(textToSpeak)} className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-all">
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>

          {playing && (
            <div className="flex justify-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [8, 24, 8] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                  className="w-1.5 rounded-full bg-secondary"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
