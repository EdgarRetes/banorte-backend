# Banorte Backend
# TEST BUILD V3

Este es el repositorio del backend del proyecto **Polaris**, construido con **NestJS**, **Prisma** y **PostgreSQL**.  
El proyecto expone una API REST modular para la gestión de usuarios, empresas, categorías, estados y reglas de negocio.  
Incluye autenticación y autorización con **JWT**. Las siguientes funcionalidades ya están implementadas: **categories**, **states** y **auth (login/register)**.

---

## Stack Tecnológico
- [NestJS](https://nestjs.com/) – Framework de Node.js para estructurar el backend.  
- [Prisma](https://www.prisma.io/) – ORM para manejar la base de datos en PostgreSQL.  
- [PostgreSQL](https://www.postgresql.org/) – Base de datos relacional.  
- [Docker](https://www.docker.com/) – Orquestación de PostgreSQL y pgAdmin.  
- [pgAdmin](https://www.pgadmin.org/) – GUI web para PostgreSQL.  
- [JWT](https://jwt.io/) – Autenticación basada en tokens.

---

## 1. Clonar repositorio
```bash
git clone https://github.com/malikethbbz/banorte-backend.git
cd banorte-backend
```

---

## 2. Configurar variables de entorno
Crear un archivo `.env` en la raíz con:

```env
# App
PORT=3000
NODE_ENV=development
JWT_SECRET=supersecret_jwt_key

# Base de datos
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/banorte_db?schema=public"

# pgAdmin
PGADMIN_EMAIL=admin@banorte.com
PGADMIN_PASSWORD=banorte123
```

---

## 3. Levantar base de datos y pgAdmin
Con Docker:
```bash
docker compose up -d
```

Esto inicia:
- PostgreSQL en `localhost:5433`
- pgAdmin en `http://localhost:5050`

Si ya existen contenedores con el mismo nombre, elimínalos antes:
```bash
docker ps -a
docker rm -f <container_id>
```

---

## 4. Instalar dependencias
```bash
npm install
npm install @nestjs/mapped-types
```

---

## 5. Migraciones y base de datos

### 5.1 Ejecutar migración inicial
```bash
npx prisma migrate dev --name init
```

### 5.2 (Opcional) Abrir Prisma Studio
```bash
npx prisma studio
```
Esto abre un panel web para explorar y editar tablas de la base de datos.

---

## 6. Seeder (datos iniciales)
El archivo `prisma/seed.ts` incluye datos iniciales:

- Rol **ADMIN**  
- Usuario **Hector Martinez** (`HMtinez@banorte.mx`)  
- Empresas **Banorte** y **Santander**  
- Categoría **General**  
- Estado **Activo**  
- Reglas de negocio:
  - Validar RFC (Banorte)  
  - Monto Máximo (Santander)

Ejecutar con:
```bash
npm run prisma:seed
```

---

## 7. Levantar servidor
```bash
npm run start:dev
```

El backend quedará disponible en `http://localhost:3000`.

---

## Endpoints Disponibles

### Autenticación (`/auth`)
- `POST /auth/register` → registrar usuario  
- `POST /auth/login` → login con email y password  
- Endpoints protegidos con `AuthGuard` usando JWT  
- Enviar token en header `Authorization: Bearer <token>` para rutas protegidas

#### Ejemplo: Registro
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "Hector",
  "middleName": "M",
  "lastName1": "Martinez",
  "lastName2": "Lopez",
  "email": "hector@banorte.com",
  "password": "password123"
}
```

#### Ejemplo: Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "hector@banorte.com",
  "password": "password123"
}
```

Respuesta típica:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

### Usuarios (`/users`)
- `GET /users` → lista todos los usuarios  
- `GET /users/:id` → obtener usuario por ID  
- `POST /users` → crear usuario  
- `PATCH /users/:id` → actualizar usuario  
- `DELETE /users/:id` → eliminar usuario  

### Empresas (`/companies`)
- `GET /companies` → lista todas las empresas  
- `GET /companies/:id` → obtener empresa por ID  
- `POST /companies` → crear empresa  
- `PATCH /companies/:id` → actualizar empresa  
- `DELETE /companies/:id` → eliminar empresa  

### Categorías (`/categories`) - implementado
- `GET /categories` → lista todas las categorías  
- `GET /categories/:id` → obtener categoría por ID  
- `POST /categories` → crear categoría  
- `PATCH /categories/:id` → actualizar categoría  
- `DELETE /categories/:id` → eliminar categoría  

### Estados (`/states`) - implementado
- `GET /states` → lista todos los estados  
- `GET /states/:id` → obtener estado por ID  
- `POST /states` → crear estado  
- `PATCH /states/:id` → actualizar estado  
- `DELETE /states/:id` → eliminar estado  

### Reglas de negocio (`/rules`)
- `GET /rules` → lista todas las reglas  
- `GET /rules/:id` → obtener regla por ID  
- `POST /rules` → crear regla  
- `PATCH /rules/:id` → actualizar regla  
- `DELETE /rules/:id` → eliminar regla  
- Las reglas pueden relacionarse con empresa, categoría y estado para su validación.

---

## Próximos módulos (pendientes)
- `/files` → gestión y almacenamiento de archivos (Banorte)  
- `/audit-log` → auditoría de cambios y eventos  
- Integraciones adicionales y mejoras en validaciones y manejo de errores

---

## Scripts útiles
- `npm run start:dev` → inicia en modo desarrollo.  
- `npm run build` → compila el proyecto.  
- `npx prisma migrate dev` → aplica migraciones.  
- `npx prisma studio` → abre panel gráfico de la DB.  
- `npm run prisma:seed` → ejecuta el seeder inicial.  

---

## Buenas prácticas de desarrollo
- Mantener la configuración sensible (ej. `JWT_SECRET`, `DATABASE_URL`) fuera del repositorio.  
- Ejecutar migraciones y seeders en entornos de desarrollo únicamente.  
- Usar branches por feature y Pull Requests para revisión de código.

---

## Equipo
- **Backend**: NestJS + Prisma  
- **Frontend**: React + Vite (repositorio separado)  
- **DB**: PostgreSQL con Docker + Prisma
