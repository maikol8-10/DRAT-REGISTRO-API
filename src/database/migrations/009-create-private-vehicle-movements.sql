ALTER TABLE employee_movements DROP CONSTRAINT IF EXISTS employee_movements_source_check;
ALTER TABLE employee_movements ADD CONSTRAINT employee_movements_source_check
  CHECK (source IN ('NFC_SIMULADO', 'NFC_FISICO', 'BUSQUEDA_MANUAL', 'VEHICULO_PARTICULAR'));

CREATE TABLE IF NOT EXISTS private_vehicle_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES private_vehicles(id),
  driver_employee_id UUID NOT NULL REFERENCES employees(id),
  movement_type VARCHAR(10) NOT NULL CHECK (movement_type IN ('INGRESO', 'SALIDA')),
  source VARCHAR(20) NOT NULL CHECK (source IN ('PLACA_MANUAL', 'OCR')),
  confirmed_by_user_id UUID NOT NULL REFERENCES users(id),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS private_vehicle_movement_occupants (
  movement_id UUID NOT NULL REFERENCES private_vehicle_movements(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id),
  PRIMARY KEY (movement_id, employee_id)
);

CREATE INDEX IF NOT EXISTS private_vehicle_movements_vehicle_date_idx
  ON private_vehicle_movements (vehicle_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS private_vehicle_movements_driver_date_idx
  ON private_vehicle_movements (driver_employee_id, occurred_at DESC);
