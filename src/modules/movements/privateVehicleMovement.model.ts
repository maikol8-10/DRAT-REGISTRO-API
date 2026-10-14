import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from 'sequelize';

import { requireDatabase } from '../../config/database.js';
import type { MovementType } from './employeeMovement.model.js';

export class PrivateVehicleMovement extends Model<InferAttributes<PrivateVehicleMovement>, InferCreationAttributes<PrivateVehicleMovement>> {
  declare id: CreationOptional<string>;
  declare vehicleId: string;
  declare driverEmployeeId: string;
  declare movementType: MovementType;
  declare source: 'PLACA_MANUAL' | 'OCR' | 'CONTINGENCIA';
  declare confirmedByUserId: string;
  declare occurredAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

let initialized = false;
export function getPrivateVehicleMovementModel() {
  if (!initialized) {
    PrivateVehicleMovement.init({
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      vehicleId: { type: DataTypes.UUID, allowNull: false, field: 'vehicle_id' },
      driverEmployeeId: { type: DataTypes.UUID, allowNull: false, field: 'driver_employee_id' },
      movementType: { type: DataTypes.STRING(10), allowNull: false, field: 'movement_type' },
      source: { type: DataTypes.STRING(20), allowNull: false },
      confirmedByUserId: { type: DataTypes.UUID, allowNull: false, field: 'confirmed_by_user_id' },
      occurredAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'occurred_at' },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    }, { sequelize: requireDatabase(), tableName: 'private_vehicle_movements', modelName: 'PrivateVehicleMovement' });
    initialized = true;
  }
  return PrivateVehicleMovement;
}
