import { NextRequest } from 'next/server';
import { ciudadService } from '@/services/ciudad.service';
import { requireAuth } from '@/middlewares/auth.middleware';
import { AppError } from '@/lib/errors';
import { successResponse, errorResponse } from '@/lib/response';

const handleError = (error: unknown) => {
  if (error instanceof AppError) {
    return errorResponse({ status: error.statusCode, detail: error.detail });
  }
  console.error(error);
  return errorResponse({
    status: 500,
    detail: error instanceof Error ? error.message : 'Error desconocido',
  });
};

export const ciudadController = {
  create: async (req: NextRequest) => {
    try {
      const { payload } = await requireAuth(req);
      const body = await req.json();
      const ciudad = await ciudadService.create(payload.id, body);
      return successResponse(ciudad, {
        status: 201,
        detail: `Ciudad "${ciudad.nombre}" creada correctamente`,
      });
    } catch (error) {
      return handleError(error);
    }
  },

  list: async (req: NextRequest) => {
    try {
      const { payload } = await requireAuth(req);
      const ciudades = await ciudadService.listByUsuario(payload.id);
      return successResponse(ciudades, {
        status: 200,
        detail: `Se encontraron ${ciudades.length} ciudad(es)`,
      });
    } catch (error) {
      return handleError(error);
    }
  },

  getOne: async (req: NextRequest, id: number) => {
    try {
      const { payload } = await requireAuth(req);
      const ciudad = await ciudadService.getById(id, payload.id);
      return successResponse(ciudad, { status: 200, detail: 'Ciudad encontrada' });
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (req: NextRequest, id: number) => {
    try {
      const { payload } = await requireAuth(req);
      const body = await req.json();
      const ciudad = await ciudadService.update(id, payload.id, body);
      return successResponse(ciudad, {
        status: 200,
        detail: `Ciudad "${ciudad.nombre}" actualizada correctamente`,
      });
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (req: NextRequest, id: number) => {
    try {
      const { payload } = await requireAuth(req);
      await ciudadService.delete(id, payload.id);
      return successResponse(null, {
        status: 200,
        detail: `Se eliminó la ciudad con id ${id}`,
      });
    } catch (error) {
      return handleError(error);
    }
  },

  climaActual: async (req: NextRequest, id: number) => {
    try {
      const { payload } = await requireAuth(req);
      const clima = await ciudadService.getClimaActual(id, payload.id);
      return successResponse(clima, { status: 200, detail: 'Clima actual obtenido' });
    } catch (error) {
      return handleError(error);
    }
  },
};
