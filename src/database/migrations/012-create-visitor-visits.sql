CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identification VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS visitor_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID NOT NULL REFERENCES visitors(id),
  reason VARCHAR(300) NOT NULL,
  badge_code VARCHAR(40) NOT NULL,
  entry_confirmed_by_user_id UUID NOT NULL REFERENCES users(id),
  exit_confirmed_by_user_id UUID REFERENCES users(id),
  entry_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  exit_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS visitor_visits_open_visitor_idx ON visitor_visits (visitor_id) WHERE exit_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS visitor_visits_open_badge_idx ON visitor_visits (badge_code) WHERE exit_at IS NULL;

ALTER TABLE private_vehicle_movements ALTER COLUMN driver_employee_id DROP NOT NULL;
ALTER TABLE private_vehicle_movements ADD COLUMN IF NOT EXISTS driver_visitor_visit_id UUID REFERENCES visitor_visits(id);
ALTER TABLE private_vehicle_movements ADD COLUMN IF NOT EXISTS owner_authorization_confirmed BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE private_vehicle_movements ADD COLUMN IF NOT EXISTS authorization_note VARCHAR(500);
ALTER TABLE private_vehicle_movements DROP CONSTRAINT IF EXISTS private_vehicle_movements_driver_check;
ALTER TABLE private_vehicle_movements ADD CONSTRAINT private_vehicle_movements_driver_check CHECK (
  (driver_employee_id IS NOT NULL AND driver_visitor_visit_id IS NULL)
  OR (driver_employee_id IS NULL AND driver_visitor_visit_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS private_vehicle_movements_visitor_idx
  ON private_vehicle_movements (driver_visitor_visit_id, occurred_at DESC);
