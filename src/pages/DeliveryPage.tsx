import { useState } from "react";
import { motion } from "framer-motion";
import { Truck, Package, MapPin, Clock, CheckCircle, ShoppingCart, RefreshCw } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { pharmacies } from "@/data/doctors";

const trackingSteps = [
  { label: "Order Placed", icon: ShoppingCart },
  { label: "Packed", icon: Package },
  { label: "Out for Delivery", icon: Truck },
  { label: "Delivered", icon: CheckCircle },
];

export default function DeliveryPage() {
  const [order, setOrder] = useState<typeof pharmacies[0] | null>(null);
  const [trackStep, setTrackStep] = useState(0);
  const [ordering, setOrdering] = useState(false);

  const placeOrder = (pharmacy: typeof pharmacies[0]) => {
    setOrdering(true);
    setTimeout(() => {
      setOrder(pharmacy);
      setOrdering(false);
      setTrackStep(0);
      // Simulate delivery steps
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setTrackStep(step);
        if (step >= 3) clearInterval(interval);
      }, 3000);
    }, 1500);
  };

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">🚚 Medicine Delivery</h1>
        <p className="text-muted-foreground mb-6">Order medicines from nearby pharmacies</p>

        {!order ? (
          <div className="space-y-4">
            {pharmacies.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">{p.name}</h3>
                    <div className="flex gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {p.location} • {p.distance} km</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {p.deliveryTime}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => placeOrder(p)}
                    disabled={ordering}
                    className="px-5 py-2.5 rounded-xl gradient-accent text-accent-foreground font-medium hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {ordering ? "Ordering..." : "Order"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">Order from {order.name}</h3>
                <p className="text-sm text-muted-foreground">📍 {order.location} • ETA: {order.deliveryTime}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-health-green/10 text-health-green text-sm font-medium">Active</span>
            </div>

            <div className="space-y-6 mb-6">
              {trackingSteps.map((s, i) => (
                <div key={s.label} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    i <= trackStep ? "gradient-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${i <= trackStep ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</p>
                    {i <= trackStep && i === trackStep && i < 3 && (
                      <p className="text-xs text-muted-foreground animate-pulse">In progress...</p>
                    )}
                    {i <= trackStep && i === 3 && (
                      <p className="text-xs text-health-green">Completed</p>
                    )}
                  </div>
                  {i < 3 && <div className={`h-px w-8 ${i < trackStep ? "bg-health-green" : "bg-border"}`} />}
                </div>
              ))}
            </div>

            {trackStep >= 1 && (
              <div className="p-4 rounded-xl bg-muted mb-4">
                <p className="text-sm font-medium text-foreground">🛵 Delivery Agent: Rahul</p>
                <p className="text-xs text-muted-foreground">Arriving in ~{Math.max(5, 25 - trackStep * 8)} mins</p>
              </div>
            )}

            <button
              onClick={() => { setOrder(null); setTrackStep(0); }}
              className="flex items-center gap-2 text-sm text-secondary font-medium hover:underline"
            >
              <RefreshCw className="w-4 h-4" /> Order Again
            </button>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}
