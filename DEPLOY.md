# 🚀 Guía de Deployment - Vet Marketplace

## Resumen
- **Código**: GitHub → https://github.com/angelabalice2424-lang/vet-marketplace
- **Deploy**: Vercel (recomendado para Next.js)
- **Base de datos**: Configurable (Prisma soporta PostgreSQL, MySQL, SQLite)

---

## 1️⃣ Código en GitHub ✅
Ya está hecho:
- Repositorio creado
- Código pusheado
- Rama main lista

```bash
git push origin main  # Para futuros cambios
```

---

## 2️⃣ Deploy en Vercel (Recomendado)

### Opción A: Automatic (Más fácil)
1. Ve a: https://vercel.com/new
2. Click en **Continue with GitHub**
3. Autoriza Vercel
4. Selecciona: **vet-marketplace**
5. Vercel detectará Next.js automáticamente
6. Configura variables de entorno (ver abajo)
7. Click en **Deploy**

### Opción B: CLI
```bash
npm i -g vercel
vercel link  # Conecta tu proyecto
vercel env add  # Agrega variables de entorno
vercel deploy  # Despliega
```

---

## 3️⃣ Variables de Entorno

### En Vercel, agrega estas variables:
```
DATABASE_URL=postgresql://user:password@host:5432/vet_db
NEXTAUTH_SECRET=<generar con: openssl rand -base64 32>
NEXTAUTH_URL=https://tu-dominio-vercel.vercel.app
```

Obtén `NEXTAUTH_SECRET` ejecutando:
```bash
openssl rand -base64 32
```

---

## 4️⃣ Base de Datos

### Opción 1: PostgreSQL (Recomendado)
- **Proveedor**: Supabase (gratis) o Railway
- **Configuración**: Agregar `DATABASE_URL` a Vercel

### Opción 2: MySQL
- **Proveedor**: PlanetScale o Railway

### Opción 3: SQLite (Solo desarrollo)
- No recomendado para producción

---

## 5️⃣ Flujo de Trabajo Futuro

### Después de cambios locales:
```bash
cd C:\Users\Luna\vet-app

# Haz cambios...
git add .
git commit -m "Tu mensaje"
git push origin main

# Vercel despliega automáticamente
```

---

## 6️⃣ Monitoreo y Logs

### En Vercel Dashboard:
- Deployments → Ver historial
- Logs → Errores en tiempo real
- Analytics → Performance

### Localmente:
```bash
npm run dev     # Desarrollo
npm run build   # Test de build
npm run start   # Producción local
```

---

## 7️⃣ Troubleshooting

### "Build failed"
→ Revisa logs en Vercel Dashboard
→ Verifica que todas las variables de entorno estén

### "Database connection error"
→ Verifica `DATABASE_URL` correcta
→ Asegúrate que la BD permite conexiones remotas

### "NextAuth error"
→ Regenera `NEXTAUTH_SECRET`
→ Verifica `NEXTAUTH_URL` correcta

---

## 📞 Contacto
- GitHub Issues: Reporta bugs
- Vercel Support: Para problemas de deploy
- Documentación: https://nextjs.org/docs

---

**¡Ahora estás listo para desplegar! 🎉**
