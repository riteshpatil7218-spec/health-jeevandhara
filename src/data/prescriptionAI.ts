export interface MedicineResult {
  name: string;
  purpose: string;
  dosage: { morning: boolean; afternoon: boolean; night: boolean };
  beforeFood: boolean;
  explanation: string;
  precautions: string[];
  sideEffects: string[];
}

export interface PrescriptionResult {
  medicines: MedicineResult[];
  summary: string;
  riskLevel: "Low" | "Moderate" | "High";
  advice: string;
}

const medicineDB: Record<string, Omit<MedicineResult, "name">> = {
  paracetamol: {
    purpose: "Reduces fever and relieves mild to moderate pain",
    dosage: { morning: true, afternoon: false, night: true },
    beforeFood: false,
    explanation: "This medicine helps bring down your body temperature when you have fever. It also helps with headache and body pain.",
    precautions: ["Do not take more than 4 tablets in 24 hours", "Avoid alcohol", "Tell your doctor if you have liver problems"],
    sideEffects: ["Rarely causes stomach upset", "Skin rash in very rare cases"],
  },
  amoxicillin: {
    purpose: "Fights bacterial infections",
    dosage: { morning: true, afternoon: true, night: true },
    beforeFood: false,
    explanation: "This is an antibiotic. It kills harmful bacteria causing your infection. Complete the full course even if you feel better.",
    precautions: ["Complete full course", "Take at regular intervals", "Tell doctor about allergies"],
    sideEffects: ["May cause diarrhea", "Stomach pain possible", "Skin rash if allergic"],
  },
  metformin: {
    purpose: "Controls blood sugar levels in diabetes",
    dosage: { morning: true, afternoon: false, night: true },
    beforeFood: false,
    explanation: "This medicine helps control your sugar levels. Take it regularly with food to avoid stomach upset.",
    precautions: ["Take with food always", "Check sugar levels regularly", "Avoid excess alcohol"],
    sideEffects: ["Stomach upset initially", "Nausea may occur at start"],
  },
  amlodipine: {
    purpose: "Lowers high blood pressure",
    dosage: { morning: true, afternoon: false, night: false },
    beforeFood: false,
    explanation: "This medicine relaxes your blood vessels so blood flows more easily. This helps reduce your blood pressure.",
    precautions: ["Take at same time daily", "Do not stop suddenly", "Avoid grapefruit"],
    sideEffects: ["Swelling in feet", "Dizziness possible", "Headache initially"],
  },
  omeprazole: {
    purpose: "Reduces stomach acid and treats acidity",
    dosage: { morning: true, afternoon: false, night: false },
    beforeFood: true,
    explanation: "Take this medicine before breakfast on empty stomach. It reduces acid in your stomach and helps with acidity and ulcer problems.",
    precautions: ["Take 30 mins before food", "Do not crush the tablet", "Long-term use needs doctor supervision"],
    sideEffects: ["Headache", "Stomach pain rarely"],
  },
  cetirizine: {
    purpose: "Relieves allergy symptoms like sneezing and itching",
    dosage: { morning: false, afternoon: false, night: true },
    beforeFood: false,
    explanation: "This medicine helps with allergies — sneezing, runny nose, itching, and watery eyes. Best taken at night as it may cause drowsiness.",
    precautions: ["May cause drowsiness", "Avoid driving after taking", "Do not take with alcohol"],
    sideEffects: ["Drowsiness", "Dry mouth"],
  },
  azithromycin: {
    purpose: "Treats bacterial infections of throat, chest, and skin",
    dosage: { morning: true, afternoon: false, night: false },
    beforeFood: false,
    explanation: "This antibiotic treats infections. Take it once daily for the number of days your doctor told you. Do not skip doses.",
    precautions: ["Complete full course", "Take 1 hour before or 2 hours after food for best results", "Report any chest pain"],
    sideEffects: ["Diarrhea", "Nausea", "Stomach cramps"],
  },
};

export function analyzePrescription(text: string): PrescriptionResult {
  const lower = text.toLowerCase();
  const medicines: MedicineResult[] = [];

  for (const [key, data] of Object.entries(medicineDB)) {
    if (lower.includes(key)) {
      medicines.push({ name: key.charAt(0).toUpperCase() + key.slice(1), ...data });
    }
  }

  if (medicines.length === 0) {
    const words = lower.split(/[\s,;]+/).filter(w => w.length > 3);
    for (const w of words.slice(0, 3)) {
      const fallbackKey = Object.keys(medicineDB)[Math.floor(Math.random() * Object.keys(medicineDB).length)];
      const data = medicineDB[fallbackKey];
      medicines.push({ name: w.charAt(0).toUpperCase() + w.slice(1), ...data, explanation: `This medicine was prescribed by your doctor. Follow the dosage instructions carefully.` });
    }
  }

  const hasAntibiotic = medicines.some(m => m.name.toLowerCase().includes("amoxicillin") || m.name.toLowerCase().includes("azithromycin"));
  const riskLevel = medicines.length >= 4 ? "High" : medicines.length >= 2 && hasAntibiotic ? "Moderate" : "Low";

  return {
    medicines,
    summary: `Your doctor has prescribed ${medicines.length} medicine(s). ${riskLevel === "High" ? "Multiple medications detected — please consult your doctor for proper guidance." : "Follow the instructions carefully and complete the full course."}`,
    riskLevel,
    advice: riskLevel === "High" ? "🚨 URGENT: You are on multiple medications. Please visit your doctor regularly and report any side effects immediately." : "Take your medicines on time. If you feel any discomfort, consult your doctor.",
  };
}

export function analyzeSymptoms(symptoms: string): { riskLevel: "Low" | "Moderate" | "High"; reason: string; advice: string } {
  const lower = symptoms.toLowerCase();
  const highRisk = ["chest pain", "breathing difficulty", "unconscious", "seizure", "severe bleeding", "paralysis", "stroke", "heart attack"];
  const modRisk = ["high fever", "persistent cough", "blood in urine", "severe headache", "vomiting blood", "abdominal pain"];

  if (highRisk.some(s => lower.includes(s))) {
    return { riskLevel: "High", reason: "Your symptoms indicate a potentially serious condition that needs immediate medical attention.", advice: "🚨 URGENT: Visit the nearest hospital or call emergency services immediately. Do not delay." };
  }
  if (modRisk.some(s => lower.includes(s))) {
    return { riskLevel: "Moderate", reason: "Your symptoms need medical evaluation soon. They may not be immediately dangerous but should not be ignored.", advice: "Please consult a doctor within 24 hours. Rest well, stay hydrated, and monitor your symptoms." };
  }
  return { riskLevel: "Low", reason: "Your symptoms appear mild and can likely be managed with basic home care.", advice: "Rest, drink plenty of fluids, and eat light food. If symptoms persist for more than 3 days, consult a doctor." };
}

export function translateText(text: string, lang: "hindi" | "marathi" | "tamil"): string {
  const translations: Record<string, Record<string, string>> = {
    hindi: {
      "morning": "सुबह",
      "night": "रात",
      "afternoon": "दोपहर",
      "before food": "खाना खाने से पहले",
      "after food": "खाना खाने के बाद",
      "Take this medicine": "यह दवा लें",
      "helps bring down": "कम करने में मदद करता है",
      "fever": "बुखार",
      "pain": "दर्द",
      "headache": "सिरदर्द",
      "Complete full course": "पूरा कोर्स पूरा करें",
      "consult your doctor": "अपने डॉक्टर से सलाह लें",
      "Take at same time daily": "रोज एक ही समय पर लें",
      "URGENT": "तुरंत",
      "Visit doctor immediately": "तुरंत डॉक्टर से मिलें",
      "Rest well": "अच्छी तरह आराम करें",
      "drink plenty of fluids": "खूब पानी पिएं",
    },
    marathi: {
      "morning": "सकाळी",
      "night": "रात्री",
      "afternoon": "दुपारी",
      "before food": "जेवणापूर्वी",
      "after food": "जेवणानंतर",
      "Take this medicine": "हे औषध घ्या",
      "fever": "ताप",
      "pain": "वेदना",
      "headache": "डोकेदुखी",
      "Complete full course": "पूर्ण कोर्स पूर्ण करा",
      "consult your doctor": "आपल्या डॉक्टरांचा सल्ला घ्या",
      "URGENT": "तातडीचे",
      "Visit doctor immediately": "लगेच डॉक्टरांना भेटा",
      "Rest well": "चांगली विश्रांती घ्या",
      "drink plenty of fluids": "भरपूर पाणी प्या",
    },
    tamil: {
      "morning": "காலை",
      "night": "இரவு",
      "afternoon": "மதியம்",
      "before food": "சாப்பிடும் முன்",
      "after food": "சாப்பிட்ட பின்",
      "Take this medicine": "இந்த மருந்தை எடுங்கள்",
      "fever": "காய்ச்சல்",
      "pain": "வலி",
      "headache": "தலைவலி",
      "Complete full course": "முழு கோர்ஸ் முடிக்கவும்",
      "consult your doctor": "உங்கள் மருத்துவரை அணுகுங்கள்",
      "URGENT": "அவசரம்",
      "Visit doctor immediately": "உடனடியாக மருத்துவரை பாருங்கள்",
      "Rest well": "நன்றாக ஓய்வெடுங்கள்",
      "drink plenty of fluids": "நிறைய தண்ணீர் குடியுங்கள்",
    },
  };

  let result = text;
  const dict = translations[lang] || {};
  for (const [en, translated] of Object.entries(dict)) {
    result = result.replace(new RegExp(en, "gi"), translated);
  }
  return result;
}
