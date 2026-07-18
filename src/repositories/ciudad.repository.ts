import { prisma } from '@/lib/prisma';
import { CreateCiudadDTO, UpdateCiudadDTO } from '@/models/ciudad.model';

export const ciudadRepository = {
  create: (
    idUsuario: number,
    data: CreateCiudadDTO & {
      lat: number | null;
      lon: number | null;
      nombreNormalizado: string;
      estadoNormalizado: string;
    }
  ) => prisma.ciudad.create({ data: { ...data, idUsuario } }),

  findAllByUsuario: (idUsuario: number) =>
    prisma.ciudad.findMany({
      where: { idUsuario },
      orderBy: { createdAt: 'desc' },
    }),

  findById: (id: number) => prisma.ciudad.findUnique({ where: { id } }),

  // excludeId se usa en update, para no marcar la ciudad como duplicada de sí misma
  findDuplicate: (
    idUsuario: number,
    nombreNormalizado: string,
    estadoNormalizado: string,
    codigoPais: string,
    excludeId?: number
  ) =>
    prisma.ciudad.findFirst({
      where: {
        idUsuario,
        nombreNormalizado,
        estadoNormalizado,
        codigoPais,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    }),

  update: (
    id: number,
    data: UpdateCiudadDTO & { nombreNormalizado?: string; estadoNormalizado?: string }
  ) => prisma.ciudad.update({ where: { id }, data }),

  delete: (id: number) => prisma.ciudad.delete({ where: { id } }),
};
