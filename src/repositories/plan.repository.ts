import { prisma } from '@/lib/prisma';
import { CreatePlanDTO, UpdatePlanDTO } from '@/models/plan.model';

export const planRepository = {
  create: (
    idUsuario: number,
    data: CreatePlanDTO & { climaEsperado: string | null; actividadNormalizada: string }
  ) =>
    prisma.planes.create({
      data: {
        ...data,
        idUsuario,
        fecha: new Date(data.fecha),
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

  // excludeId se usa en update, para no marcar el plan como duplicado de sí mismo
  findDuplicate: (
    idUsuario: number,
    idCiudad: number,
    actividadNormalizada: string,
    fecha: string,
    excludeId?: number
  ) =>
    prisma.planes.findFirst({
      where: {
        idUsuario,
        idCiudad,
        actividadNormalizada,
        fecha: new Date(fecha),
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    }),

  update: (
    id: number,
    data: UpdatePlanDTO & { climaEsperado?: string | null; actividadNormalizada?: string }
  ) =>
    prisma.planes.update({
      where: { id },
      data: {
        ...data,
        fecha: data.fecha ? new Date(data.fecha) : undefined,
      },
    }),

  delete: (id: number) => prisma.planes.delete({ where: { id } }),
};
