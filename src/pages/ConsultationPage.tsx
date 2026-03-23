import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, PhoneOff, Mic, MicOff, Send, Video, VideoOff, MessageCircle } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

const doctors = [
  { name: "Dr. Anjali Sharma", spec: "General Physician", available: true },
  { name: "Dr. Rohan Mehta", spec: "Cardiologist", available: true },
  { name: "Dr. Sneha Patil", spec: "Pediatrician", available: false },
];

type Mode = "select" | "audio" | "chat";
interface Msg { role: "user" | "doctor"; text: string }

export default function ConsultationPage() {
  const [mode, setMode] = useState<Mode>("select");
  const [selectedDoc, setSelectedDoc] = useState(doctors[0]);
  const [callState, setCallState] = useState<"idle" | "connecting" | "active" | "ended">("idle");
  const [muted, setMuted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([{ role: "doctor", text: "Hello! How can I help you today?" }]);
  const [chatInput, setChatInput] = useState("");
  let timerInterval: ReturnType<typeof setInterval>;

  const startCall = () => {
    setCallState("connecting");
    setTimeout(() => {
      setCallState("active");
      setTimer(0);
      timerInterval = setInterval(() => setTimer(t => t + 1), 1000);
    }, 2000);
  };

  const endCall = () => {
    setCallState("ended");
    clearInterval(timerInterval);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: chatInput }]);
    setChatInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "doctor", text: "I understand. Let me review that. Can you tell me more about how long this has been happening?" }]);
    }, 1500);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">👨‍⚕️ Doctor Consultation</h1>
        <p className="text-muted-foreground mb-6">Connect with doctors via audio call or chat</p>

        {mode === "select" && (
          <div className="space-y-4">
            {doctors.map((doc, i) => (
              <motion.div
                key={doc.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border p-5 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">{doc.name}</h3>
                    <p className="text-sm text-muted-foreground">{doc.spec}</p>
                    <span className={`text-xs font-medium ${doc.available ? "text-health-green" : "text-health-amber"}`}>
                      {doc.available ? "● Available Now" : "● Busy"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedDoc(doc); setMode("audio"); }}
                      disabled={!doc.available}
                      className="p-3 rounded-xl gradient-hero text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-all"
                    >
                      <Phone className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => { setSelectedDoc(doc); setMode("chat"); }}
                      disabled={!doc.available}
                      className="p-3 rounded-xl gradient-accent text-accent-foreground disabled:opacity-50 hover:opacity-90 transition-all"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <button
                      disabled
                      className="p-3 rounded-xl bg-muted text-muted-foreground relative"
                      title="Video consultation coming soon"
                    >
                      <VideoOff className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 text-[9px] bg-health-amber text-accent-foreground px-1 rounded-full font-medium">Soon</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {mode === "audio" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="gradient-hero p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4 text-3xl">👨‍⚕️</div>
              <h3 className="text-lg font-bold text-primary-foreground">{selectedDoc.name}</h3>
              <p className="text-primary-foreground/70 text-sm">{selectedDoc.spec}</p>
              <p className="text-primary-foreground/80 text-lg mt-3 font-mono">
                {callState === "connecting" ? "Connecting..." : callState === "active" ? formatTime(timer) : callState === "ended" ? "Call Ended" : "Ready"}
              </p>
              {callState === "connecting" && <div className="w-8 h-8 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin mx-auto mt-3" />}
            </div>
            <div className="p-6 flex justify-center gap-4">
              {callState === "idle" && (
                <button onClick={startCall} className="p-4 rounded-full bg-health-green text-accent-foreground hover:opacity-90 transition-all">
                  <Phone className="w-6 h-6" />
                </button>
              )}
              {callState === "active" && (
                <>
                  <button onClick={() => setMuted(!muted)} className={`p-4 rounded-full transition-all ${muted ? "bg-health-red text-destructive-foreground" : "bg-muted text-foreground"}`}>
                    {muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  <button onClick={endCall} className="p-4 rounded-full bg-health-red text-destructive-foreground hover:opacity-90 transition-all">
                    <PhoneOff className="w-6 h-6" />
                  </button>
                </>
              )}
              {(callState === "ended" || callState === "idle") && (
                <button onClick={() => { setMode("select"); setCallState("idle"); }} className="px-5 py-3 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-all">
                  Back to Doctors
                </button>
              )}
            </div>
          </motion.div>
        )}

        {mode === "chat" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="gradient-hero px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-primary-foreground font-bold">{selectedDoc.name}</p>
                <p className="text-primary-foreground/70 text-sm">{selectedDoc.spec}</p>
              </div>
              <button onClick={() => setMode("select")} className="text-primary-foreground/70 hover:text-primary-foreground text-sm">✕ End</button>
            </div>
            <div className="h-[350px] overflow-y-auto p-5 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                    m.role === "user" ? "gradient-hero text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border p-4 flex gap-3">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat()} placeholder="Type a message..." className="flex-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-secondary outline-none" />
              <button onClick={sendChat} className="px-5 py-3 rounded-xl gradient-hero text-primary-foreground font-medium disabled:opacity-50 transition-all"><Send className="w-5 h-5" /></button>
            </div>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}
