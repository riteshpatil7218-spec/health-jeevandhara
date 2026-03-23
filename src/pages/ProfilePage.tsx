import { motion } from "framer-motion";
import { User, Phone, MapPin, BadgeCheck, LogOut, Mail } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

interface ProfilePageProps {
  location: string;
  onLogout: () => void;
}

export default function ProfilePage({ location, onLogout }: ProfilePageProps) {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">👤 My Profile</h1>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6 shadow-card mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center text-primary-foreground">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Rajesh Kumar</h2>
              <p className="text-muted-foreground text-sm">Patient ID: JD-28491</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
              <Phone className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-sm font-medium text-foreground">+91 98765 43210</p>
                <span className="text-xs flex items-center gap-1 text-health-green"><BadgeCheck className="w-3 h-3" /> Verified</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
              <MapPin className="w-5 h-5 text-health-green" />
              <p className="text-sm font-medium text-foreground">{location}</p>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
              <Mail className="w-5 h-5 text-health-amber" />
              <p className="text-sm font-medium text-foreground">rajesh.kumar@email.com</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Prescriptions", value: "12" },
            { label: "Appointments", value: "8" },
            { label: "Saved Doctors", value: "5" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border p-4 text-center shadow-card"
            >
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <button onClick={onLogout} className="w-full py-3.5 rounded-xl border-2 border-health-red text-health-red font-semibold flex items-center justify-center gap-2 hover:bg-health-red/5 transition-all">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </PageWrapper>
  );
}
