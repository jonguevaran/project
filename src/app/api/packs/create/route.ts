import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // Validación básica
    if (
      !data.name ||
      !data.clientEmail ||
      !data.photogEmail ||
      data.directoryId === undefined || data.directoryId === null ||
      data.maxPhotos === undefined || data.maxPhotos === null ||
      !data.token
    ) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }
    try {
      const pack = await prisma.pack.create({
        data: {
          name: data.name,
          directoryId: data.directoryId,
          clientEmail: data.clientEmail,
          photogEmail: data.photogEmail,
          maxPhotos: data.maxPhotos,
          language: data.language || 'es',
          status: 'ASIGNADO',
          token: data.token,
          watermarkText: data.watermarkText,
          watermarkOpacity: data.watermarkOpacity,
        },
      });
      return NextResponse.json(pack);
    } catch (err: any) {
      if (err.code === 'P2002' && err.meta?.target?.includes('token')) {
        return NextResponse.json({ error: 'El token ya existe, debe ser único.' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Error al crear el pack', details: err.message || err.toString() }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: 'Error inesperado', details: err.message || err.toString() }, { status: 500 });
  }
}
