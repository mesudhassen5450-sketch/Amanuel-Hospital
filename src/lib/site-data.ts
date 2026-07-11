import {
  Stethoscope,
  Siren,
  Slice,
  ScanLine,
  FlaskConical,
  Baby,
  HeartPulse,
  Pill,
  Brain,
  Bone,
  Eye,
  Activity,
  type LucideIcon,
} from "lucide-react";

import doctor1 from "@/assets/doctors.jpg";
import doctor2 from "@/assets/doctors1.jpg";
import doctor3 from "@/assets/doctors.jpg";
import doctor4 from "@/assets/doctors1.jpg";
import doctor5 from "@/assets/doctors.jpg";
import doctor6 from "@/assets/doctors1.jpg";
import galleryLab from "@/assets/machine.jpg";
import gallerySurgery from "@/assets/room.jpg";
import galleryPediatrics from "@/assets/baby.jpg";
import galleryRadiology from "@/assets/machine.jpg";
import galleryPharmacy from "@/assets/aman pharmacy.jpg";
import galleryWard from "@/assets/room.jpg";
import aboutLobby from "@/assets/bero.jpg";

export interface Service {
  id: string;
  title: string;
  description: string;
  detail: string;
  icon: LucideIcon;
}

export const services: Service[] = [
  {
    id: "general-consultation",
    title: "General Consultation",
    description: "Comprehensive outpatient consultations with experienced general practitioners.",
    detail:
      "Our outpatient department offers same-day consultations, preventive check-ups, chronic disease follow-up and referrals to specialists — all in a comfortable, modern setting.",
    icon: Stethoscope,
  },
  {
    id: "emergency-care",
    title: "Emergency Care",
    description: "24/7 emergency services with rapid triage and a dedicated resuscitation team.",
    detail:
      "Our emergency unit operates around the clock with trained emergency physicians, ambulance coordination and fully equipped resuscitation rooms.",
    icon: Siren,
  },
  {
    id: "surgery",
    title: "Surgery",
    description: "Modern operating theaters for general, orthopedic and gynecologic surgery.",
    detail:
      "From minor procedures to major operations, our surgical team follows international safety protocols in fully equipped, sterile operating theaters.",
    icon: Slice,
  },
  {
    id: "radiology",
    title: "Radiology",
    description: "Digital X-ray, ultrasound and CT imaging with expert interpretation.",
    detail:
      "Advanced imaging technology and experienced radiologists deliver accurate, timely diagnostic reports to guide your treatment.",
    icon: ScanLine,
  },
  {
    id: "laboratory",
    title: "Laboratory",
    description: "Accurate diagnostic testing with modern automated laboratory equipment.",
    detail:
      "Hematology, chemistry, microbiology and serology testing with strict quality control and fast turnaround times.",
    icon: FlaskConical,
  },
  {
    id: "pediatrics",
    title: "Pediatrics",
    description: "Compassionate care for infants, children and adolescents.",
    detail:
      "Child-friendly consultation rooms, immunization services, growth monitoring and inpatient pediatric care delivered with warmth.",
    icon: Baby,
  },
  {
    id: "maternity",
    title: "Maternity",
    description: "Safe deliveries, antenatal care and postnatal support for mothers.",
    detail:
      "Comprehensive maternal care including antenatal follow-up, safe delivery services, caesarean sections and newborn care.",
    icon: HeartPulse,
  },
  {
    id: "pharmacy",
    title: "Pharmacy",
    description: "Well-stocked pharmacy with quality medicines and expert guidance.",
    detail:
      "Our in-house pharmacy provides prescribed medications, counseling on proper use, and is open extended hours for your convenience.",
    icon: Pill,
  },
];

export interface Doctor {
  name: string;
  specialty: string;
  experience: string;
  availableToday: boolean;
  photo: string;
}

export const doctors: Doctor[] = [
  {
    name: "Doctor Picture 1",
    specialty: "General Surgeon · Medical Director",
    experience: "18+ years experience",
    availableToday: true,
    photo: doctor1,
  },
  {
    name: "Doctor Picture 2",
    specialty: "Pediatrician",
    experience: "10+ years experience",
    availableToday: true,
    photo: doctor2,
  },
  {
    name: "Doctor Picture 3",
    specialty: "Internal Medicine Specialist",
    experience: "22+ years experience",
    availableToday: false,
    photo: doctor3,
  },
  {
    name: "Doctor Picture 4",
    specialty: "Obstetrician & Gynecologist",
    experience: "14+ years experience",
    availableToday: true,
    photo: doctor4,
  },
  {
    name: "Doctor Picture 5",
    specialty: "Radiologist",
    experience: "9+ years experience",
    availableToday: false,
    photo: doctor5,
  },
  {
    name: "Doctor Picture 6",
    specialty: "Emergency Medicine Physician",
    experience: "8+ years experience",
    availableToday: true,
    photo: doctor6,
  },
];

export interface Department {
  name: string;
  description: string;
  icon: LucideIcon;
}

export const departments: Department[] = [
  {
    name: "Internal Medicine",
    description: "Diagnosis and treatment of adult diseases, chronic condition management.",
    icon: Activity,
  },
  {
    name: "Surgery",
    description: "General and specialized surgical procedures in modern theaters.",
    icon: Slice,
  },
  {
    name: "Pediatrics",
    description: "Dedicated child healthcare from newborns to adolescents.",
    icon: Baby,
  },
  {
    name: "Obstetrics & Gynecology",
    description: "Women's health, antenatal care and safe delivery services.",
    icon: HeartPulse,
  },
  {
    name: "Emergency Medicine",
    description: "24/7 rapid response emergency and trauma care.",
    icon: Siren,
  },
  {
    name: "Radiology & Imaging",
    description: "X-ray, ultrasound and CT diagnostics with expert reading.",
    icon: ScanLine,
  },
  {
    name: "Neurology",
    description: "Care for disorders of the brain, spine and nervous system.",
    icon: Brain,
  },
  {
    name: "Orthopedics",
    description: "Bone, joint and musculoskeletal treatment and rehabilitation.",
    icon: Bone,
  },
  {
    name: "Ophthalmology",
    description: "Eye examinations, treatment and minor eye surgery.",
    icon: Eye,
  },
];

export interface Vacancy {
  title: string;
  type: string;
  department: string;
  requirements: string[];
}

export const vacancies: Vacancy[] = [
  {
    title: "General Practitioner",
    type: "Full-time",
    department: "Outpatient Department",
    requirements: [
      "Doctor of Medicine (MD) degree",
      "Valid professional license",
      "2+ years clinical experience",
      "Strong communication skills in Amharic, Afaan Oromo and English",
    ],
  },
  {
    title: "Registered Nurse",
    type: "Full-time",
    department: "Inpatient Ward",
    requirements: [
      "BSc in Nursing",
      "Valid nursing license",
      "1+ years hospital experience preferred",
      "Willingness to work rotating shifts",
    ],
  },
  {
    title: "Laboratory Technologist",
    type: "Full-time",
    department: "Laboratory",
    requirements: [
      "BSc in Medical Laboratory Science",
      "Experience with automated analyzers",
      "Attention to detail and quality control mindset",
    ],
  },
  {
    title: "Midwife",
    type: "Full-time",
    department: "Maternity",
    requirements: [
      "BSc in Midwifery",
      "Valid professional license",
      "Experience in labor & delivery care",
    ],
  },
  {
    title: "Pharmacist",
    type: "Part-time",
    department: "Pharmacy",
    requirements: [
      "BPharm degree with valid license",
      "Knowledge of pharmacy inventory systems",
      "Customer-focused attitude",
    ],
  },
  {
    title: "Receptionist / Cashier",
    type: "Full-time",
    department: "Administration",
    requirements: [
      "Diploma or degree in a related field",
      "Basic computer skills",
      "Fluency in Amharic, Afaan Oromo and English",
    ],
  },
];

export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const galleryImages: GalleryImage[] = [
  { src: galleryLab, alt: "Hospital laboratory with modern microscopes", width: 900, height: 1200 },
  { src: gallerySurgery, alt: "Modern operating theater with surgical lights", width: 1200, height: 800 },
  { src: galleryPediatrics, alt: "Nurse caring for a child in the pediatric ward", width: 1200, height: 900 },
  { src: galleryRadiology, alt: "CT scanner in the radiology department", width: 900, height: 1100 },
  { src: galleryPharmacy, alt: "Hospital pharmacy with organized medicine shelves", width: 1200, height: 800 },
  { src: galleryWard, alt: "Bright modern patient room", width: 900, height: 1200 },
  { src: aboutLobby, alt: "Hospital reception lobby", width: 1200, height: 900 },
];

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Tigist A.",
    role: "Maternity patient",
    quote:
      "The maternity team made my delivery safe and comfortable. The midwives were with me every step of the way — I felt truly cared for.",
  },
  {
    name: "Getachew M.",
    role: "Surgery patient",
    quote:
      "From admission to discharge, everything was professional and clean. My operation went smoothly and the follow-up care was excellent.",
  },
  {
    name: "Hiwot K.",
    role: "Parent of pediatric patient",
    quote:
      "My daughter was treated so gently in the pediatric ward. The doctors explained everything clearly and she recovered quickly.",
  },
  {
    name: "Bekele T.",
    role: "Emergency patient",
    quote:
      "I arrived at midnight with severe pain and was seen within minutes. The 24/7 emergency service truly saved my life.",
  },
];

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "What are the hospital's working hours?",
    answer:
      "Our outpatient departments operate Monday to Saturday from 8:00 AM to 8:00 PM. The emergency department is open 24 hours a day, 7 days a week.",
  },
  {
    question: "Do I need an appointment to see a doctor?",
    answer:
      "Walk-ins are welcome for general consultations, but we recommend booking an appointment to reduce your waiting time, especially for specialist visits.",
  },
  {
    question: "Does the hospital accept health insurance?",
    answer:
      "We work with several insurance providers and employer health schemes. Please contact our reception with your insurance details to confirm coverage.",
  },
  {
    question: "Is there a 24/7 emergency service?",
    answer:
      "Yes. Our emergency department is staffed around the clock with emergency physicians, nurses and ambulance coordination.",
  },
  {
    question: "Can I get laboratory tests without a doctor's referral?",
    answer:
      "Selected routine tests are available on request. For specialized tests we recommend a consultation first so results can be properly interpreted.",
  },
  {
    question: "How do I get my medical records or test results?",
    answer:
      "Test results can be collected at the laboratory reception or sent to your doctor directly. Medical record requests are handled by our administration office.",
  },
];

export const stats = [
  { label: "Emergency Service", value: 24, suffix: "/7" },
  { label: "Experienced Doctors", value: 35, suffix: "+" },
  { label: "Modern Equipment Units", value: 120, suffix: "+" },
  { label: "Patients Served", value: 85000, suffix: "+" },
];

export const contactInfo = {
  phone: "+251 11 000 0000",
  emergency: "+251 90 000 0000",
  email: "dramanuelhospital@gmail.com",
  location: "Bishoftu (Debre Zeyit), Oromia, Ethiopia",
  hours: "Mon–Sat: 8:00 AM – 8:00 PM · Emergency: 24/7",
};
