import { prisma } from '@/lib/prisma';
import { CreateCiudadDTO, UpdateCiudadDTO } from '@/models/ciudad.model';

export const ciudadRepository = {
  create: (idUsuario: number, data: CreateCiudadDTO & { lat: number | null; lon: number | null }) =>
    prisma.ciudad.create({ data: { ...data, idUsuario } }),
  findAllByUsuario: (idUsuario: number) =>
    prisma.ciudad.findMany({
      where: { idUsuario },
      orderBy: { createdAt: 'desc' },
    }),

  findById: (id: number) => prisma.ciudad.findUnique({ where: { id } }),

  update: (id: number, data: UpdateCiudadDTO) => prisma.ciudad.update({ where: { id }, data }),

  delete: (id: number) => prisma.ciudad.delete({ where: { id } }),
};
