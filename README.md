# Banorte Backend  
### Implementación de Roles, Tokens y Auditoría

Este proyecto corresponde al **backend del sistema Polaris**, desarrollado con **NestJS**, **Prisma** y **PostgreSQL**.  
Provee una API modular y segura para gestionar **usuarios, roles, empresas, categorías, estados y auditorías**, además de manejar autenticación mediante **JWT**.

---

## Tecnologías Principales
- **NestJS** – Framework Node.js modular y escalable.  
- **Prisma ORM** – Acceso tipado y seguro a PostgreSQL.  
- **PostgreSQL** – Base de datos relacional.  
- **Docker + pgAdmin** – Orquestación y administración de base de datos.  
- **JWT (JSON Web Tokens)** – Autenticación y autorización con tokens firmados.  

---

## 1. Instalación y Configuración

### Clonar el proyecto
```bash
git clone https://github.com/malikethbbz/banorte-backend.git
cd banorte-backend
```

### Variables de entorno
Crea un archivo `.env` con el siguiente contenido:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=supersecret_jwt_key

DATABASE_URL="postgresql://postgres:postgres@localhost:5433/banorte_db?schema=public"

PGADMIN_EMAIL=admin@banorte.com
PGADMIN_PASSWORD=banorte123
```

---

## 2. Configurar base de datos

### Iniciar PostgreSQL y pgAdmin
```bash
docker compose up -d
```
Esto levanta:
- PostgreSQL en `localhost:5433`
- pgAdmin en `http://localhost:5050`

### Ejecutar migraciones
```bash
npx prisma migrate dev --name init
```

### Cargar datos iniciales
```bash
npm run prisma:seed
```

Crea automáticamente:
- Rol **Admin**
- Rol **User**
- Usuario administrador `admin@local.com` con contraseña `Admin123!`

---

## 3. Ejecución del servidor
```bash
npm install
npm run start:dev
```

API disponible en:  
`http://localhost:3000`

---

## 4. Autenticación y Autorización

El sistema implementa un esquema **JWT** donde cada usuario obtiene un token al iniciar sesión.  
Los controladores utilizan **guards** y **decoradores personalizados** para proteger rutas y restringir acciones según el rol del usuario.

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@local.com",
  "password": "Admin123!"
}
```

Respuesta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

El token se debe incluir en el encabezado:
```
Authorization: Bearer <token>
```

### Roles disponibles
- **Admin** → acceso total a creación, modificación y eliminación.  
- **User** → acceso solo lectura a recursos.  

Los decoradores `@Roles('Admin')` y `@UseGuards(JwtAuthGuard, RolesGuard)` controlan estas restricciones.

---

## 5. Auditoría

Cada operación importante (crear, actualizar o eliminar) se registra automáticamente en la tabla **AuditLog**, con la siguiente información:
- Entidad afectada (`Company`, `Category`, `State`)
- Tipo de acción (`CREATE`, `UPDATE`, `DELETE`)
- Estado anterior y posterior (`before`, `after`)
- Usuario que ejecutó la acción
- Fecha y hora

Consulta de auditoría:
```http
GET /api/audit
Authorization: Bearer <token_admin>
```

---

## 6. Endpoints Principales

### Autenticación (`/auth`)
- `POST /auth/register` → Crear usuario nuevo.  
- `POST /auth/login` → Iniciar sesión y obtener token.  

### Usuarios (`/users`)
- CRUD completo, con protección JWT.

### Empresas (`/companies`)
- CRUD con auditoría integrada.  
- Solo **Admin** puede crear, actualizar o eliminar.

### Categorías (`/categories`)
- CRUD con auditoría integrada y restricción por rol.

### Estados (`/states`)
- CRUD con registro de auditoría.

### Auditoría (`/audit`)
- `GET /audit` → Ver registros de acciones ejecutadas por usuarios.

---

## 7. Validación de Roles y Tokens

### Ejemplo de prueba con Postman:
1. Iniciar sesión como admin → obtener token.  
2. Crear categoría (`POST /api/categories`) → éxito 201.  
3. Registrar un usuario normal (`POST /auth/register`).  
4. Iniciar sesión con usuario normal y repetir el paso anterior → error 403 “Forbidden”.  

Esto confirma la funcionalidad de roles y autenticación.

---

## 8. Scripts útiles

| Comando | Descripción |
|----------|--------------|
| `npm run start:dev` | Inicia el servidor en modo desarrollo |
| `npm run build` | Compila el proyecto |
| `npx prisma migrate dev` | Aplica migraciones |
| `npm run prisma:seed` | Carga datos iniciales |
| `npx prisma studio` | Abre interfaz visual de la base de datos |

---

## 9. Estado actual del proyecto

Implementado:
- Autenticación con JWT  
- Roles (Admin/User)  
- Protección de rutas con guards  
- Auditoría de operaciones  
- CRUD completo para empresas, categorías y estados  

---

## 10. Equipo
- **Backend**: NestJS + Prisma  
- **Frontend**: React + Vite (repositorio separado)  
- **Base de datos**: PostgreSQL con Docker  
