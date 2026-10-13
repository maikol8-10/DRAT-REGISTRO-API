CREATE TABLE IF NOT EXISTS private_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate VARCHAR(15) NOT NULL UNIQUE,
  brand VARCHAR(80) NOT NULL,
  model VARCHAR(80) NOT NULL,
  color VARCHAR(50) NOT NULL,
  owner_employee_id UUID NOT NULL REFERENCES employees(id),
  ownership_type VARCHAR(20) NOT NULL DEFAULT 'PARTICULAR' CHECK (ownership_type = 'PARTICULAR'),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS private_vehicle_owner_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES private_vehicles(id),
  employee_id UUID NOT NULL REFERENCES employees(id),
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  CHECK (valid_until IS NULL OR valid_until >= valid_from)
);

CREATE UNIQUE INDEX IF NOT EXISTS private_vehicle_current_owner_idx
  ON private_vehicle_owner_history (vehicle_id) WHERE valid_until IS NULL;
CREATE INDEX IF NOT EXISTS private_vehicles_owner_idx ON private_vehicles (owner_employee_id, active);
CREATE INDEX IF NOT EXISTS private_vehicle_owner_history_employee_idx
  ON private_vehicle_owner_history (employee_id, valid_from);
