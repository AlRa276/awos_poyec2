export class AppError extends Error {
  statusCode: number;
  detail: string;

  constructor(detail: string, statusCode = 400) {
    super(detail);
    this.statusCode = statusCode;
    this.detail = detail;
    this.name = 'AppError';
  }
}
