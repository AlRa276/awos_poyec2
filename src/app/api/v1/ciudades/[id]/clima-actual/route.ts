import { NextRequest } from 'next/server';
import { ciudadController } from '@/controllers/ciudad.controller';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return ciudadController.climaActual(req, Number(id));
};
