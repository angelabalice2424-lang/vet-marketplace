export const PET_SPECIES = {
  PERRO: "Perro",
  GATO: "Gato",
  OTRO: "Otro",
} as const;

export const PET_SIZES = {
  PEQUENO: "Pequeño (0-10 kg)",
  MEDIANO: "Mediano (10-30 kg)",
  GRANDE: "Grande (30+ kg)",
} as const;

export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const DAY_LABELS: Record<string, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

export const SLOT_DURATION_MINUTES = 30;
export const GENERATE_SLOTS_DAYS = 28;

export const APPOINTMENT_STATUS = {
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
} as const;

// Specialties that vets can select
export const SPECIALTIES = [
  "Medicina General",
  "Cirugía",
  "Odontología",
  "Cardiología",
  "Dermatología",
  "Oftalmología",
  "Urología",
  "Traumatología",
  "Nutrición",
  "Comportamiento",
] as const;
