import { NextRequest } from 'next/server';
import { ciudadController } from '@/controllers/ciudad.controller';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return ciudadController.getOne(req, Number(id));
};

export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return ciudadController.update(req, Number(id));
};

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return ciudadController.delete(req, Number(id));
};
