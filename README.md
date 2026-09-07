# DRAT-REGISTRO-API

API REST y servicios de backend del sistema SICAF para el DRAT.

## Tecnologías

- Node.js y Express
- TypeScript
- PostgreSQL
- Sequelize ORM
- JSON Web Token (JWT)
- Vitest y Supertest

## Instalación

```powershell
npm.cmd install
Copy-Item .env.example .env
```

## Ejecución

```powershell
npm.cmd run dev
```

La API inicia de forma predeterminada en `http://localhost:3000`.

## Comprobación de estado

```text
GET http://localhost:3000/health
```

La respuesta confirma el estado de la API e indica si la conexión a PostgreSQL está configurada. Para comprobar la base de datos en cada solicitud de estado, configure `DATABASE_URL` y `DATABASE_CHECK_ENABLED=true`.

## Variables de entorno

| Variable | Propósito |
| --- | --- |
| `PORT` | Puerto HTTP de la API |
| `NODE_ENV` | Entorno de ejecución |
| `DATABASE_URL` | Conexión PostgreSQL utilizada por Sequelize |
| `DATABASE_CHECK_ENABLED` | Habilita la comprobación de PostgreSQL en `/health` |
| `JWT_SECRET` | Secreto para firmar y validar tokens |
| `JWT_EXPIRES_IN` | Vigencia de los tokens |
| `CORS_ORIGIN` | Origen autorizado del panel web |

No se deben registrar secretos reales en Git.

## Estructura

```text
src/
  config/          Entorno y conexión con PostgreSQL
  middleware/      Autenticación JWT y manejo de errores
  modules/         Autenticación, catálogos, movimientos, auditoría y sincronización
  routes/          Rutas principales de la API
  app.ts           Configuración de Express
  server.ts        Arranque del servidor
```

Los módulos están preparados, pero sus operaciones de negocio se implementarán en las historias posteriores.

La arquitectura, las direcciones de comunicación local y las integraciones previstas están documentadas en [`docs/architecture.md`](docs/architecture.md). También existe un [diagrama editable en FigJam](https://www.figma.com/board/JniN3acMMwkc28n4GDimNq).

## Validaciones

```powershell
npm.cmd run lint
npm.cmd run test
npm.cmd run build
```

La auditoría de dependencias de producción registra una advertencia moderada transitiva de `uuid` incluida por Sequelize 6. No afecta los flujos implementados y `npm audit fix --force` no debe utilizarse porque propone instalar Sequelize 3, una versión incompatible.

## Evidencia de la preparación técnica

El 7 de septiembre de 2026 se obtuvieron los siguientes resultados:

- ESLint completado sin errores.
- Tres pruebas automatizadas aprobadas: estado, registro de módulos y respuesta 404.
- TypeScript compilado correctamente para producción.
- Servidor compilado ejecutado correctamente en el puerto 3000.
- `GET /health` respondió `200` con el servicio en estado `ok` y PostgreSQL identificado como motor.
- `GET /api/v1` publicó autenticación, catálogos, movimientos, auditoría y sincronización.
- La consulta de `/health` desde el origen del panel `http://localhost:5173` respondió `200` con CORS autorizado.
- La consulta equivalente de la aplicación móvil respondió con el servicio `sicaf-api` en estado `ok`.

La conexión real a PostgreSQL queda pendiente de proporcionar las credenciales locales mediante `DATABASE_URL`; la ausencia de credenciales no impide iniciar ni comprobar la API.

El desarrollo se realiza en `dev`; `main` se reserva para versiones estables.
