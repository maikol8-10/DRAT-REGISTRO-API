export type CreateEmployeeInput = {
  identification: string;
  name: string;
  department: string;
  position: string;
};

export type UpdateEmployeeInput = Partial<CreateEmployeeInput> & { active?: boolean };
