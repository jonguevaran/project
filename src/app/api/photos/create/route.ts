import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file');
  const packId = formData.get('packId');
  if (!file || !packId || typeof packId !== 'string' || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
  }

  // Obtener datos del pack para la marca de agua
  const pack = await prisma.pack.findUnique({ where: { id: packId } });
  if (!pack) {
    return NextResponse.json({ error: 'Pack no encontrado' }, { status: 404 });
  }
  const watermarkText = pack.watermarkText || '';
  const watermarkOpacity = pack.watermarkOpacity ?? 0.5;

  // Leer el archivo en buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filename = (file as any).name || `foto_${Date.now()}.jpg`;
  const outputPath = path.join(process.cwd(), 'public', 'fotos', filename);

  // Crear marca de agua como buffer PNG
  const svgWatermark = `<svg width="500" height="80"><text x="10" y="50" font-size="40" fill="white" fill-opacity="${watermarkOpacity}" font-family="Arial">${watermarkText}</text></svg>`;
  const watermarkBuffer = Buffer.from(svgWatermark);

  await sharp(buffer)
    .resize({ width: 1600 }) // optimización para web
    .composite([{ input: watermarkBuffer, gravity: 'southeast' }])
    .toFormat('jpeg', { quality: 80 })
    .toFile(outputPath);

  // Guardar registro en la base de datos
  const photo = await prisma.photo.create({
    data: {
      packId,
      filename,
      selected: false,
    },
  });
  return NextResponse.json(photo);
}
