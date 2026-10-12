import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from 'sequelize';

import { requireDatabase } from '../../../config/database.js';

export class Employee extends Model<InferAttributes<Employee>, InferCreationAttributes<Employee>> {
  declare id: CreationOptional<string>;
  declare identification: string;
  declare name: string;
  declare department: string;
  declare position: string;
  declare active: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

let initialized = false;

export function getEmployeeModel() {
  if (!initialized) {
    Employee.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        identification: { type: DataTypes.STRING(20), allowNull: false, unique: true },
        name: { type: DataTypes.STRING(160), allowNull: false },
        department: { type: DataTypes.STRING(120), allowNull: false },
        position: { type: DataTypes.STRING(120), allowNull: false },
        active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      { sequelize: requireDatabase(), tableName: 'employees', modelName: 'Employee' },
    );
    initialized = true;
  }
  return Employee;
}
