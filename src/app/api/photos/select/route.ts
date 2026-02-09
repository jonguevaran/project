import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { sendSelectionNotification } from '@/lib/email';

export async function POST(req: Request) {
  const { packId, selectedIds } = await req.json();
  if (!packId || !Array.isArray(selectedIds)) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
  // Desmarcar todas las fotos
  await prisma.photo.updateMany({
    where: { packId },
    data: { selected: false },
  });
  // Marcar seleccionadas
  await prisma.photo.updateMany({
    where: { packId, id: { in: selectedIds } },
    data: { selected: true },
  });
  // Cambiar estado del pack a PROCESADO
  await prisma.pack.update({
    where: { id: packId },
    data: { status: 'PROCESADO' },
  });
  // Enviar notificación por email
  await sendSelectionNotification(packId);
  return NextResponse.json({ success: true });
}
