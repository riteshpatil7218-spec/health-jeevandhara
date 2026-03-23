import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, Send, AlertTriangle, ShieldCheck, Volume2 } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import RiskBadge from "@/components/RiskBadge";
import { analyzeSymptoms } from "@/data/prescriptionAI";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const questions = [
  "What symptoms are you experiencing?",
  "How long have you had these symptoms?",
  "On a scale of 1-10, how severe is the discomfort?",
  "Do you have any existing medical conditions?",
];

export default function SymptomCheckerPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your health assistant. " + questions[0] },
  ]);
  const [input, setInput] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [allSymptoms, setAllSymptoms] = useState("");
  const [result, setResult] = useState<ReturnType<typeof analyzeSymptoms> | null>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    const symptoms = allSymptoms + " " + userMsg;
    setAllSymptoms(symptoms);
    setInput("");

    if (qIndex < questions.length - 1) {
      const nextQ = qIndex + 1;
      setQIndex(nextQ);
      newMessages.push({ role: "assistant", content: questions[nextQ] });
      setMessages(newMessages);
    } else {
      newMessages.push({ role: "assistant", content: "Thank you. Analyzing your symptoms..." });
      setMessages(newMessages);
      setTimeout(() => {
        const analysis = analyzeSymptoms(symptoms);
        setResult(analysis);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Analysis complete. Your risk level is ${analysis.riskLevel}. ${analysis.reason}` },
        ]);
      }, 2000);
    }
  };

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.85;
    speechSynthesis.speak(u);
  };

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Stethoscope className="w-7 h-7 text-secondary" /> Symptom Checker
        </h1>
        <p className="text-muted-foreground mb-6">Describe your symptoms and our AI will assess your risk level</p>

        <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="h-[400px] overflow-y-auto p-5 space-y-3">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "gradient-hero text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="border-t border-border p-4 flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={result ? "Analysis complete" : "Type your response..."}
              disabled={!!result}
              className="flex-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-secondary outline-none disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || !!result}
              className="px-5 py-3 rounded-xl gradient-hero text-primary-foreground font-medium disabled:opacity-50 transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-card rounded-2xl border border-border p-6 shadow-card"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Risk Assessment</h2>
                <RiskBadge level={result.riskLevel} large />
              </div>

              {result.riskLevel === "High" && (
                <div className="p-4 rounded-xl bg-health-red/10 border border-health-red/30 flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-health-red flex-shrink-0 mt-0.5" />
                  <p className="text-health-red font-bold">🚨 URGENT: Visit doctor immediately</p>
                </div>
              )}

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-muted">
                  <p className="text-sm font-semibold text-foreground mb-1">Reason</p>
                  <p className="text-sm text-muted-foreground">{result.reason}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted">
                  <p className="text-sm font-semibold text-foreground mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-health-green" /> Advice
                  </p>
                  <p className="text-sm text-muted-foreground">{result.advice}</p>
                </div>
              </div>

              <button onClick={() => speak(`${result.reason}. ${result.advice}`)} className="mt-4 flex items-center gap-2 text-sm text-secondary font-medium hover:underline">
                <Volume2 className="w-4 h-4" /> Listen to Advice
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
