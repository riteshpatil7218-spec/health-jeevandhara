import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Star, MapPin, BadgeCheck, Filter, CalendarDays } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { generateDoctors, Doctor } from "@/data/doctors";

const allDoctors = generateDoctors();
const specializations = [...new Set(allDoctors.map(d => d.specialization))].sort();

export default function DoctorDirectoryPage() {
  const [search, setSearch] = useState("");
  const [specFilter, setSpecFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"" | "Government" | "Private">("");
  const [radiusFilter, setRadiusFilter] = useState(10);
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "fees">("distance");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let docs = allDoctors.filter(d => {
      if (d.distance > radiusFilter) return false;
      if (specFilter && d.specialization !== specFilter) return false;
      if (typeFilter && d.type !== typeFilter) return false;
      if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.specialization.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    docs.sort((a, b) => {
      if (sortBy === "distance") return a.distance - b.distance;
      if (sortBy === "rating") return b.rating - a.rating;
      return a.fees - b.fees;
    });
    return docs;
  }, [search, specFilter, typeFilter, radiusFilter, sortBy]);

  const confirmBooking = () => {
    setBookingConfirmed(true);
    setTimeout(() => {
      setSelectedDoctor(null);
      setBookingStep(0);
      setBookingConfirmed(false);
      setBookingDate("");
      setBookingTime("");
    }, 3000);
  };

  const timeSlots = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "2:00 PM", "2:30 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">🏥 Doctor Directory</h1>
        <p className="text-muted-foreground mb-6">Find verified doctors near you — {filtered.length} results</p>

        {/* Search & Filter */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-card mb-6">
          <div className="flex gap-3 flex-wrap items-center">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search doctors..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-secondary outline-none" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="px-4 py-3 rounded-xl border border-input bg-background text-foreground flex items-center gap-2 hover:bg-muted transition-all">
              <Filter className="w-5 h-5" /> Filters
            </button>
          </div>

          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <select value={specFilter} onChange={(e) => setSpecFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm">
                <option value="">All Specializations</option>
                {specializations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className="px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm">
                <option value="">All Types</option>
                <option value="Government">Government</option>
                <option value="Private">Private</option>
              </select>
              <select value={radiusFilter} onChange={(e) => setRadiusFilter(+e.target.value)} className="px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm">
                <option value={1}>Within 1 km</option>
                <option value={3}>Within 3 km</option>
                <option value={5}>Within 5 km</option>
                <option value={10}>Within 10 km</option>
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm">
                <option value="distance">Nearest</option>
                <option value="rating">Highest Rated</option>
                <option value="fees">Lowest Fees</option>
              </select>
            </motion.div>
          )}
        </div>

        {/* Doctor List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.slice(0, 30).map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-foreground flex items-center gap-1.5">
                    {doc.name}
                    {doc.verified && <BadgeCheck className="w-4 h-4 text-secondary" />}
                  </h3>
                  <p className="text-sm text-muted-foreground">{doc.specialization}</p>
                </div>
                {doc.badge && (
                  <span className="text-xs px-2 py-1 rounded-full bg-health-green/10 text-health-green font-medium">{doc.badge}</span>
                )}
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
                <button
                  onClick={() => { setSelectedDoctor(doc); setBookingStep(1); }}
                  className="px-4 py-2 rounded-xl gradient-hero text-primary-foreground text-sm font-medium hover:opacity-90 transition-all"
                >
                  Book
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Booking Modal */}
        {selectedDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-2xl shadow-xl w-full max-w-md border border-border"
            >
              <div className="p-6">
                {bookingConfirmed ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-full bg-health-green/10 flex items-center justify-center mx-auto mb-4">
                      <CalendarDays className="w-8 h-8 text-health-green" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Booking Confirmed!</h3>
                    <p className="text-muted-foreground text-sm">
                      {selectedDoctor.name} • {bookingDate} • {bookingTime}
                    </p>
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
                        <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-secondary outline-none" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Select Time</label>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map(t => (
                            <button
                              key={t}
                              onClick={() => setBookingTime(t)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                bookingTime === t ? "gradient-hero text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={confirmBooking}
                        disabled={!bookingDate || !bookingTime}
                        className="w-full py-3.5 rounded-xl gradient-accent text-accent-foreground font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
                      >
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
