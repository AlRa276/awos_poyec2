import { NextRequest } from 'next/server';
import { authService } from '@/services/auth.service';
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

export const authController = {
  register: async (req: NextRequest) => {
    try {
      const body = await req.json();
      const usuario = await authService.register(body);
      return successResponse(usuario, {
        status: 201,
        detail: `Se creó la cuenta para ${usuario.email}`,
      });
    } catch (error) {
      return handleError(error);
    }
  },

  login: async (req: NextRequest) => {
    try {
      const body = await req.json();
      const { token, usuario } = await authService.login(body);

      const response = successResponse(usuario, {
        status: 200,
        detail: `Bienvenido de nuevo, ${usuario.name}`,
      });
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
      return response;
    } catch (error) {
      return handleError(error);
    }
  },

  logout: async (req: NextRequest) => {
    try {
      const { payload, token } = await requireAuth(req);
      await authService.logout(token, payload.id);

      const response = successResponse(null, {
        status: 200,
        detail: 'El token fue revocado',
      });
      response.cookies.delete('token');
      return response;
    } catch (error) {
      return handleError(error);
    }
  },

  update: async (req: NextRequest, id: number) => {
    try {
      const { payload } = await requireAuth(req);
      if (payload.id !== id) {
        throw new AppError('El id del token no coincide con el usuario que intentas editar', 403);
      }

      const body = await req.json();
      const usuario = await authService.update(id, body);
      return successResponse(usuario, {
        status: 200,
        detail: `Se actualizaron los datos de ${usuario.email}`,
      });
    } catch (error) {
      return handleError(error);
    }
  },

  delete: async (req: NextRequest, id: number) => {
    try {
      const { payload } = await requireAuth(req);
      if (payload.id !== id) {
        throw new AppError('El id del token no coincide con el usuario que intentas eliminar', 403);
      }

      await authService.delete(id);
      return successResponse(null, {
        status: 200,
        detail: `Se eliminó la cuenta con id ${id}`,
      });
    } catch (error) {
      return handleError(error);
    }
  },
};
