export interface CreatePlanDTO {
  idCiudad: number;
  actividad: string;
  fecha?: string;
  notas?: string;
  completado?: boolean;
  climaEsperado?: string;
}

export type UpdatePlanDTO = Partial<CreatePlanDTO>;
