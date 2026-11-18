# VetApp - Estado del Proyecto

Última actualización: 18 nov 2026

## Resumen

Prototipo en fase de restauración. El build compila, pero la autenticación no usa la base de datos y la mayoría de las funciones de negocio todavía no existen en el código.

## Infraestructura

- **Despliegue:** Easypanel, proyecto `vet-app-01`, servicio `vet-marketplace` (http://vet-app-01-vet-marketplace.ehunza.easypanel.host, muestra "Coming soon... v3").
- **Base de datos:** MySQL, servicio `mysql-vet` en el mismo proyecto. Host interno `vet-app-01_mysql-vet`, puerto 3306, base `vet-app-01`.
- **Stack en código:** Next.js 14, React 18, TypeScript (`strict: false`), Prisma 5 (`provider = "mysql"`), TailwindCSS.

## Qué funciona

- `npm ci`, `tsc --noEmit`, `prisma validate` y `next build` pasan sin errores.
- Páginas: `/`, `/login`, `/signup`, `/dashboard`, `/dashboard/owner`, `/dashboard/vet`.
- `POST /api/auth/signup` y `POST /api/auth/login` (cookie `auth-token`).
- Migración inicial de MySQL en `prisma/migrations/20261118000000_init_mysql/` (commit `7ebae2d`), generada desde el schema.

## Qué NO está hecho

- **Autenticación en memoria:** los usuarios viven en `src/app/api/auth/mock-users.ts` y se pierden al reiniciar. Prisma no se usa en ninguna ruta (`src/lib/db.ts` no se importa).
- **Dashboards:** son placeholders con contadores en 0.
- **Middleware:** solo verifica que exista la cookie, no que el token sea válido.
- **NextAuth:** la dependencia está instalada, pero no hay configuración.
- **Funciones de negocio:** no existen APIs de clínicas, disponibilidad, slots, citas, mascotas ni feedback. Tampoco componentes de booking ni analytics.

## Problemas de seguridad

1. `GET /api/setup` no tiene autenticación y ejecuta `prisma migrate deploy`. Hay que eliminarlo o protegerlo.
2. `src/lib/jwt.ts` usa `'secret-key-dev'` si falta `NEXTAUTH_SECRET`.
3. `mock-users.ts` tiene cuentas de prueba con contraseña `password123`.
4. El signup acepta cualquier `role`, incluido `VETERINARIAN`, y no valida la contraseña.

## Pendiente de confirmar en producción

- La migración `20261118000000_init_mysql` **no está aplicada** en `vet-app-01` hasta que alguien corra `npx prisma migrate deploy` con la `DATABASE_URL` del servicio. Esto también puede ocurrir en el `postbuild` del próximo despliegue, si la variable está disponible durante el build; el script usa `|| true`, así que un fallo sería silencioso.
- Verificar qué variables tiene el servicio `vet-marketplace` (en especial `DATABASE_URL` y `NEXTAUTH_SECRET`).

## Próximos pasos

1. Migrar auth a Prisma (usuarios en MySQL, bcrypt, verificación de JWT en el middleware) y forzar `NEXTAUTH_SECRET`.
2. Eliminar o proteger `/api/setup`.
3. Aplicar la migración MySQL en producción y confirmar las tablas.
4. Implementar clínicas, disponibilidad y booking según `ROADMAP.md`.

## Documentos desactualizados

- `CONTINUE.md` describe pasos y APIs que no existen en el repo. No usar como guía hasta reescribirlo.
- `README.md` y `DEPLOY.md` mencionan PostgreSQL y Vercel, que no coinciden con la configuración actual.
