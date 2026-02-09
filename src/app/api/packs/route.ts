import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  // Devuelve todos los packs
  const packs = await prisma.pack.findMany({
    include: { photos: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(packs);
}
