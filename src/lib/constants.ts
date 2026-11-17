// User Roles
export const USER_ROLES = {
  VETERINARIAN: 'VETERINARIAN',
  PET_OWNER: 'PET_OWNER',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Veterinary Specialties
export const SPECIALTIES = [
  'General Practice',
  'Surgery',
  'Cardiology',
  'Dermatology',
  'Oncology',
  'Orthopedics',
  'Neurology',
  'Ophthalmology',
  'Dentistry',
  'Internal Medicine',
  'Emergency & Critical Care',
  'Exotic Animals',
  'Behavioral Medicine',
  'Rehabilitation',
  'Acupuncture',
] as const;

export type Specialty = (typeof SPECIALTIES)[number];

// Pet Species
export const PET_SPECIES = {
  PERRO: 'PERRO',
  GATO: 'GATO',
  OTRO: 'OTRO',
} as const;

export type PetSpecies = (typeof PET_SPECIES)[keyof typeof PET_SPECIES];

// Pet Sizes
export const PET_SIZES = {
  PEQUENO: 'PEQUENO',
  MEDIANO: 'MEDIANO',
  GRANDE: 'GRANDE',
} as const;

export type PetSize = (typeof PET_SIZES)[keyof typeof PET_SIZES];

// Appointment Status
export const APPOINTMENT_STATUS = {
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
} as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS];

// Availability Slot Duration (in minutes)
export const DEFAULT_SLOT_DURATION = 30;

// API Response Status
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  PENDING: 'pending',
} as const;

export type APIStatus = (typeof API_STATUS)[keyof typeof API_STATUS];
