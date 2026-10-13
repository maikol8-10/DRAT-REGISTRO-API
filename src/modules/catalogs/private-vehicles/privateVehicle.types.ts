export type CreatePrivateVehicleInput = {
  plate: string;
  brand: string;
  model: string;
  color: string;
  ownerEmployeeId: string;
};

export type UpdatePrivateVehicleInput = Partial<Omit<CreatePrivateVehicleInput, 'plate'>> & {
  active?: boolean;
};
