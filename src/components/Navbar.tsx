import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, MapPin, User, LogOut, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/prescription", label: "Prescription" },
  { path: "/symptoms", label: "Symptoms" },
  { path: "/doctors", label: "Doctors" },
  { path: "/consultation", label: "Consultation" },
  { path: "/delivery", label: "Delivery" },
  { path: "/history", label: "History" },
];

interface NavbarProps {
  location: string;
  onLocationChange: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Navbar({ location: userLocation, onLocationChange, isLoggedIn, onLogout }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 gradient-hero border-b border-primary/20 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="w-7 h-7 text-cyan-bright" fill="currentColor" />
            <span className="text-xl font-bold text-primary-foreground tracking-tight">Jeevandhara</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  loc.pathname === item.path
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLocationChange}
              className="flex items-center gap-1 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">{userLocation}</span>
            </button>
            {isLoggedIn && (
              <>
                <button onClick={() => navigate("/profile")} className="p-2 rounded-lg text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-all">
                  <User className="w-5 h-5" />
                </button>
                <button onClick={onLogout} className="p-2 rounded-lg text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-all">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-primary-foreground">
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden gradient-hero"
          >
            <div className="px-4 pb-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    loc.pathname === item.path
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "text-primary-foreground/70 hover:bg-primary-foreground/10"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
