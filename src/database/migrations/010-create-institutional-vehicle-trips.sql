ALTER TABLE employee_movements DROP CONSTRAINT IF EXISTS employee_movements_source_check;
ALTER TABLE employee_movements ALTER COLUMN source TYPE VARCHAR(30);
ALTER TABLE employee_movements ADD CONSTRAINT employee_movements_source_check
  CHECK (source IN ('NFC_SIMULADO', 'NFC_FISICO', 'BUSQUEDA_MANUAL', 'VEHICULO_PARTICULAR', 'VEHICULO_INSTITUCIONAL'));

CREATE TABLE IF NOT EXISTS institutional_vehicle_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  soin_number VARCHAR(50) NOT NULL UNIQUE,
  vehicle_id UUID NOT NULL REFERENCES institutional_vehicles(id),
  driver_employee_id UUID NOT NULL REFERENCES employees(id),
  destination VARCHAR(200) NOT NULL,
  departure_mileage INTEGER NOT NULL CHECK (departure_mileage >= 0),
  departure_fuel INTEGER NOT NULL CHECK (departure_fuel BETWEEN 0 AND 100),
  departure_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  departure_confirmed_by_user_id UUID NOT NULL REFERENCES users(id),
  return_mileage INTEGER CHECK (return_mileage >= 0),
  return_fuel INTEGER CHECK (return_fuel BETWEEN 0 AND 100),
  return_at TIMESTAMPTZ,
  return_confirmed_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (return_mileage IS NULL OR return_mileage >= departure_mileage)
);

CREATE TABLE IF NOT EXISTS institutional_vehicle_trip_occupants (
  trip_id UUID NOT NULL REFERENCES institutional_vehicle_trips(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id),
  PRIMARY KEY (trip_id, employee_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS institutional_vehicle_open_trip_idx
  ON institutional_vehicle_trips (vehicle_id) WHERE return_at IS NULL;
CREATE INDEX IF NOT EXISTS institutional_vehicle_trips_departure_idx
  ON institutional_vehicle_trips (departure_at DESC);
