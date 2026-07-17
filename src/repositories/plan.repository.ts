import { prisma } from '@/lib/prisma';
import { CreatePlanDTO, UpdatePlanDTO } from '@/models/plan.model';

export const planRepository = {
  create: (idUsuario: number, data: CreatePlanDTO) =>
    prisma.planes.create({
      data: {
        ...data,
        idUsuario,
        fecha: data.fecha ? new Date(data.fecha) : undefined,
      },
    }),

  findAllByUsuario: (idUsuario: number) =>
    prisma.planes.findMany({
      where: { idUsuario },
      include: { ciudad: true },
      orderBy: { fecha: 'asc' },
    }),

  findByCiudad: (idUsuario: number, idCiudad: number) =>
    prisma.planes.findMany({
      where: { idUsuario, idCiudad },
      orderBy: { fecha: 'asc' },
    }),

  findById: (id: number) => prisma.planes.findUnique({ where: { id } }),

  update: (id: number, data: UpdatePlanDTO) =>
    prisma.planes.update({
      where: { id },
      data: {
        ...data,
        fecha: data.fecha ? new Date(data.fecha) : undefined,
      },
    }),

  delete: (id: number) => prisma.planes.delete({ where: { id } }),
};
