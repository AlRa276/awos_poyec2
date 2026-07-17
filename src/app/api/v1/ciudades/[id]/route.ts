import { NextRequest } from 'next/server';
import { ciudadController } from '@/controllers/ciudad.controller';

export const GET = (req: NextRequest, { params }: { params: { id: string } }) =>
  ciudadController.getOne(req, Number(params.id));

export const PUT = (req: NextRequest, { params }: { params: { id: string } }) =>
  ciudadController.update(req, Number(params.id));

export const DELETE = (req: NextRequest, { params }: { params: { id: string } }) =>
  ciudadController.delete(req, Number(params.id));
