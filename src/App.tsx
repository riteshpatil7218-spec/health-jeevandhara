import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import LocationModal from "@/components/LocationModal";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import PrescriptionPage from "@/pages/PrescriptionPage";
import SymptomCheckerPage from "@/pages/SymptomCheckerPage";
import DoctorDirectoryPage from "@/pages/DoctorDirectoryPage";
import ConsultationPage from "@/pages/ConsultationPage";
import DeliveryPage from "@/pages/DeliveryPage";
import MedicalHistoryPage from "@/pages/MedicalHistoryPage";
import TranslationPage from "@/pages/TranslationPage";
import VoiceAssistantPage from "@/pages/VoiceAssistantPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLocation, setUserLocation] = useState("Kothrud, Pune");
  const [locationOpen, setLocationOpen] = useState(false);

  const handleLogout = () => setIsLoggedIn(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {isLoggedIn && (
            <Navbar
              location={userLocation}
              onLocationChange={() => setLocationOpen(true)}
              isLoggedIn={isLoggedIn}
              onLogout={handleLogout}
            />
          )}
          <LocationModal
            open={locationOpen}
            onClose={() => setLocationOpen(false)}
            onSelect={setUserLocation}
            current={userLocation}
          />
          <Routes>
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <LoginPage onLogin={() => setIsLoggedIn(true)} />} />
            <Route path="/" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/prescription" element={isLoggedIn ? <PrescriptionPage /> : <Navigate to="/login" />} />
            <Route path="/symptoms" element={isLoggedIn ? <SymptomCheckerPage /> : <Navigate to="/login" />} />
            <Route path="/doctors" element={isLoggedIn ? <DoctorDirectoryPage /> : <Navigate to="/login" />} />
            <Route path="/consultation" element={isLoggedIn ? <ConsultationPage /> : <Navigate to="/login" />} />
            <Route path="/delivery" element={isLoggedIn ? <DeliveryPage /> : <Navigate to="/login" />} />
            <Route path="/history" element={isLoggedIn ? <MedicalHistoryPage /> : <Navigate to="/login" />} />
            <Route path="/translation" element={isLoggedIn ? <TranslationPage /> : <Navigate to="/login" />} />
            <Route path="/voice" element={isLoggedIn ? <VoiceAssistantPage /> : <Navigate to="/login" />} />
            <Route path="/profile" element={isLoggedIn ? <ProfilePage location={userLocation} onLogout={handleLogout} /> : <Navigate to="/login" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
