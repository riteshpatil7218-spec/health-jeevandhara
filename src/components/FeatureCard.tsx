import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  delay?: number;
  gradient?: string;
}

export default function FeatureCard({ icon, title, description, onClick, delay = 0, gradient }: FeatureCardProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}
      whileTap={{ scale: 0.98 }}
      className={`group w-full text-left p-6 rounded-2xl border border-border transition-all duration-300 ${gradient || "bg-card"} shadow-card hover:shadow-card-hover`}
    >
      <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center text-primary-foreground mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.button>
  );
}
