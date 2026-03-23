import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Phone, Lock, Eye, EyeOff, User, ArrowRight, CheckCircle } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [step, setStep] = useState<"phone" | "otp" | "signup">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [name, setName] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();

  const sendOtp = () => {
    if (phone.length < 10) return;
    setStep("otp");
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
    if (newOtp.every(d => d !== "")) {
      setTimeout(() => verifyOtp(), 300);
    }
  };

  const verifyOtp = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      setTimeout(() => {
        onLogin();
        navigate("/");
      }, 1200);
    }, 1500);
  };

  return (
    <PageWrapper>
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-3xl shadow-xl w-full max-w-md overflow-hidden"
        >
          <div className="gradient-hero p-8 text-center">
            <Heart className="w-12 h-12 text-cyan-bright mx-auto mb-3" fill="currentColor" />
            <h1 className="text-2xl font-bold text-primary-foreground">Jeevandhara</h1>
            <p className="text-primary-foreground/70 text-sm mt-1">AI Healthcare for Rural India</p>
          </div>

          <div className="p-8">
            {verified ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-health-green mx-auto mb-4" />
                <p className="text-lg font-bold text-foreground">Verification Successful!</p>
                <p className="text-muted-foreground text-sm mt-1">Redirecting to dashboard...</p>
              </motion.div>
            ) : step === "phone" ? (
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Mobile Number</label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-3 rounded-xl bg-muted text-muted-foreground text-sm font-medium">+91</span>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="Enter 10-digit number"
                      className="flex-1 px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-secondary outline-none text-lg"
                      type="tel"
                    />
                  </div>
                </div>
                <button
                  onClick={sendOtp}
                  disabled={phone.length < 10}
                  className="w-full py-3.5 rounded-xl gradient-hero text-primary-foreground font-semibold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  Send OTP <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-xs text-center text-muted-foreground">Demo Mode: Any OTP will work</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">OTP sent to +91 {phone}</p>
                </div>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !digit && i > 0) {
                          document.getElementById(`otp-${i - 1}`)?.focus();
                        }
                      }}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-input bg-background text-foreground focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
                      type="tel"
                      maxLength={1}
                    />
                  ))}
                </div>
                {verifying && (
                  <div className="text-center">
                    <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Verifying OTP...</p>
                  </div>
                )}
                <div className="text-center text-sm">
                  {timer > 0 ? (
                    <span className="text-muted-foreground">Resend OTP in {timer}s</span>
                  ) : (
                    <button onClick={() => { setTimer(30); }} className="text-secondary font-medium hover:underline">Resend OTP</button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
