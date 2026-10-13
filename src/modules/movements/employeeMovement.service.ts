import { Transaction } from 'sequelize';

import { requireDatabase } from '../../config/database.js';
import { ApiError } from '../../errors/ApiError.js';
import { getEmployeeModel } from '../catalogs/employees/employee.model.js';
import { getNfcTagModel } from '../catalogs/nfc-tags/nfcTag.model.js';
import { normalizeNfcCode } from '../catalogs/nfc-tags/nfcTag.validation.js';
import { getEmployeeMovementModel, type MovementSource, type MovementType } from './employeeMovement.model.js';

type ResolutionResult = {
  tag: { id: string; code: string };
  employee: { id: string; identification: string; name: string; department: string; position: string; active: boolean };
  proposedMovement: MovementType;
  lastMovement: { id: string; movementType: MovementType; occurredAt: Date } | null;
};

type CreatedMovementResult = {
  id: string;
  employeeId: string;
  nfcTagId: string;
  movementType: MovementType;
  source: MovementSource;
  confirmedByUserId: string;
  occurredAt: Date;
  employee: { id: string; identification: string; name: string };
};

async function resolve(code: string, transaction?: Transaction) {
  const tag = await getNfcTagModel().findOne({ where: { code: normalizeNfcCode(code) }, transaction, lock: transaction?.LOCK.UPDATE });
  if (!tag) throw new ApiError(404, 'TAG NFC desconocido');
  if (!tag.active) throw new ApiError(409, 'El TAG NFC está inactivo');
  const employee = await getEmployeeModel().findByPk(tag.employeeId, { transaction });
  if (!employee) throw new ApiError(404, 'El TAG no tiene un funcionario asociado');
  if (!employee.active) throw new ApiError(409, 'El funcionario asociado está inactivo');
  const lastMovement = await getEmployeeMovementModel().findOne({ where: { employeeId: employee.id }, order: [['occurredAt', 'DESC']], transaction });
  const proposedMovement: MovementType = lastMovement?.movementType === 'INGRESO' ? 'SALIDA' : 'INGRESO';
  return { tag, employee, lastMovement, proposedMovement };
}

export async function resolveNfcMovement(code: string): Promise<ResolutionResult> {
  const { tag, employee, lastMovement, proposedMovement } = await resolve(code);
  return {
    tag: { id: tag.id, code: tag.code },
    employee: { id: employee.id, identification: employee.identification, name: employee.name, department: employee.department, position: employee.position, active: employee.active },
    proposedMovement,
    lastMovement: lastMovement ? { id: lastMovement.id, movementType: lastMovement.movementType, occurredAt: lastMovement.occurredAt } : null,
  };
}

export async function createNfcMovement(input: { code: string; movementType: MovementType; source: MovementSource; confirmedByUserId: string }): Promise<CreatedMovementResult> {
  return requireDatabase().transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE }, async (transaction) => {
    const { tag, employee, proposedMovement } = await resolve(input.code, transaction);
    if (input.movementType !== proposedMovement) throw new ApiError(409, `El movimiento válido propuesto es ${proposedMovement}`);
    const movement = await getEmployeeMovementModel().create({ employeeId: employee.id, nfcTagId: tag.id, movementType: proposedMovement, source: input.source, confirmedByUserId: input.confirmedByUserId }, { transaction });
    return {
      id: movement.id,
      employeeId: movement.employeeId,
      nfcTagId: movement.nfcTagId,
      movementType: movement.movementType,
      source: movement.source,
      confirmedByUserId: movement.confirmedByUserId,
      occurredAt: movement.occurredAt,
      employee: { id: employee.id, identification: employee.identification, name: employee.name },
    };
  });
}
