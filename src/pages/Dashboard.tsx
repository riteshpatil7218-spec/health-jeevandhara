import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText, Stethoscope, Users, Truck, History, Globe, Mic, CalendarDays,
  Activity, UserCheck, TrendingUp, HeartPulse,
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import FeatureCard from "@/components/FeatureCard";

const stats = [
  { label: "Patients Helped", value: "12,847", icon: UserCheck, color: "text-health-green" },
  { label: "Prescriptions Analyzed", value: "8,392", icon: FileText, color: "text-secondary" },
  { label: "Risk Alerts", value: "1,205", icon: Activity, color: "text-health-amber" },
  { label: "Active Doctors", value: "342", icon: HeartPulse, color: "text-cyan-bright" },
];

const features = [
  { icon: <FileText className="w-6 h-6" />, title: "Upload Prescription", desc: "AI-powered prescription analysis", path: "/prescription" },
  { icon: <Stethoscope className="w-6 h-6" />, title: "Symptom Checker", desc: "Check your symptoms with AI", path: "/symptoms" },
  { icon: <Activity className="w-6 h-6" />, title: "Risk Analysis", desc: "Detect health risk levels", path: "/symptoms" },
  { icon: <Users className="w-6 h-6" />, title: "Find Doctors", desc: "Browse verified doctors nearby", path: "/doctors" },
  { icon: <CalendarDays className="w-6 h-6" />, title: "Book Appointment", desc: "Schedule doctor visit", path: "/doctors" },
  { icon: <Globe className="w-6 h-6" />, title: "Translation", desc: "Hindi, Marathi, Tamil support", path: "/translation" },
  { icon: <Mic className="w-6 h-6" />, title: "Voice Assistant", desc: "Listen to medical advice", path: "/voice" },
  { icon: <Truck className="w-6 h-6" />, title: "Medicine Delivery", desc: "Order from nearby pharmacies", path: "/delivery" },
  { icon: <History className="w-6 h-6" />, title: "Medical History", desc: "View past records", path: "/history" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="gradient-hero py-12 px-4">
        <div className="container mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground mb-2">
              Welcome to <span className="text-gradient">Jeevandhara</span>
            </h1>
            <p className="text-primary-foreground/70 text-lg">AI-Powered Healthcare for Every Village</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-primary-foreground/10"
              >
                <s.icon className={`w-6 h-6 mx-auto mb-2 ${s.color}`} />
                <p className="text-2xl font-bold text-primary-foreground">{s.value}</p>
                <p className="text-xs text-primary-foreground/60">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-12">
          {features.map((f, i) => (
            <FeatureCard
              key={f.title}
              icon={f.icon}
              title={f.title}
              description={f.desc}
              onClick={() => navigate(f.path)}
              delay={i * 0.05}
            />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
