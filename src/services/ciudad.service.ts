import { Prisma } from '@prisma/client';
import { ciudadRepository } from '@/repositories/ciudad.repository';
import { AppError } from '@/lib/errors';
import { CreateCiudadDTO, UpdateCiudadDTO } from '@/models/ciudad.model';
import { normalizeText } from '@/lib/normalize';
import {
  geocodeCiudad,
  getClimaActual as getClimaActualMicroservicio,
} from '@/lib/climaMicroservicio';

const findOwnedOrFail = async (id: number, idUsuario: number) => {
  const ciudad = await ciudadRepository.findById(id);
  if (!ciudad) throw new AppError('Ciudad no encontrada', 404);
  if (ciudad.idUsuario !== idUsuario) {
    throw new AppError('No tienes permiso sobre esta ciudad', 403);
  }
  return ciudad;
};

const duplicateMessage = (nombre: string, estado?: string | null) =>
  `Ya tienes registrada la ciudad "${nombre}"${estado ? ` en ${estado}` : ''}`;

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

    const nombreNormalizado = normalizeText(data.nombre);
    const estadoNormalizado = normalizeText(data.estado);

    const duplicada = await ciudadRepository.findDuplicate(
      idUsuario,
      nombreNormalizado,
      estadoNormalizado,
      data.codigoPais
    );
    if (duplicada) {
      throw new AppError(duplicateMessage(data.nombre, data.estado), 409);
    }

    const { lat, lon } = await resolveCoordinates(data);

    try {
      return await ciudadRepository.create(idUsuario, {
        ...data,
        lat,
        lon,
        nombreNormalizado,
        estadoNormalizado,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new AppError(duplicateMessage(data.nombre, data.estado), 409);
      }
      throw error;
    }
  },

  listByUsuario: async (idUsuario: number) => {
    return ciudadRepository.findAllByUsuario(idUsuario);
  },

  getById: async (id: number, idUsuario: number) => {
    return findOwnedOrFail(id, idUsuario);
  },

  update: async (id: number, idUsuario: number, data: UpdateCiudadDTO) => {
    const ciudadActual = await findOwnedOrFail(id, idUsuario);

    const tocaIdentidad =
      data.nombre !== undefined || data.estado !== undefined || data.codigoPais !== undefined;

    if (!tocaIdentidad) {
      return ciudadRepository.update(id, data);
    }

    const nombre = data.nombre ?? ciudadActual.nombre;
    const estado = data.estado !== undefined ? data.estado : ciudadActual.estado;
    const codigoPais = data.codigoPais ?? ciudadActual.codigoPais;

    const nombreNormalizado = normalizeText(nombre);
    const estadoNormalizado = normalizeText(estado);

    const duplicada = await ciudadRepository.findDuplicate(
      idUsuario,
      nombreNormalizado,
      estadoNormalizado,
      codigoPais,
      id
    );
    if (duplicada) {
      throw new AppError(duplicateMessage(nombre, estado), 409);
    }

    try {
      return await ciudadRepository.update(id, { ...data, nombreNormalizado, estadoNormalizado });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new AppError(duplicateMessage(nombre, estado), 409);
      }
      throw error;
    }
  },

  delete: async (id: number, idUsuario: number) => {
    await findOwnedOrFail(id, idUsuario);
    await ciudadRepository.delete(id);
  },

  getClimaActual: async (id: number, idUsuario: number) => {
    const ciudad = await findOwnedOrFail(id, idUsuario);
    if (ciudad.lat === null || ciudad.lon === null) {
      throw new AppError('Esta ciudad todavía no tiene coordenadas geocodificadas', 409);
    }
    return getClimaActualMicroservicio({ lat: Number(ciudad.lat), lon: Number(ciudad.lon) });
  },
};
