import { NextRequest } from 'next/server';
import { authController } from '@/controllers/auth.controller';

export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return authController.update(req, Number(id));
};

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return authController.delete(req, Number(id));
};
