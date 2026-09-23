# Jira

1. Crear un proyecto Scrum o Kanban (ej. clave `BF`).
2. Configurar el workflow con las columnas: **BACKLOG, DESARROLLO, REVISIÓN, QA, PRODUCCIÓN** (Configuración del tablero → Columnas y estados).
3. Importar `jira_tareas.csv` (Configuración → Sistema → Importación CSV). Mapear: Issue Id → Issue Id, Issue Type → Issue Type, Summary, Description, Parent → Parent, Labels. Si tu Jira no acepta `Parent` en subtareas, importa las épicas e historias y crea las subtareas a mano.
4. Asignar responsable en cada tarea y conectar cada Pull Request de GitHub (poner la clave, ej. `BF-12`, en el nombre de la rama o del PR).
5. Ir moviendo las tarjetas durante el desarrollo: el tablero debe mostrar el estado real, no actualizarse solo al final.
