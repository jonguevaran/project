import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  if (!data.packId || !data.status) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
  }
  const pack = await prisma.pack.update({
    where: { id: data.packId },
    data: { status: data.status },
  });
  return NextResponse.json(pack);
}
