import { Usuario } from '@prisma/client';
import { usuarioRepository } from '@/repositories/usuario.repository';
import { tokenRepository } from '@/repositories/token.repository';
import { hashPassword, comparePassword } from '@/lib/bcrypt';
import { signToken, getTokenExpiryDate } from '@/lib/jwt';
import { AppError } from '@/lib/errors';
import { LoginDTO, RegisterDTO, UpdateUsuarioDTO, UsuarioPublic } from '@/models/usuario.model';

const toPublic = (usuario: Usuario): UsuarioPublic => {
  const { password, ...rest } = usuario;
  return rest;
};

export const authService = {
  register: async (data: RegisterDTO) => {
    const existing = await usuarioRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError(`Ya existe una cuenta asociada a ${data.email}`, 409);
    }

    const hashed = await hashPassword(data.password);
    const usuario = await usuarioRepository.create({ ...data, password: hashed });
    return toPublic(usuario);
  },

  login: async ({ email, password }: LoginDTO) => {
    const usuario = await usuarioRepository.findByEmail(email);
    if (!usuario) {
      throw new AppError('El correo o la contraseña no coinciden', 401);
    }

    const valid = await comparePassword(password, usuario.password);
    if (!valid) {
      throw new AppError('El correo o la contraseña no coinciden', 401);
    }

    const token = signToken({ id: usuario.id, email: usuario.email });
    return { token, usuario: toPublic(usuario) };
  },

  logout: async (token: string, idUsuario: number) => {
    const expiraEn = getTokenExpiryDate(token);
    await tokenRepository.revoke(token, idUsuario, expiraEn);
  },

  update: async (id: number, data: UpdateUsuarioDTO) => {
    const payload = { ...data };
    if (payload.password) {
      payload.password = await hashPassword(payload.password);
    }
    const usuario = await usuarioRepository.update(id, payload);
    return toPublic(usuario);
  },

  delete: async (id: number) => {
    await usuarioRepository.delete(id);
  },
};
