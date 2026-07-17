import { AppError } from '@/lib/errors';

const BASE_URL = process.env.MICROSERVICIO_CLIMA_URL;
const TIMEOUT_MS = 8000;

const fetchWithTimeout = async (url: string, options: RequestInit) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new AppError('El microservicio de clima no respondió a tiempo', 504);
    }
    throw new AppError('No se pudo conectar con el microservicio de clima', 502);
  } finally {
    clearTimeout(timeout);
  }
};

export interface GeocodeInput {
  nombre: string;
  estado?: string;
  codigoPais: string;
  codigoPostal?: string;
}

export interface GeocodeOutput {
  lat: number;
  lon: number;
}

export const geocodeCiudad = async (data: GeocodeInput): Promise<GeocodeOutput> => {
  const res = await fetchWithTimeout(`${BASE_URL}/geocode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new AppError('No se pudieron obtener las coordenadas de la ciudad', 502);
  }

  const json = await res.json();
  if (typeof json.lat !== 'number' || typeof json.lon !== 'number') {
    throw new AppError('Respuesta inválida del microservicio de geocoding', 502);
  }
  return { lat: json.lat, lon: json.lon };
};

export interface ForecastInput {
  lat: number;
  lon: number;
  fecha: string;
}

export interface ForecastOutput {
  climaEsperado: string;
}

export const getPronostico = async (data: ForecastInput): Promise<ForecastOutput> => {
  const res = await fetchWithTimeout(`${BASE_URL}/forecast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new AppError('No se pudo obtener el pronóstico del clima', 502);
  }

  const json = await res.json();
  if (typeof json.climaEsperado !== 'string') {
    throw new AppError('Respuesta inválida del microservicio de pronóstico', 502);
  }
  return { climaEsperado: json.climaEsperado };
};
