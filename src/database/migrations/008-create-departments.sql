CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO departments (name)
VALUES
  ('Administración'),
  ('Dirección Regional'),
  ('Operaciones'),
  ('Recursos Humanos'),
  ('Seguridad')
ON CONFLICT (name) DO NOTHING;

INSERT INTO departments (name)
SELECT DISTINCT TRIM(department)
FROM employees
WHERE TRIM(department) <> ''
ON CONFLICT (name) DO NOTHING;

CREATE INDEX IF NOT EXISTS departments_active_name_idx ON departments (active, name);
