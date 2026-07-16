export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UpdateUsuarioDTO {
  name?: string;
  email?: string;
  password?: string;
}

export interface UsuarioPublic {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
