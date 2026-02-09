import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  // Devuelve la configuración global (primer registro)
  const config = await prisma.adminConfig.findFirst();
  return NextResponse.json(config);
}

export async function POST(req: Request) {
  const data = await req.json();
  // Solo permite un registro (id=1)
  const config = await prisma.adminConfig.upsert({
    where: { id: 1 },
    update: {
      email: data.email,
      password: data.password,
    },
    create: {
      id: 1,
      email: data.email,
      password: data.password,
    },
  });
  return NextResponse.json(config);
}
