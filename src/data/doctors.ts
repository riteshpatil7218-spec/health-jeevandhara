const firstNames = ["Anjali", "Rohan", "Sneha", "Vikram", "Priya", "Arun", "Meera", "Suresh", "Kavita", "Rajesh", "Deepa", "Nitin", "Sunita", "Manoj", "Rashmi", "Amit", "Pooja", "Sanjay", "Neha", "Vivek", "Anita", "Ashok", "Swati", "Ramesh", "Jyoti", "Harish", "Rekha", "Prakash", "Seema", "Girish", "Pallavi", "Kiran", "Nandini", "Vishal", "Archana", "Sunil", "Shweta", "Mohan", "Renu", "Dinesh"];
const lastNames = ["Sharma", "Patil", "Mehta", "Deshmukh", "Kulkarni", "Joshi", "Nair", "Reddy", "Gupta", "Iyer", "Bhat", "Chavan", "More", "Pawar", "Jadhav", "Shah", "Verma", "Rao", "Kumar", "Singh"];
const specs = ["General Physician", "Cardiologist", "Pediatrician", "Dermatologist", "Orthopedic", "Gynecologist", "Neurologist", "ENT Specialist", "Dentist", "Ophthalmologist", "Pulmonologist", "Psychiatrist"];
const locations = ["Kothrud", "Hinjewadi", "Wakad", "Baner", "Shivajinagar", "Hadapsar", "Viman Nagar", "Pimpri-Chinchwad", "Aundh", "Deccan"];
const clinics = ["Apollo Clinic", "Ruby Hall Clinic", "Sahyadri Hospital", "Govt Civil Hospital", "KEM Hospital", "Deenanath Mangeshkar Hospital", "Jehangir Hospital", "Sancheti Hospital", "Inamdar Hospital", "Noble Hospital"];
const langs = [["English", "Hindi", "Marathi"], ["English", "Hindi"], ["English", "Marathi"], ["English", "Hindi", "Marathi", "Tamil"]];

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  reviews: number;
  fees: number;
  type: "Government" | "Private";
  location: string;
  distance: number;
  availability: string;
  languages: string[];
  clinic: string;
  verified: boolean;
  badge?: string;
  nextSlot?: string;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateDoctors(): Doctor[] {
  const doctors: Doctor[] = [];
  for (let i = 0; i < 120; i++) {
    const r = (offset: number) => seededRandom(i * 13 + offset);
    const fn = firstNames[Math.floor(r(1) * firstNames.length)];
    const ln = lastNames[Math.floor(r(2) * lastNames.length)];
    const rating = +(3 + r(3) * 2).toFixed(1);
    const isGovt = r(4) > 0.7;
    const avail = r(5) > 0.3;
    const badges = ["Top Rated", "Highly Recommended", "Available Today"];
    doctors.push({
      id: `doc-${i}`,
      name: `Dr. ${fn} ${ln}`,
      specialization: specs[Math.floor(r(6) * specs.length)],
      experience: Math.floor(3 + r(7) * 25),
      rating,
      reviews: Math.floor(50 + r(8) * 1950),
      fees: isGovt ? Math.floor(100 + r(9) * 200) : Math.floor(300 + r(9) * 1200),
      type: isGovt ? "Government" : "Private",
      location: locations[Math.floor(r(10) * locations.length)],
      distance: +(0.5 + r(11) * 9.5).toFixed(1),
      availability: avail ? "Available" : "Busy",
      languages: langs[Math.floor(r(12) * langs.length)],
      clinic: clinics[Math.floor(r(13) * clinics.length)],
      verified: r(14) > 0.3,
      badge: r(15) > 0.6 ? badges[Math.floor(r(16) * badges.length)] : undefined,
      nextSlot: avail ? `${Math.floor(5 + r(17) * 55)} mins` : undefined,
    });
  }
  return doctors;
}

export const pharmacies = [
  { id: "p1", name: "Apollo Pharmacy", location: "Kothrud", distance: 1.2, deliveryTime: "25 mins" },
  { id: "p2", name: "MedPlus", location: "Baner", distance: 2.5, deliveryTime: "35 mins" },
  { id: "p3", name: "Wellness Forever", location: "Hinjewadi", distance: 3.8, deliveryTime: "45 mins" },
  { id: "p4", name: "Noble Medical", location: "Shivajinagar", distance: 1.8, deliveryTime: "30 mins" },
  { id: "p5", name: "Jan Aushadhi Kendra", location: "Hadapsar", distance: 4.2, deliveryTime: "50 mins" },
  { id: "p6", name: "Netmeds Store", location: "Viman Nagar", distance: 5.0, deliveryTime: "55 mins" },
];
