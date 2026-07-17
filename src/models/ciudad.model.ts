export interface CreateCiudadDTO {
  nombre: string;
  estado?: string;
  codigoPais: string;
  codigoPostal?: string;
}

export interface UpdateCiudadDTO {
  nombre?: string;
  estado?: string;
  codigoPais?: string;
  codigoPostal?: string;
}
