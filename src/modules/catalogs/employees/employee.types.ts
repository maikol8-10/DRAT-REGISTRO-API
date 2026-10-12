export type CreateEmployeeInput = {
  identification: string;
  name: string;
  department: string;
  position: string;
};

export type UpdateEmployeeInput = Partial<Omit<CreateEmployeeInput, 'identification'>> & { active?: boolean };
