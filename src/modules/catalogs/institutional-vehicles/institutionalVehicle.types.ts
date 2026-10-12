export const fuelTypes = ['GASOLINA', 'DIESEL', 'ELECTRICO', 'HIBRIDO', 'OTRO'] as const;

export type FuelType = typeof fuelTypes[number];

export type CreateInstitutionalVehicleInput = {
  plate: string;
  assetCode: string;
  brand: string;
  model: string;
  year: number;
  fuelType: FuelType;
};

export type UpdateInstitutionalVehicleInput = Partial<Omit<CreateInstitutionalVehicleInput, 'plate'>> & {
  active?: boolean;
};
