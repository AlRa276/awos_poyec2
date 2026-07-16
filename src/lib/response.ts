import { NextResponse } from 'next/server';
import { STATUS_CODES } from 'http';

interface ApiSuccessBody<T> {
  code: number;
  message: string;
  detail: string;
  data: T;
}

interface ApiErrorBody {
  code: number;
  message: string;
  detail: string;
}

const statusMessage = (status: number) => (STATUS_CODES[status] || 'UNKNOWN').toUpperCase();

export const successResponse = <T>(
  data: T,
  { status = 200, detail = '' }: { status?: number; detail?: string } = {}
) => {
  const body: ApiSuccessBody<T> = {
    code: status,
    message: statusMessage(status),
    detail,
    data,
  };
  return NextResponse.json(body, { status });
};

export const errorResponse = ({
  status = 500,
  detail = '',
}: {
  status?: number;
  detail?: string;
}) => {
  const body: ApiErrorBody = {
    code: status,
    message: statusMessage(status),
    detail,
  };
  return NextResponse.json(body, { status });
};
