import { planRepository } from '@/repositories/plan.repository';
import { ciudadRepository } from '@/repositories/ciudad.repository';
import { AppError } from '@/lib/errors';
import { CreatePlanDTO, UpdatePlanDTO } from '@/models/plan.model';

const assertCiudadOwned = async (idCiudad: number, idUsuario: number) => {
  const ciudad = await ciudadRepository.findById(idCiudad);
  if (!ciudad) throw new AppError('La ciudad indicada no existe', 404);
  if (ciudad.idUsuario !== idUsuario) {
    throw new AppError('No tienes permiso sobre esa ciudad', 403);
  }
};

const findOwnedOrFail = async (id: number, idUsuario: number) => {
  const plan = await planRepository.findById(id);
  if (!plan) throw new AppError('Plan no encontrado', 404);
  if (plan.idUsuario !== idUsuario) {
    throw new AppError('No tienes permiso sobre este plan', 403);
  }
  return plan;
};

export const planService = {
  create: async (idUsuario: number, data: CreatePlanDTO) => {
    if (!data.idCiudad || !data.actividad) {
      throw new AppError('idCiudad y actividad son obligatorios', 400);
    }
    await assertCiudadOwned(data.idCiudad, idUsuario);
    return planRepository.create(idUsuario, data);
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
    await findOwnedOrFail(id, idUsuario);
    // Si el update intenta mover el plan a otra ciudad, valida esa también
    if (data.idCiudad) {
      await assertCiudadOwned(data.idCiudad, idUsuario);
    }
    return planRepository.update(id, data);
  },

  delete: async (id: number, idUsuario: number) => {
    await findOwnedOrFail(id, idUsuario);
    await planRepository.delete(id);
  },
};
