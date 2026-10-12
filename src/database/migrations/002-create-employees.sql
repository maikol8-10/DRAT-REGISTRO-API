CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identification VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  department VARCHAR(120) NOT NULL,
  position VARCHAR(120) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS employees_name_idx ON employees (name);
CREATE INDEX IF NOT EXISTS employees_department_active_idx ON employees (department, active);
