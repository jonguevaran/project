
import { notFound } from 'next/navigation';
import SelectPhotos from '@/components/SelectPhotos';

import { prisma } from '@/lib/prisma';

async function getPackByToken(token: string) {
  const pack = await prisma.pack.findFirst({
    where: { OR: [{ id: token }, { token }] }, // Handle both ID and specific token field if exists, assuming ID for now based on error
    include: { photos: true },
  });
  return pack;
}

export default async function ClientePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const pack = await getPackByToken(token);
  if (!pack) notFound();

  return (
    <main className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Pack: {pack.name}</h2>
      <div className="mb-4">Estado: <span className="font-mono text-emerald-400">{pack.status}</span></div>
      <div className="mb-4">Máx. Fotos Seleccionables: {pack.maxPhotos}</div>
      <SelectPhotos pack={pack} />
    </main>
  );
}
