import { Ciudad } from '@prisma/client';
import { planRepository } from '@/repositories/plan.repository';
import { ciudadRepository } from '@/repositories/ciudad.repository';
import { AppError } from '@/lib/errors';
import { CreatePlanDTO, UpdatePlanDTO } from '@/models/plan.model';
import { getPronostico } from '@/lib/climaMicroservicio';

const assertCiudadOwned = async (idCiudad: number, idUsuario: number): Promise<Ciudad> => {
  const ciudad = await ciudadRepository.findById(idCiudad);
  if (!ciudad) throw new AppError('La ciudad indicada no existe', 404);
  if (ciudad.idUsuario !== idUsuario) {
    throw new AppError('No tienes permiso sobre esa ciudad', 403);
  }
  return ciudad;
};

const findOwnedOrFail = async (id: number, idUsuario: number) => {
  const plan = await planRepository.findById(id);
  if (!plan) throw new AppError('Plan no encontrado', 404);
  if (plan.idUsuario !== idUsuario) {
    throw new AppError('No tienes permiso sobre este plan', 403);
  }
  return plan;
};

// Necesita que la ciudad ya tenga lat/lon (geocodificada) y que el plan
// tenga fecha. Si falta cualquiera de las dos, o el microservicio no está
// configurado/falla, el plan se crea igual con climaEsperado en null.
const resolvePronostico = async (ciudad: Ciudad, fecha?: string): Promise<string | null> => {
  if (!process.env.MICROSERVICIO_CLIMA_URL) return null;
  if (!fecha) return null;
  if (ciudad.lat === null || ciudad.lon === null) return null;

  try {
    const { climaEsperado } = await getPronostico({
      lat: Number(ciudad.lat),
      lon: Number(ciudad.lon),
      fecha,
    });
    return climaEsperado;
  } catch (error) {
    console.error('Error obteniendo pronóstico:', error);
    return null;
  }
};

export const planService = {
  create: async (idUsuario: number, data: CreatePlanDTO) => {
    if (!data.idCiudad || !data.actividad) {
      throw new AppError('idCiudad y actividad son obligatorios', 400);
    }
    const ciudad = await assertCiudadOwned(data.idCiudad, idUsuario);
    const climaEsperado = await resolvePronostico(ciudad, data.fecha);
    return planRepository.create(idUsuario, { ...data, climaEsperado });
  },

  listByUsuario: async (idUsuario: number) => {
    return planRepository.findAllByUsuario(idUsuario);
  },

  listByCiudad: async (idUsuario: number, idCiudad: number) => {
    await assertCiudadOwned(idCiudad, idUsuario);
    return planRepository.findByCiudad(idUsuario, idCiudad);
  },

  getById: async (id: number, idUsuario: number) => {
    return findOwnedOrFail(id, idUsuario);
  },

  update: async (id: number, idUsuario: number, data: UpdatePlanDTO) => {
    const plan = await findOwnedOrFail(id, idUsuario);

    let ciudad: Ciudad | null = null;
    if (data.idCiudad) {
      ciudad = await assertCiudadOwned(data.idCiudad, idUsuario);
    }

    // Si cambió la fecha o la ciudad, recalculamos el pronóstico
    let climaEsperado: string | null | undefined = undefined;
    if (data.fecha || data.idCiudad) {
      const ciudadParaPronostico = ciudad ?? (await ciudadRepository.findById(plan.idCiudad));
      climaEsperado = await resolvePronostico(
        ciudadParaPronostico as Ciudad,
        data.fecha ?? plan.fecha?.toISOString().split('T')[0]
      );
    }

    return planRepository.update(id, { ...data, climaEsperado });
  },

  delete: async (id: number, idUsuario: number) => {
    await findOwnedOrFail(id, idUsuario);
    await planRepository.delete(id);
  },
};
