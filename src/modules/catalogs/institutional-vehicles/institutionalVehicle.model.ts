import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from 'sequelize';

import { requireDatabase } from '../../../config/database.js';
import type { FuelType } from './institutionalVehicle.types.js';

export class InstitutionalVehicle extends Model<InferAttributes<InstitutionalVehicle>, InferCreationAttributes<InstitutionalVehicle>> {
  declare id: CreationOptional<string>;
  declare plate: string;
  declare assetCode: string;
  declare brand: string;
  declare model: string;
  declare year: number;
  declare fuelType: FuelType;
  declare ownershipType: CreationOptional<'INSTITUCIONAL'>;
  declare active: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

let initialized = false;

export function getInstitutionalVehicleModel() {
  if (!initialized) {
    InstitutionalVehicle.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        plate: { type: DataTypes.STRING(15), allowNull: false, unique: true },
        assetCode: { type: DataTypes.STRING(40), allowNull: false, unique: true, field: 'asset_code' },
        brand: { type: DataTypes.STRING(80), allowNull: false },
        model: { type: DataTypes.STRING(80), allowNull: false },
        year: { type: DataTypes.INTEGER, allowNull: false },
        fuelType: { type: DataTypes.STRING(20), allowNull: false, field: 'fuel_type' },
        ownershipType: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'INSTITUCIONAL', field: 'ownership_type' },
        active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      { sequelize: requireDatabase(), tableName: 'institutional_vehicles', modelName: 'InstitutionalVehicle' },
    );
    initialized = true;
  }
  return InstitutionalVehicle;
}
