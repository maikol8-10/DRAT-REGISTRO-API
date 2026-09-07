export const moduleRegistry = [
  { key: 'auth', name: 'Autenticación', path: '/api/v1/auth' },
  { key: 'catalogs', name: 'Catálogos', path: '/api/v1/catalogs' },
  { key: 'movements', name: 'Movimientos', path: '/api/v1/movements' },
  { key: 'audit', name: 'Auditoría', path: '/api/v1/audit' },
  { key: 'synchronization', name: 'Sincronización', path: '/api/v1/synchronization' },
] as const;
