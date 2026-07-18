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

const duplicatePostalMessage = (codigoPostal: string) =>
  `Ya tienes registrada una ciudad con el código postal ${codigoPostal}`;

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

const assertNoDuplicado = async (
  idUsuario: number,
  nombreNormalizado: string,
  estadoNormalizado: string,
  codigoPais: string,
  codigoPostal: string | undefined,
  nombre: string,
  estado: string | undefined,
  excludeId?: number
) => {
  const duplicadaPorIdentidad = await ciudadRepository.findDuplicate(
    idUsuario,
    nombreNormalizado,
    estadoNormalizado,
    codigoPais,
    excludeId
  );
  if (duplicadaPorIdentidad) {
    throw new AppError(duplicateMessage(nombre, estado), 409);
  }

  if (codigoPostal) {
    const duplicadaPorPostal = await ciudadRepository.findByCodigoPostal(
      idUsuario,
      codigoPostal,
      excludeId
    );
    if (duplicadaPorPostal) {
      throw new AppError(duplicatePostalMessage(codigoPostal), 409);
    }
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

    await assertNoDuplicado(
      idUsuario,
      nombreNormalizado,
      estadoNormalizado,
      data.codigoPais,
      data.codigoPostal,
      data.nombre,
      data.estado
    );

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
        // El target del error nos dice cuál de los dos constraints chocó
        const target = (error.meta?.target as string[] | undefined)?.join(',') ?? '';
        if (target.includes('codigo_postal') && data.codigoPostal) {
          throw new AppError(duplicatePostalMessage(data.codigoPostal), 409);
        }
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
    const tocaPostal = data.codigoPostal !== undefined;

    if (!tocaIdentidad && !tocaPostal) {
      return ciudadRepository.update(id, data);
    }

    const nombre = data.nombre ?? ciudadActual.nombre;
    const estado = data.estado !== undefined ? data.estado : ciudadActual.estado;
    const codigoPais = data.codigoPais ?? ciudadActual.codigoPais;
    const codigoPostal =
      data.codigoPostal !== undefined ? data.codigoPostal : ciudadActual.codigoPostal;

    const nombreNormalizado = normalizeText(nombre);
    const estadoNormalizado = normalizeText(estado);

    await assertNoDuplicado(
      idUsuario,
      nombreNormalizado,
      estadoNormalizado,
      codigoPais,
      codigoPostal ?? undefined,
      nombre,
      estado ?? undefined,
      id
    );

    try {
      return await ciudadRepository.update(id, { ...data, nombreNormalizado, estadoNormalizado });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const target = (error.meta?.target as string[] | undefined)?.join(',') ?? '';
        if (target.includes('codigo_postal') && codigoPostal) {
          throw new AppError(duplicatePostalMessage(codigoPostal), 409);
        }
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
