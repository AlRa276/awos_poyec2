import { NextRequest } from 'next/server';
import { authController } from '@/controllers/auth.controller';

export const PUT = (req: NextRequest, { params }: { params: { id: string } }) =>
  authController.update(req, Number(params.id));

export const DELETE = (req: NextRequest, { params }: { params: { id: string } }) =>
  authController.delete(req, Number(params.id));
