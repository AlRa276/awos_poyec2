import { authController } from '@/controllers/auth.controller';
import { NextRequest, NextResponse } from 'next/server';

// 1. Configuramos las cabeceras CORS permitiendo tu localhost:3000
const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true', // 👈 ¡ESTA ES LA LÍNEA QUE DEBES AGREGAR!
  };
// 2. Agregamos el método OPTIONS para responder al preflight del navegador
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// 3. Envolvemos tu controlador original para inyectarle las cabeceras a la respuesta
export async function POST(req: NextRequest) {
  try {
    // Ejecuta el registro tal como lo tenías
    const response = await authController.register(req);

    // Le pega las propiedades de CORS a la respuesta antes de que salga al navegador
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500, headers: corsHeaders }
    );
  }
}