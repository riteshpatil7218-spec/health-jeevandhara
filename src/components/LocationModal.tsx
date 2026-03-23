import { useState } from "react";
import { MapPin, X, Navigation } from "lucide-react";

interface LocationModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (location: string) => void;
  current: string;
}

const areas = [
  "Kothrud, Pune", "Hinjewadi, Pune", "Wakad, Pune", "Baner, Pune",
  "Shivajinagar, Pune", "Hadapsar, Pune", "Viman Nagar, Pune",
  "Pimpri-Chinchwad, Pune", "Aundh, Pune", "Deccan, Pune",
];

export default function LocationModal({ open, onClose, onSelect, current }: LocationModalProps) {
  const [search, setSearch] = useState("");
  const [detecting, setDetecting] = useState(false);

  const filtered = areas.filter(a => a.toLowerCase().includes(search.toLowerCase()));

  const detectLocation = () => {
    setDetecting(true);
    setTimeout(() => {
      onSelect("Kothrud, Pune");
      setDetecting(false);
      onClose();
    }, 1500);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl shadow-xl w-full max-w-md border border-border">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5 text-secondary" /> Set Location
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <button
            onClick={detectLocation}
            disabled={detecting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl gradient-accent text-accent-foreground font-semibold transition-all hover:opacity-90 disabled:opacity-60"
          >
            <Navigation className="w-5 h-5" />
            {detecting ? "Detecting your location..." : "Use My Location"}
          </button>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search area..."
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-secondary outline-none"
          />
          <div className="max-h-48 overflow-y-auto space-y-1">
            {filtered.map((area) => (
              <button
                key={area}
                onClick={() => { onSelect(area); onClose(); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                  current === area ? "bg-secondary/10 text-secondary font-semibold" : "text-foreground hover:bg-muted"
                }`}
              >
                📍 {area}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
