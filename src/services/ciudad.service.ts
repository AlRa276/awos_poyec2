import { ciudadRepository } from '@/repositories/ciudad.repository';
import { AppError } from '@/lib/errors';
import { CreateCiudadDTO, UpdateCiudadDTO } from '@/models/ciudad.model';
import { geocodeCiudad } from '@/lib/climaMicroservicio';

const findOwnedOrFail = async (id: number, idUsuario: number) => {
  const ciudad = await ciudadRepository.findById(id);
  if (!ciudad) throw new AppError('Ciudad no encontrada', 404);
  if (ciudad.idUsuario !== idUsuario) {
    throw new AppError('No tienes permiso sobre esta ciudad', 403);
  }
  return ciudad;
};

// Si el microservicio no está configurado todavía, o si falla,
// la ciudad se crea igual con lat/lon en null (columnas nullable por ahora).
const resolveCoordinates = async (
  data: CreateCiudadDTO
): Promise<{ lat: number | null; lon: number | null }> => {
  if (!process.env.MICROSERVICIO_CLIMA_URL) {
    return { lat: null, lon: null };
  }
  try {
    return await geocodeCiudad(data);
  } catch (error) {
    console.error('Error obteniendo coordenadas:', error);
    return { lat: null, lon: null };
  }
};

export const ciudadService = {
  create: async (idUsuario: number, data: CreateCiudadDTO) => {
    if (!data.nombre || !data.codigoPais) {
      throw new AppError('nombre y codigoPais son obligatorios', 400);
    }
    if (data.codigoPais.length !== 2) {
      throw new AppError('codigoPais debe tener 2 caracteres (ej. MX, US)', 400);
    }

    const { lat, lon } = await resolveCoordinates(data);
    return ciudadRepository.create(idUsuario, { ...data, lat, lon });
  },

  listByUsuario: async (idUsuario: number) => {
    return ciudadRepository.findAllByUsuario(idUsuario);
  },

  getById: async (id: number, idUsuario: number) => {
    return findOwnedOrFail(id, idUsuario);
  },

  update: async (id: number, idUsuario: number, data: UpdateCiudadDTO) => {
    await findOwnedOrFail(id, idUsuario);
    return ciudadRepository.update(id, data);
  },

  delete: async (id: number, idUsuario: number) => {
    await findOwnedOrFail(id, idUsuario);
    await ciudadRepository.delete(id);
  },
};
