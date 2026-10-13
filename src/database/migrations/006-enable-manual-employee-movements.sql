ALTER TABLE employee_movements ALTER COLUMN nfc_tag_id DROP NOT NULL;

ALTER TABLE employee_movements DROP CONSTRAINT IF EXISTS employee_movements_source_check;
ALTER TABLE employee_movements ADD CONSTRAINT employee_movements_source_check
  CHECK (source IN ('NFC_SIMULADO', 'NFC_FISICO', 'BUSQUEDA_MANUAL'));
