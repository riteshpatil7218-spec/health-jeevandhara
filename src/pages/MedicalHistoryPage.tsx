import { motion } from "framer-motion";
import { FileText, Stethoscope, Calendar, Activity } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import RiskBadge from "@/components/RiskBadge";

const prescriptions = [
  { date: "2026-03-20", medicines: "Paracetamol, Amoxicillin", risk: "Moderate" as const },
  { date: "2026-03-15", medicines: "Omeprazole", risk: "Low" as const },
  { date: "2026-03-10", medicines: "Amlodipine, Metformin", risk: "High" as const },
  { date: "2026-02-28", medicines: "Cetirizine", risk: "Low" as const },
];

const appointments = [
  { date: "2026-03-22", doctor: "Dr. Anjali Sharma", spec: "General Physician", status: "Completed" },
  { date: "2026-03-18", doctor: "Dr. Rohan Mehta", spec: "Cardiologist", status: "Completed" },
  { date: "2026-03-25", doctor: "Dr. Sneha Patil", spec: "Pediatrician", status: "Upcoming" },
];

export default function MedicalHistoryPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">📋 Medical History</h1>
        <p className="text-muted-foreground mb-8">Your complete health timeline</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-secondary" /> Prescriptions</h2>
            <div className="space-y-3">
              {prescriptions.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-2xl border border-border p-4 shadow-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{p.date}</span>
                    <RiskBadge level={p.risk} />
                  </div>
                  <p className="text-sm font-medium text-foreground">💊 {p.medicines}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-health-green" /> Appointments</h2>
            <div className="space-y-3">
              {appointments.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-2xl border border-border p-4 shadow-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{a.date}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${a.status === "Upcoming" ? "bg-secondary/10 text-secondary" : "bg-health-green/10 text-health-green"}`}>
                      {a.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{a.doctor}</p>
                  <p className="text-xs text-muted-foreground">{a.spec}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-health-amber" /> Risk History</h2>
          <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <div className="flex items-end gap-3 h-32">
              {[40, 65, 30, 80, 45, 55, 25].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`flex-1 rounded-t-lg ${h > 70 ? "bg-health-red" : h > 50 ? "bg-health-amber" : "bg-health-green"}`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <span key={d}>{d}</span>)}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
