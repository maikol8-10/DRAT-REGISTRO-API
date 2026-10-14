ALTER TABLE employee_movements DROP CONSTRAINT IF EXISTS employee_movements_source_check;
ALTER TABLE employee_movements ADD CONSTRAINT employee_movements_source_check
  CHECK (source IN ('NFC_SIMULADO', 'NFC_FISICO', 'BUSQUEDA_MANUAL', 'VEHICULO_PARTICULAR', 'VEHICULO_INSTITUCIONAL', 'CONTINGENCIA'));

ALTER TABLE private_vehicle_movements DROP CONSTRAINT IF EXISTS private_vehicle_movements_source_check;
ALTER TABLE private_vehicle_movements ALTER COLUMN source TYPE VARCHAR(20);
ALTER TABLE private_vehicle_movements ADD CONSTRAINT private_vehicle_movements_source_check
  CHECK (source IN ('PLACA_MANUAL', 'OCR', 'CONTINGENCIA'));

CREATE TABLE IF NOT EXISTS movement_contingencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('FUNCIONARIO', 'VEHICULO_PARTICULAR')),
  entity_id UUID NOT NULL,
  requested_movement VARCHAR(10) NOT NULL CHECK (requested_movement IN ('INGRESO', 'SALIDA')),
  previous_movement VARCHAR(10) CHECK (previous_movement IN ('INGRESO', 'SALIDA')),
  reason VARCHAR(500) NOT NULL,
  authorized_by_user_id UUID NOT NULL REFERENCES users(id),
  created_movement_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS movement_contingencies_entity_idx
  ON movement_contingencies (entity_type, entity_id, created_at DESC);
