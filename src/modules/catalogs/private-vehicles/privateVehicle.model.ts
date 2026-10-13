import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from 'sequelize';

import { requireDatabase } from '../../../config/database.js';

export class PrivateVehicle extends Model<InferAttributes<PrivateVehicle>, InferCreationAttributes<PrivateVehicle>> {
  declare id: CreationOptional<string>;
  declare plate: string;
  declare brand: string;
  declare model: string;
  declare color: string;
  declare ownerEmployeeId: string;
  declare ownershipType: CreationOptional<'PARTICULAR'>;
  declare active: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

let initialized = false;

export function getPrivateVehicleModel() {
  if (!initialized) {
    PrivateVehicle.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        plate: { type: DataTypes.STRING(15), allowNull: false, unique: true },
        brand: { type: DataTypes.STRING(80), allowNull: false },
        model: { type: DataTypes.STRING(80), allowNull: false },
        color: { type: DataTypes.STRING(50), allowNull: false },
        ownerEmployeeId: { type: DataTypes.UUID, allowNull: false, field: 'owner_employee_id' },
        ownershipType: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'PARTICULAR', field: 'ownership_type' },
        active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      { sequelize: requireDatabase(), tableName: 'private_vehicles', modelName: 'PrivateVehicle' },
    );
    initialized = true;
  }
  return PrivateVehicle;
}
