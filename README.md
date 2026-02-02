# Klyroframe 🚀

**Klyroframe** es una aplicación de gestión de proyectos minimalista, diseñada para ofrecer una experiencia premium con una interfaz limpia inspirada en Figma.

## Tech Stack
- **Next.js 15+** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Prisma ORM** (SQLite)
- **NextAuth.js** (Credentials)
- **Zod** (Validación)

## Cómo empezar localmente

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar el entorno:**
   Crea un archivo `.env` basado en `.env.example`:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="yoursupersafesecret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Inicializar la base de datos:**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. **Correr en desarrollo:**
   ```bash
   npm run dev
   ```

## Credenciales por defecto (Seed)
- **Email:** `admin@klyroframe.local`
- **Contraseña:** `changeme123`

## Características V1
- **Dashboard:** Visualización de proyectos activos con barra de progreso temporal y buscador.
- **Detalle de Proyecto:** Gestión de notas (CRUD) y visualización detallada del avance.
- **WhatsApp Directo:** Botón para abrir chat con el cliente sin guardar el contacto.
- **Archivo:** Sección de proyectos finalizados con fecha de entrega destacada.
- **Diseño Premium:** Tipografía Inter, cards suaves, micro-interacciones y enfoque minimalista.

---
*Desarrollado con ❤️ por Antigravity (Google)*
