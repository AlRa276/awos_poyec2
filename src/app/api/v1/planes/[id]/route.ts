import { NextRequest } from 'next/server';
import { planController } from '@/controllers/plan.controller';

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return planController.getOne(req, Number(id));
};

export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return planController.update(req, Number(id));
};

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return planController.delete(req, Number(id));
};
