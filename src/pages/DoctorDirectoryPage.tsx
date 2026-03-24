import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, MapPin, BadgeCheck, Filter, CalendarDays, X, SlidersHorizontal } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { generateDoctors, Doctor } from "@/data/doctors";
import { Slider } from "@/components/ui/slider";

const allDoctors = generateDoctors();
const specializations = [...new Set(allDoctors.map(d => d.specialization))].sort();

interface ActiveFilters {
  radius: number;
  feesMin: number;
  feesMax: number;
  minRating: number;
  type: "" | "Government" | "Private";
  specialization: string;
  sort: "distance" | "rating" | "fees";
}

const defaultFilters: ActiveFilters = {
  radius: 10,
  feesMin: 100,
  feesMax: 2000,
  minRating: 0,
  type: "",
  specialization: "",
  sort: "distance",
};

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
      {label}
      <X className="w-3 h-3 cursor-pointer hover:text-foreground" onClick={onRemove} />
    </span>
  );
}

export default function DoctorDirectoryPage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ActiveFilters>({ ...defaultFilters });
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [visibleCount, setVisibleCount] = useState(30);

  const updateFilter = <K extends keyof ActiveFilters>(key: K, value: ActiveFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setVisibleCount(30);
  };

  const clearFilters = () => {
    setFilters({ ...defaultFilters });
    setSearch("");
  };

  const activeChips = useMemo(() => {
    const chips: { label: string; clear: () => void }[] = [];
    if (filters.radius !== 10) chips.push({ label: `Within ${filters.radius} km`, clear: () => updateFilter("radius", 10) });
    if (filters.feesMin > 100 || filters.feesMax < 2000) chips.push({ label: `₹${filters.feesMin}–₹${filters.feesMax}`, clear: () => { updateFilter("feesMin", 100); updateFilter("feesMax", 2000); } });
    if (filters.minRating > 0) chips.push({ label: `${filters.minRating}★+`, clear: () => updateFilter("minRating", 0) });
    if (filters.type) chips.push({ label: filters.type, clear: () => updateFilter("type", "") });
    if (filters.specialization) chips.push({ label: filters.specialization, clear: () => updateFilter("specialization", "") });
    return chips;
  }, [filters]);

  const filtered = useMemo(() => {
    let docs = allDoctors.filter(d => {
      if (d.distance > filters.radius) return false;
      if (d.fees < filters.feesMin || d.fees > filters.feesMax) return false;
      if (d.rating < filters.minRating) return false;
      if (filters.specialization && d.specialization !== filters.specialization) return false;
      if (filters.type && d.type !== filters.type) return false;
      if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.specialization.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    docs.sort((a, b) => {
      if (filters.sort === "distance") return a.distance - b.distance;
      if (filters.sort === "rating") return b.rating - a.rating;
      return a.fees - b.fees;
    });
    return docs;
  }, [search, filters]);

  const confirmBooking = () => {
    setBookingConfirmed(true);
    setTimeout(() => { setSelectedDoctor(null); setBookingStep(0); setBookingConfirmed(false); setBookingDate(""); setBookingTime(""); }, 3000);
  };

  const timeSlots = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "2:00 PM", "2:30 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Radius */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-3 block">📍 Doctors within {filters.radius} km</label>
        <Slider value={[filters.radius]} onValueChange={([v]) => updateFilter("radius", v)} min={1} max={50} step={1} className="w-full" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1 km</span><span>50 km</span></div>
      </div>

      {/* Fees */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-3 block">💰 Fees: ₹{filters.feesMin} – ₹{filters.feesMax}</label>
        <Slider value={[filters.feesMin, filters.feesMax]} onValueChange={([min, max]) => { updateFilter("feesMin", min); updateFilter("feesMax", max); }} min={100} max={2000} step={50} className="w-full" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>₹100</span><span>₹2000</span></div>
      </div>

      {/* Rating */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-3 block">⭐ Minimum Rating</label>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map(r => (
            <button key={r} onClick={() => updateFilter("minRating", r)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all click-scale ${filters.minRating === r ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
              {r === 0 ? "Any" : `${r}★+`}
            </button>
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-3 block">🏥 Type</label>
        <div className="flex gap-2">
          {(["", "Government", "Private"] as const).map(t => (
            <button key={t} onClick={() => updateFilter("type", t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all click-scale ${filters.type === t ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
              {t || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Specialization */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-3 block">🩺 Specialization</label>
        <select value={filters.specialization} onChange={(e) => updateFilter("specialization", e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring outline-none">
          <option value="">All Specializations</option>
          {specializations.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="text-sm font-semibold text-foreground mb-3 block">🔃 Sort By</label>
        <div className="flex gap-2 flex-wrap">
          {([["distance", "Nearest"], ["rating", "Top Rated"], ["fees", "Lowest Fees"]] as const).map(([val, label]) => (
            <button key={val} onClick={() => updateFilter("sort", val)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all click-scale ${filters.sort === val ? "gradient-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeChips.length > 0 && (
        <button onClick={clearFilters} className="w-full py-2.5 rounded-xl border border-destructive text-destructive text-sm font-medium hover:bg-destructive/5 transition-all">
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">🏥 Doctor Directory</h1>
        <p className="text-muted-foreground mb-6">Find verified doctors near you — {filtered.length} results</p>

        {/* Search bar */}
        <div className="mb-4">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search doctors by name or specialization..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none shadow-card" />
            </div>
            {/* Mobile filter toggle */}
            <button onClick={() => setShowMobileFilters(true)}
              className="lg:hidden px-4 py-3 rounded-xl gradient-hero text-primary-foreground flex items-center gap-2 click-scale">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeChips.map((c, i) => <FilterChip key={i} label={c.label} onRemove={c.clear} />)}
            <button onClick={clearFilters} className="text-xs text-destructive hover:underline font-medium px-2">Clear all</button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Desktop filter panel */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="bg-card rounded-2xl border border-border p-5 shadow-card sticky top-24">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</h3>
              <FilterPanel />
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-bold text-foreground mb-2">No doctors found</h3>
                <p className="text-muted-foreground text-sm">Try increasing the radius or adjusting filters</p>
                <button onClick={clearFilters} className="mt-4 px-5 py-2.5 rounded-xl gradient-hero text-primary-foreground text-sm font-medium click-scale">Reset Filters</button>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.slice(0, visibleCount).map((doc, i) => (
                    <motion.div key={doc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}
                      className="bg-card rounded-2xl border border-border p-5 shadow-card hover-lift click-scale cursor-pointer transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-foreground flex items-center gap-1.5">
                            {doc.name}
                            {doc.verified && <BadgeCheck className="w-4 h-4 text-secondary" />}
                          </h3>
                          <p className="text-sm text-muted-foreground">{doc.specialization}</p>
                        </div>
                        {doc.badge && <span className="text-xs px-2 py-1 rounded-full bg-health-green/10 text-health-green font-medium">{doc.badge}</span>}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-health-amber fill-health-amber" /> {doc.rating} ({doc.reviews})</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {doc.distance} km</span>
                        <span>{doc.experience} yrs exp</span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-foreground">₹{doc.fees}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${doc.type === "Government" ? "bg-health-green/10 text-health-green" : "bg-secondary/10 text-secondary"}`}>{doc.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium ${doc.availability === "Available" ? "text-health-green" : "text-health-amber"}`}>
                          {doc.availability === "Available" ? `Available in ${doc.nextSlot}` : "Busy"}
                        </span>
                        <button onClick={() => { setSelectedDoctor(doc); setBookingStep(1); }}
                          className="px-4 py-2 rounded-xl gradient-hero text-primary-foreground text-sm font-medium hover:opacity-90 transition-all click-scale">
                          Book
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {visibleCount < filtered.length && (
                  <div className="text-center mt-6">
                    <button onClick={() => setVisibleCount(v => v + 30)} className="px-6 py-3 rounded-xl border border-input bg-card text-foreground font-medium hover:bg-muted transition-all click-scale">
                      Load More ({filtered.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile filter drawer */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed inset-x-0 bottom-0 z-50 bg-card rounded-t-3xl border-t border-border p-6 max-h-[85vh] overflow-y-auto">
                <div className="w-12 h-1.5 rounded-full bg-muted mx-auto mb-4" />
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-foreground">Filters</h3>
                  <button onClick={() => setShowMobileFilters(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                </div>
                <FilterPanel />
                <button onClick={() => setShowMobileFilters(false)} className="w-full mt-6 py-3.5 rounded-xl gradient-hero text-primary-foreground font-semibold click-scale">
                  Show {filtered.length} Results
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Booking Modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl shadow-xl w-full max-w-md border border-border">
              <div className="p-6">
                {bookingConfirmed ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-full bg-health-green/10 flex items-center justify-center mx-auto mb-4"><CalendarDays className="w-8 h-8 text-health-green" /></div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Booking Confirmed!</h3>
                    <p className="text-muted-foreground text-sm">{selectedDoctor.name} • {bookingDate} • {bookingTime}</p>
                    <p className="text-xs text-muted-foreground mt-2">📍 {selectedDoctor.clinic}, {selectedDoctor.location}</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg font-bold text-foreground">Book Appointment</h3>
                      <button onClick={() => { setSelectedDoctor(null); setBookingStep(0); }} className="text-muted-foreground hover:text-foreground">✕</button>
                    </div>
                    <div className="p-4 rounded-xl bg-muted mb-5">
                      <p className="font-bold text-foreground">{selectedDoctor.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedDoctor.specialization} • ₹{selectedDoctor.fees}</p>
                      <p className="text-xs text-muted-foreground">📍 {selectedDoctor.clinic}, {selectedDoctor.location}</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Select Date</label>
                        <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-ring outline-none" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Select Time</label>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map(t => (
                            <button key={t} onClick={() => setBookingTime(t)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all click-scale ${bookingTime === t ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button onClick={confirmBooking} disabled={!bookingDate || !bookingTime}
                        className="w-full py-3.5 rounded-xl gradient-accent text-accent-foreground font-semibold hover:opacity-90 disabled:opacity-50 transition-all click-scale">
                        Confirm Booking
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
