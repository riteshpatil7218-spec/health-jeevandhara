import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Phone, PhoneOff, Mic, MicOff, Send, Video, VideoOff, MessageCircle, Camera, CameraOff } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

const doctors = [
  { name: "Dr. Anjali Sharma", spec: "General Physician", available: true },
  { name: "Dr. Rohan Mehta", spec: "Cardiologist", available: true },
  { name: "Dr. Sneha Patil", spec: "Pediatrician", available: false },
];

type Mode = "select" | "audio" | "chat" | "video";
interface Msg { role: "user" | "doctor"; text: string; time: string }

const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function ConsultationPage() {
  const [mode, setMode] = useState<Mode>("select");
  const [selectedDoc, setSelectedDoc] = useState(doctors[0]);
  const [callState, setCallState] = useState<"idle" | "connecting" | "active" | "ended">("idle");
  const [muted, setMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [timer, setTimer] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([{ role: "doctor", text: "Hello! How can I help you today?", time: now() }]);
  const [chatInput, setChatInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const startCall = () => {
    setCallState("connecting");
    setTimeout(() => {
      setCallState("active");
      setTimer(0);
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    }, 2500);
  };

  const endCall = () => {
    setCallState("ended");
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: chatInput, time: now() }]);
    setChatInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { role: "doctor", text: "I understand. Let me review that. Can you tell me more about how long this has been happening?", time: now() }]);
    }, 2000);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const SpeakingIndicator = () => (
    <div className="flex items-end gap-0.5 h-5">
      {[0, 0.15, 0.3, 0.15, 0].map((d, i) => (
        <div key={i} className="w-1 bg-health-green rounded-full animate-speaking" style={{ animationDelay: `${d}s` }} />
      ))}
    </div>
  );

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">👨‍⚕️ Doctor Consultation</h1>
        <p className="text-muted-foreground mb-6">Connect with doctors via video, audio, or chat</p>

        {mode === "select" && (
          <div className="space-y-4">
            {doctors.map((doc, i) => (
              <motion.div key={doc.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border p-5 shadow-card hover-lift transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">{doc.name}</h3>
                    <p className="text-sm text-muted-foreground">{doc.spec}</p>
                    <span className={`text-xs font-medium ${doc.available ? "text-health-green" : "text-health-amber"}`}>
                      {doc.available ? "● Available Now" : "● Busy"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedDoc(doc); setMode("video"); }} disabled={!doc.available}
                      className="p-3 rounded-xl bg-secondary text-secondary-foreground disabled:opacity-50 hover:opacity-90 transition-all click-scale" title="Video Call (Beta)">
                      <Video className="w-5 h-5" />
                    </button>
                    <button onClick={() => { setSelectedDoc(doc); setMode("audio"); }} disabled={!doc.available}
                      className="p-3 rounded-xl gradient-hero text-primary-foreground disabled:opacity-50 hover:opacity-90 transition-all click-scale">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button onClick={() => { setSelectedDoc(doc); setMode("chat"); }} disabled={!doc.available}
                      className="p-3 rounded-xl gradient-accent text-accent-foreground disabled:opacity-50 hover:opacity-90 transition-all click-scale">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            <p className="text-xs text-muted-foreground text-center mt-2">💡 Video consultation is in beta — audio & chat recommended for stable experience</p>
          </div>
        )}

        {/* Video Call */}
        {mode === "video" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="relative bg-foreground/95 aspect-video flex items-center justify-center">
              {/* Doctor panel */}
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-3 text-4xl border-2 border-muted/30">👨‍⚕️</div>
                <h3 className="text-primary-foreground font-bold">{selectedDoc.name}</h3>
                <p className="text-primary-foreground/60 text-sm">{selectedDoc.spec}</p>
                {callState === "active" && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <SpeakingIndicator />
                    <span className="text-health-green text-xs font-medium">Live</span>
                  </div>
                )}
                {callState === "connecting" && (
                  <div className="mt-3">
                    <div className="w-8 h-8 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin mx-auto" />
                    <p className="text-primary-foreground/60 text-sm mt-2">Connecting...</p>
                  </div>
                )}
                {callState === "ended" && <p className="text-primary-foreground/60 text-sm mt-2">Call Ended</p>}
                {callState === "active" && <p className="text-primary-foreground/80 font-mono text-lg mt-2">{formatTime(timer)}</p>}
              </div>

              {/* Self view (small) */}
              {callState === "active" && cameraOn && (
                <div className="absolute bottom-4 right-4 w-28 h-20 rounded-xl bg-muted/30 border border-muted/20 flex items-center justify-center text-2xl">
                  🙋
                </div>
              )}

              {/* Beta badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-health-amber/20 text-health-amber text-xs font-medium backdrop-blur-sm">
                Beta
              </div>
            </div>

            <div className="p-5 flex justify-center gap-3">
              {callState === "idle" && (
                <button onClick={startCall} className="px-6 py-3 rounded-xl bg-health-green text-accent-foreground font-medium hover:opacity-90 transition-all click-scale flex items-center gap-2">
                  <Video className="w-5 h-5" /> Start Video Call
                </button>
              )}
              {callState === "active" && (
                <>
                  <button onClick={() => setMuted(!muted)} className={`p-3.5 rounded-xl transition-all click-scale ${muted ? "bg-health-red text-destructive-foreground" : "bg-muted text-foreground"}`}>
                    {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <button onClick={() => setCameraOn(!cameraOn)} className={`p-3.5 rounded-xl transition-all click-scale ${!cameraOn ? "bg-health-red text-destructive-foreground" : "bg-muted text-foreground"}`}>
                    {cameraOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
                  </button>
                  <button onClick={endCall} className="p-3.5 rounded-xl bg-health-red text-destructive-foreground hover:opacity-90 transition-all click-scale">
                    <PhoneOff className="w-5 h-5" />
                  </button>
                </>
              )}
              {(callState === "ended" || callState === "idle") && (
                <button onClick={() => { setMode("select"); setCallState("idle"); }} className="px-5 py-3 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-all click-scale">
                  Back to Doctors
                </button>
              )}
            </div>
            <p className="text-center text-xs text-muted-foreground pb-4">Video consultation in beta — use audio/chat for stable experience</p>
          </motion.div>
        )}

        {/* Audio Call */}
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
              {callState === "active" && <div className="flex justify-center mt-3"><SpeakingIndicator /></div>}
            </div>
            <div className="p-6 flex justify-center gap-4">
              {callState === "idle" && (
                <button onClick={startCall} className="p-4 rounded-full bg-health-green text-accent-foreground hover:opacity-90 transition-all click-scale">
                  <Phone className="w-6 h-6" />
                </button>
              )}
              {callState === "active" && (
                <>
                  <button onClick={() => setMuted(!muted)} className={`p-4 rounded-full transition-all click-scale ${muted ? "bg-health-red text-destructive-foreground" : "bg-muted text-foreground"}`}>
                    {muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  <button onClick={endCall} className="p-4 rounded-full bg-health-red text-destructive-foreground hover:opacity-90 transition-all click-scale">
                    <PhoneOff className="w-6 h-6" />
                  </button>
                </>
              )}
              {(callState === "ended" || callState === "idle") && (
                <button onClick={() => { setMode("select"); setCallState("idle"); }} className="px-5 py-3 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/80 transition-all click-scale">
                  Back to Doctors
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Chat */}
        {mode === "chat" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="gradient-hero px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-primary-foreground font-bold">{selectedDoc.name}</p>
                <p className="text-primary-foreground/70 text-sm">{selectedDoc.spec}</p>
              </div>
              <button onClick={() => setMode("select")} className="text-primary-foreground/70 hover:text-primary-foreground text-sm click-scale">✕ End</button>
            </div>
            <div className="h-[380px] overflow-y-auto p-5 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                      m.role === "user" ? "gradient-hero text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"
                    }`}>
                      {m.text}
                    </div>
                    <p className={`text-[10px] text-muted-foreground mt-1 ${m.role === "user" ? "text-right" : "text-left"}`}>{m.time}</p>
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot" />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              )}
              <div ref={chatEnd} />
            </div>
            <div className="border-t border-border p-4 flex gap-3">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none" />
              <button onClick={sendChat} className="px-5 py-3 rounded-xl gradient-hero text-primary-foreground font-medium disabled:opacity-50 transition-all click-scale">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}
