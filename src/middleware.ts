import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Detectar desde dónde viene tu frontend de forma dinámica (ej. tu localhost:3000)
  const origin = request.headers.get('origin') || 'http://localhost:3000';

  // 2. Si el navegador envía una petición OPTIONS (Preflight), respondemos rápido con éxito
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }

  // 3. Para las peticiones normales (GET, POST, etc.), dejamos que continúen hacia tus rutas
  const response = NextResponse.next();

  // 4. Inyectamos las cabeceras CORS necesarias a la respuesta final
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  return response;
}

// Esto le dice a Next.js que este middleware controle automáticamente TODO lo que esté dentro de /api/v1
// Cambia la configuración del matcher al final de tu archivo src/middleware.ts
export const config = {
    matcher: [
      '/api/:path*',
      '/api/v1/:path*'
    ],
  };