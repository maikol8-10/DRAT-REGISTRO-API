CREATE TABLE IF NOT EXISTS institutional_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate VARCHAR(15) NOT NULL UNIQUE,
  asset_code VARCHAR(40) NOT NULL UNIQUE,
  brand VARCHAR(80) NOT NULL,
  model VARCHAR(80) NOT NULL,
  year INTEGER NOT NULL CHECK (year BETWEEN 1900 AND 2100),
  fuel_type VARCHAR(20) NOT NULL CHECK (fuel_type IN ('GASOLINA', 'DIESEL', 'ELECTRICO', 'HIBRIDO', 'OTRO')),
  ownership_type VARCHAR(20) NOT NULL DEFAULT 'INSTITUCIONAL' CHECK (ownership_type = 'INSTITUCIONAL'),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS institutional_vehicles_brand_model_idx ON institutional_vehicles (brand, model);
CREATE INDEX IF NOT EXISTS institutional_vehicles_active_idx ON institutional_vehicles (active);
