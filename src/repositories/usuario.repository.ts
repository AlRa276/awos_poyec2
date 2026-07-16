import { prisma } from '@/lib/prisma';
import { RegisterDTO, UpdateUsuarioDTO } from '@/models/usuario.model';

export const usuarioRepository = {
  findByEmail: (email: string) => prisma.usuario.findUnique({ where: { email } }),

  findById: (id: number) => prisma.usuario.findUnique({ where: { id } }),

  create: (data: RegisterDTO) => prisma.usuario.create({ data }),

  update: (id: number, data: UpdateUsuarioDTO) => prisma.usuario.update({ where: { id }, data }),

  delete: (id: number) => prisma.usuario.delete({ where: { id } }),
};
