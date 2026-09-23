# Cómo armar el proyecto (una sola vez)

Este paquete contiene solo los archivos propios de BalanceFood. Se montan sobre los proyectos base generados por Rails y Vite.

## 1. Backend
```bash
rails new balancefood-api --api -d postgresql
cd balancefood-api
bundle add bcrypt jwt rack-cors
# copiar el contenido de backend/ de este paquete sobre la carpeta actual (sobrescribir routes.rb y cors.rb)
bin/rails db:create db:migrate db:seed
bin/rails s
```
Si `rails new` genera un Rails 7.0 o anterior, todo sigue funcionando. `add_check_constraint` requiere Rails 6.1+.

## 2. Frontend
```bash
npm create vite@latest balancefood-web -- --template react
cd balancefood-web
npm install react-router-dom
# copiar frontend/src/ de este paquete sobre src/ (sobrescribir main.jsx, App.jsx, index.css)
# borrar src/App.css y src/assets si no se usan
npm run dev
```

## 3. Repositorios
Se recomienda un monorepo con `/backend` y `/frontend` (o dos repos). Ver `GIT_FLOW.md`.

## 4. Deploy sugerido (Render, plan gratuito)
1. PostgreSQL: crear base en Render y copiar la Internal Database URL.
2. API: Web Service desde el repo (Docker, el `Dockerfile` viene con Rails 7.1+). Variables: `DATABASE_URL`, `SECRET_KEY_BASE`, `RAILS_ENV=production`, `FRONTEND_ORIGIN=https://<tu-frontend>`. Comando de release: `bin/rails db:migrate db:seed`. Para producción edita `config/environments/production.rb` y deja `config.hosts` vacío o con tu dominio, y `config.force_ssl = true` si Render termina TLS.
3. Frontend: Static Site, build `npm ci && npm run build`, publicar `dist`, variable `VITE_API_URL=https://<tu-api>/api/v1`. Agrega una regla de rewrite `/*` → `/index.html` para React Router.
4. Probar `https://<tu-api>/up` y el login con las credenciales de prueba antes de entregar.
