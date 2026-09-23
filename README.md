# BalanceFood — Optimiza tu Saldo JUNAEB

Plataforma web para que estudiantes con Beca de Alimentacion JUNAEB comparen precios de platos, registren sus gastos y sepan qué pueden costear cada dia para que el saldo alcance hasta fin de mes.

Proyecto de la asignatura **Computacion Web y Movil** (UTEM) — Tarea 1: Aplicacion Web.
Equipo: Ian Nicolás Tseng Pereira.

## Problema que resuelve
Las plataformas oficiales (Edenred, Pluxee) muestran saldo y locales en convenio, pero no los precios de los platos. Sin información ni planificación, el saldo se agota semanas antes de la recarga. BalanceFood entrega un catálogo con precios reales, registro de gastos y un recomendador basado en el presupuesto diario.

## URLs (completar antes de entregar)
- Frontend: `https://...`
- API: `https://.../api/v1`
- Tablero Jira: `https://...`
- Credenciales de prueba: `test@balancefood.cl` / `Password123`

## Stack
Ruby on Rails (modo API) · API REST + JSON · PostgreSQL · React (Vite, JavaScript) · Git/GitHub · Jira.

## Arquitectura
```
React (SPA, Vite)  --HTTP/JSON + Bearer JWT-->  Rails API (/api/v1)  -->  PostgreSQL
```
Frontend y backend están desacoplados. El frontend guarda el JWT en `localStorage` y lo envía en la cabecera `Authorization: Bearer <token>`.

### Autenticación
1. `POST /auth/signup` o `/auth/login` valida credenciales (contraseña con `bcrypt` vía `has_secure_password`) y devuelve un JWT HS256 con `user_id`, `jti` (id único) y `exp` (24 h).
2. Cada request protegida pasa por `ApplicationController#authenticate_request!`, que verifica firma y expiración, y que el `jti` no esté revocado.
3. `DELETE /auth/logout` guarda el `jti` en la tabla `revoked_tokens`; ese token deja de ser válido aunque no haya expirado.

## Modelo de datos
| Tabla | Campos principales | Relaciones |
|---|---|---|
| users | name, email (único), password_digest, current_balance (≥ 0) | tiene muchos expenses |
| restaurants | name, category, address, description | tiene muchos menu_items |
| menu_items | restaurant_id (FK), name, price (> 0), category, available | pertenece a restaurant |
| expenses | user_id (FK), menu_item_id (FK opcional), description, amount (> 0), spent_on | pertenece a user |
| revoked_tokens | jti (único), expires_at | — |

Los precios y montos son enteros en pesos chilenos. Las restricciones (`price > 0`, `amount > 0`, `current_balance >= 0`) existen tanto en la base de datos (check constraints) como en los modelos.

## API REST (`/api/v1`)
| Recurso | Endpoints |
|---|---|
| Auth | `POST /auth/signup`, `POST /auth/login`, `DELETE /auth/logout`, `GET /auth/me` |
| **CRUD 1** Locales | `GET/POST /restaurants`, `GET/PATCH/DELETE /restaurants/:id` (filtros `category`, `q`) |
| **CRUD 2** Platos | `GET/POST /menu_items`, `GET/PATCH/DELETE /menu_items/:id` (filtros `restaurant_id`, `category`, `min_price`, `max_price`) |
| **CRUD 3** Gastos | `GET/POST /expenses`, `GET/PATCH/DELETE /expenses/:id` (solo del usuario autenticado) |
| Recomendador | `GET /recommendations?budget=NNNN` |

Códigos HTTP: 200, 201, 204, 400 (parámetro faltante), 401 (sin sesión / credenciales), 404, 422 (validaciones). Errores con formato `{ "error": "...", "details": { campo: ["..."] } }`.

Roles y permisos no forman parte de esta entrega (Tarea 2).

## Instalación y ejecución local
Requisitos: Ruby 3.2+, Rails 7.1+ / 8, PostgreSQL 14+, Node 20+.

```bash
# Backend
cd backend
bundle install
bin/rails db:create db:migrate db:seed
bin/rails s            # http://localhost:3000

# Frontend
cd frontend
npm install
npm run dev            # http://localhost:5173
```

## Variables de entorno
| Variable | Dónde | Descripción |
|---|---|---|
| `DATABASE_URL` | backend (producción) | Conexión a PostgreSQL |
| `SECRET_KEY_BASE` | backend (producción) | Firma de JWT y cookies (`bin/rails secret`) |
| `FRONTEND_ORIGIN` | backend | Origen(es) permitidos por CORS, separados por coma |
| `RAILS_ENV` | backend | `production` en el deploy |
| `VITE_API_URL` | frontend (build) | URL de la API, ej. `https://api.../api/v1` |

## Tests
`bin/rails test` (si se agregan pruebas). Prueba manual de la API: ver `docs/api_examples.md`.
