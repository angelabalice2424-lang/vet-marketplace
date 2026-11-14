# VetApp - Plataforma de Reserva de Citas Veterinarias

App veterinaria construida con Next.js 14, Prisma, PostgreSQL, NextAuth v5 y Amplitude.

## Setup Local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar base de datos

```bash
# Copiar .env.local.example a .env.local
cp .env.local.example .env.local

# Editar .env.local con tu DATABASE_URL (PostgreSQL/Supabase)
```

### 3. Crear base de datos

```bash
# Ejecutar migraciones de Prisma
npx prisma migrate dev --name init

# (Opcional) Abrir Prisma Studio para ver datos
npx prisma studio
```

### 4. Generar cliente de Prisma

```bash
npm run prisma:generate
```

### 5. Iniciar servidor de desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:3000`

## Features Implementadas

### ✅ Fase 1: Autenticación & Setup Base
- [x] Signup/Login con NextAuth v5
- [x] Selector de rol (VETERINARIAN | PET_OWNER)
- [x] Middleware de autenticación
- [x] Modelo de datos Prisma

### 🚀 Por Hacer

#### Fase 1 Continuación:
- [ ] Dashboard vet: crear clínica
- [ ] Dashboard vet: configurar disponibilidad
- [ ] Dashboard vet: ver turnos
- [ ] Función `generateSlots()` trigger

#### Fase 2: Booking Base
- [ ] Búsqueda de clínicas (city, specialty, date)
- [ ] Booking wizard (3 pasos)
- [ ] API atómica de booking
- [ ] Validación de double-booking

#### Fase 3: Mascota
- [ ] Selector de mascota en step 3
- [ ] API CRUD de mascotas
- [ ] Crear mascota en el proceso de booking

#### Fase 4: Analytics
- [ ] Dashboard Amplitude
- [ ] Funnel: search → step1 → step2 → step3 → created
- [ ] Events tracking

#### Fase 5: CSAT
- [ ] Modal de feedback post-booking
- [ ] Rating 1-5 estrellas
- [ ] Endpoint POST /api/feedback

#### Fase 6: UI Polish
- [ ] Logo y favicon paw
- [ ] Responsive design
- [ ] Loading states
- [ ] Toast notifications

## Estructura de Carpetas

```
src/
├── app/                # Next.js App Router
│   ├── (auth)/        # Rutas de autenticación
│   ├── (dashboard)/   # Dashboard protegido
│   ├── api/           # Endpoints API
│   └── middleware.ts
├── components/
│   ├── auth/          # Componentes de auth
│   ├── booking/       # Wizard de booking
│   ├── clinic/        # Componentes de clínica
│   ├── availability/  # Configuración de horarios
│   ├── pet/           # Selector de mascota
│   ├── ui/            # Componentes reutilizables
│   └── common/        # Navbar, Footer, etc
├── lib/
│   ├── auth.ts        # NextAuth config
│   ├── db.ts          # Prisma client
│   ├── slots.ts       # Generación de slots
│   ├── analytics.ts   # Amplitude
│   └── api-utils.ts   # Lógica de booking atómico
├── hooks/
│   ├── useAuth.ts
│   ├── useAnalytics.ts
│   └── useBooking.ts
└── types/
    └── index.ts
```

## Environment Variables

```
DATABASE_URL=postgresql://user:pass@localhost:5432/vet_app
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_AMPLITUDE_KEY=your-amplitude-key
```

## Comandos

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar servidor de producción
npm start

# Migrar base de datos
npm run prisma:migrate

# Generar cliente Prisma
npm run prisma:generate

# Abrir Prisma Studio
npm run prisma:studio
```

## Stack Técnico

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **BD:** PostgreSQL (Supabase)
- **ORM:** Prisma 7
- **Auth:** NextAuth v5
- **UI:** TailwindCSS + componentes customizados
- **Analytics:** Amplitude
- **Validación:** Zod

## Notas de Desarrollo

- La generación de slots es **automática** cuando el vet guarda su disponibilidad semanal
- El booking usa **transacción Prisma** para garantizar atomicidad (evita double-booking)
- NextAuth está configurado con **split Edge/Node** middleware
- Los eventos de Amplitude se envían desde el backend `/api/analytics`
- Las mascotas son **opcionales** en el appointment

---

**Status:** Estructura base completa. Listo para Fase 2 (booking).
