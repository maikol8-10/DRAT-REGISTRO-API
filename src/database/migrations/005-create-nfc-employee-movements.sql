CREATE TABLE IF NOT EXISTS nfc_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(80) NOT NULL UNIQUE,
  employee_id UUID NOT NULL UNIQUE REFERENCES employees(id),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id),
  nfc_tag_id UUID NOT NULL REFERENCES nfc_tags(id),
  movement_type VARCHAR(10) NOT NULL CHECK (movement_type IN ('INGRESO', 'SALIDA')),
  source VARCHAR(20) NOT NULL CHECK (source IN ('NFC_SIMULADO', 'NFC_FISICO')),
  confirmed_by_user_id UUID NOT NULL REFERENCES users(id),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS nfc_tags_employee_active_idx ON nfc_tags (employee_id, active);
CREATE INDEX IF NOT EXISTS employee_movements_employee_date_idx ON employee_movements (employee_id, occurred_at DESC);
