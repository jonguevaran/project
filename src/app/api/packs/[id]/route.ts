import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, context: { params: Promise<{ id?: string }> }) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: 'Falta el parámetro id/token' }, { status: 400 });
  }
  // Buscar por id o por token
  const pack = await prisma.pack.findFirst({
    where: {
      OR: [
        { id },
        { token: id },
      ],
    },
    include: { photos: true },
  });
  if (!pack) return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
  return NextResponse.json(pack);
}
