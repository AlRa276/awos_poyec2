import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { tokenRepository } from '@/repositories/token.repository';
import { AppError } from '@/lib/errors';

export const requireAuth = async (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : req.cookies.get('token')?.value;

  if (!token) throw new AppError('No autorizado', 401);

  const revoked = await tokenRepository.isRevoked(token);
  if (revoked) throw new AppError('Sesión expirada, inicia sesión de nuevo', 401);

  const payload = verifyToken(token);
  return { payload, token };
};
