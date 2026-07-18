export interface CreatePlanDTO {
  idCiudad: number;
  actividad: string;
  fecha: string; // formato ISO "YYYY-MM-DD"
  notas?: string;
  completado?: boolean;
}

export type UpdatePlanDTO = Partial<CreatePlanDTO>;
