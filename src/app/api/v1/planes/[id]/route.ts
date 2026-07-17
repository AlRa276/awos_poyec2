import { NextRequest } from 'next/server';
import { planController } from '@/controllers/plan.controller';

export const GET = (req: NextRequest, { params }: { params: { id: string } }) =>
  planController.getOne(req, Number(params.id));

export const PUT = (req: NextRequest, { params }: { params: { id: string } }) =>
  planController.update(req, Number(params.id));

export const DELETE = (req: NextRequest, { params }: { params: { id: string } }) =>
  planController.delete(req, Number(params.id));
