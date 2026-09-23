# Flujo Git y tablero

Flujo del tablero (columnas Jira): BACKLOG → DESARROLLO → REVISIÓN → QA → PRODUCCIÓN.

Reglas: `main` protegida; una rama por historia o tarea (`feature/BF-12-login-api`); commits pequeños y frecuentes; Pull Request por rama; **el revisor es otro integrante** (no quien programó); merge solo con aprobación; mover la tarjeta de Jira a cada columna al avanzar.

## Orden sugerido de ramas / PRs (Tech Lead: Natalia)
| # | Rama | Contenido | Autor → Revisor |
|---|---|---|---|
| 1 | chore/setup-rails-api | rails new, gems, CORS, README base | Natalia → Bryan |
| 2 | chore/setup-react | Vite + router + estilos base | Ian → Natalia |
| 3 | feature/auth-api | User, JWT, signup/login/logout/me | Bryan → Ian |
| 4 | feature/auth-ui | Login, Registro, contexto de sesión | Ian → Bryan |
| 5 | feature/restaurants-crud | Restaurant (migración, controlador) | Natalia → Ian |
| 6 | feature/menu-items-crud | MenuItem (migración, controlador, filtros) | Bryan → Natalia |
| 7 | feature/crud-ui | CrudPage y pantallas de Locales/Platos | Ian → Bryan |
| 8 | feature/expenses-crud | Expense (API + UI) | Natalia → Ian |
| 9 | feature/recommendations | Servicio, endpoint y slider | Bryan → Natalia |
| 10 | chore/deploy-docs | Deploy, README final, seeds | Natalia → Bryan |

Cada PR: título claro, descripción con la tarea Jira (ej. `BF-12`), capturas si hay UI y comentarios de revisión reales.
Importante: el historial debe reflejar el trabajo real; cada integrante debe hacer sus propios commits.
