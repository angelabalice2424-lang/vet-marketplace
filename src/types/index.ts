import { UserRole } from "@prisma/client";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Session {
  user?: User & {
    id: string;
    role: UserRole;
  };
  expires: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  name: string;
  role: "VETERINARIAN" | "PET_OWNER";
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ClinicFormData {
  name: string;
  description?: string;
  city: string;
  specialties: string[];
  address: string;
  phone: string;
}

export interface AvailabilityFormData {
  mondayStart?: string;
  mondayEnd?: string;
  tuesdayStart?: string;
  tuesdayEnd?: string;
  wednesdayStart?: string;
  wednesdayEnd?: string;
  thursdayStart?: string;
  thursdayEnd?: string;
  fridayStart?: string;
  fridayEnd?: string;
  saturdayStart?: string;
  saturdayEnd?: string;
  sundayStart?: string;
  sundayEnd?: string;
  slotDurationMinutes?: number;
}

export interface PetFormData {
  name: string;
  species: "PERRO" | "GATO" | "OTRO";
  size: "PEQUENO" | "MEDIANO" | "GRANDE";
}

export interface BookingStep1Data {
  clinicId: string;
  selectedDate: Date;
}

export interface BookingStep2Data {
  slotId: string;
}

export interface BookingStep3Data {
  petId?: string;
  notes?: string;
}

export interface BookingFormData extends BookingStep1Data, BookingStep2Data, BookingStep3Data {}

export interface FeedbackFormData {
  rating: number; // 1-5
  feedback?: string;
}
