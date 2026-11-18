# VetApp - Estado del Proyecto

Última actualización: 18 nov 2026

## Resumen

Prototipo en fase de restauración. La autenticación ya usa MySQL con Prisma, pero la mayoría de las funciones de negocio todavía no existen en el código.

## Infraestructura

- **Despliegue:** Easypanel, proyecto `vet-app-01`, servicio `vet-marketplace` (http://vet-app-01-vet-marketplace.ehunza.easypanel.host, muestra "Coming soon... v3").
- **Base de datos:** MySQL, servicio `mysql-vet` en el mismo proyecto. Host interno `vet-app-01_mysql-vet`, puerto 3306, base `vet-app-01`.
- **Stack en código:** Next.js 14, React 18, TypeScript (`strict: false`), Prisma 5 (`provider = "mysql"`), TailwindCSS, bcryptjs, zod, jsonwebtoken.

## Qué funciona

- `tsc --noEmit`, `prisma validate` y `next build` pasan sin errores.
- Autenticación con MySQL (verificado en MariaDB 10.11 local, ver abajo):
  - `POST /api/auth/signup`: valida con zod, hashea con bcrypt, responde 201, 400 o 409.
  - `POST /api/auth/login`: compara con bcrypt, responde 200 o 401 con el mismo mensaje para email inexistente y contraseña incorrecta.
  - Cookie `auth-token` (JWT de 7 días).
- `/dashboard/*` verifica el JWT en `src/app/dashboard/layout.tsx`. Sin cookie válida redirige a `/login`.
- Migración inicial de MySQL en `prisma/migrations/20261118000000_init_mysql/`, generada desde el schema.

## Qué NO está hecho

- **Dashboards:** son placeholders con contadores en 0.
- **Logout:** el enlace "Logout" del dashboard solo navega a `/`; no borra la cookie.
- **NextAuth:** la dependencia está instalada, pero no se usa. La auth es propia con JWT.
- **Funciones de negocio:** no existen APIs de clínicas, disponibilidad, slots, citas, mascotas ni feedback. Tampoco componentes de booking ni analytics.

## Seguridad

Corregido en esta etapa:

- Usuarios en memoria y cuentas de prueba con `password123`: eliminados (`mock-users.ts`).
- `GET /api/setup` sin autenticación: eliminado.
- Fallback `'secret-key-dev'` del JWT: eliminado. Si `NEXTAUTH_SECRET` falta o tiene menos de 32 caracteres, login y signup responden 500.
- Signup aceptaba cualquier `role` y contraseñas de cualquier largo: ahora valida rol (`VETERINARIAN` o `PET_OWNER`) y contraseña de 8 caracteres o más.
- Dashboards sin verificación real: ahora verifican el JWT en el servidor.

Pendiente:

- El middleware solo chequea que exista la cookie. Es una barrera rápida; la verificación real está en el layout.
- No hay rate limiting en login ni en signup.

## Pendiente de confirmar en producción

- La migración `20261118000000_init_mysql` **no está aplicada** en `vet-app-01`. Para aplicarla hace falta que el servicio `vet-marketplace` tenga `DATABASE_URL` disponible en el contenedor.
- `NEXTAUTH_SECRET` debe estar configurado en `vet-marketplace` con al menos 32 caracteres. Sin eso, auth no funciona.
- Como esta versión usa la base, el deploy sin `DATABASE_URL` deja login y signup rotos.

## Verificación local

Probado contra MariaDB 10.11 (no MySQL 8, que es la versión de producción). Se corrió `npm run start` con la migración aplicada:

- Signup 201, login 200, contraseña incorrecta 401, email duplicado 409 (también con mayúsculas), contraseña corta 400, rol inválido 400.
- `/dashboard/owner` sin cookie: 307 a `/login`. Con token válido: 200. Con token falso: 307 a `/login`.
- `/api/setup`: 404.
- La contraseña se guarda como hash bcrypt (`$2a$10$...`, 60 caracteres).

No probado: el comportamiento con `NEXTAUTH_SECRET` faltante en el servidor en ejecución.

## Próximos pasos

1. Configurar `DATABASE_URL` y `NEXTAUTH_SECRET` en `vet-marketplace` (Easypanel), redesplegar y correr `npx prisma migrate deploy` desde la consola.
2. Implementar logout que borre la cookie.
3. Implementar clínicas, disponibilidad y booking según `ROADMAP.md`.

## Documentos desactualizados

- `CONTINUE.md` describe pasos y APIs que no existen en el repo. No usar como guía hasta reescribirlo.
- `README.md` y `DEPLOY.md` mencionan PostgreSQL y Vercel, que no coinciden con la configuración actual.
