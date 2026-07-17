import { NextRequest } from 'next/server';
import { planService } from '@/services/plan.service';
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

export const planController = {
  create: async (req: NextRequest) => {
    try {
      const { payload } = await requireAuth(req);
      const body = await req.json();
      const plan = await planService.create(payload.id, body);
      return successResponse(plan, {
        status: 201,
        detail: `Plan "${plan.actividad}" creado correctamente`,
      });
    } catch (error) {
      return handleError(error);
    }
  },

  list: async (req: NextRequest) => {
    try {
      const { payload } = await requireAuth(req);
      const idCiudad = req.nextUrl.searchParams.get('idCiudad');

      const planes = idCiudad
        ? await planService.listByCiudad(payload.id, Number(idCiudad))
        : await planService.listByUsuario(payload.id);

      return successResponse(planes, {
        status: 200,
        detail: `Se encontraron ${planes.length} plan(es)`,
      });
    } catch (error) {
      return handleError(error);
    }
  },

  getOne: async (req: NextRequest, id: number) => {
    try {
      const { payload } = await requireAuth(req);
      const plan = await planService.getById(id, payload.id);
      return successResponse(plan, { status: 200, detail: 'Plan encontrado' });
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (req: NextRequest, id: number) => {
    try {
      const { payload } = await requireAuth(req);
      const body = await req.json();
      const plan = await planService.update(id, payload.id, body);
      return successResponse(plan, {
        status: 200,
        detail: `Plan "${plan.actividad}" actualizado correctamente`,
      });
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (req: NextRequest, id: number) => {
    try {
      const { payload } = await requireAuth(req);
      await planService.delete(id, payload.id);
      return successResponse(null, {
        status: 200,
        detail: `Se eliminó el plan con id ${id}`,
      });
    } catch (error) {
      return handleError(error);
    }
  },
};
