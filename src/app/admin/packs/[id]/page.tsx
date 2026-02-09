import { notFound } from 'next/navigation';
import UploadPhotosClient from '@/components/UploadPhotosClient';

async function getPack(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/packs/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function PackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pack = await getPack(id);
  if (!pack) return notFound();

  return (
    <main className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Pack: {pack.name}</h2>
      <div className="mb-4">Estado: <span className="font-mono text-emerald-400">{pack.status}</span></div>
      <div className="mb-4">Cliente: {pack.clientEmail}</div>
      <div className="mb-4">Fotógrafo: {pack.photogEmail}</div>
      <div className="mb-4">Directorio: {pack.directoryId}</div>
      <div className="mb-4">Máx. Fotos Seleccionables: {pack.maxPhotos}</div>
      <div className="mb-4">Idioma: {pack.language}</div>
      <div className="mb-4">Token: <span className="font-mono text-xs">{pack.token}</span></div>
      <UploadPhotosClient packId={pack.id} />
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Fotos</h3>
        {pack.photos.length === 0 ? (
          <div className="text-neutral-500">No hay fotos en este pack.</div>
        ) : (
          <ul className="grid grid-cols-2 gap-2">
            {pack.photos.map((photo: any) => (
              <li key={photo.id} className="bg-neutral-800 rounded p-2 text-xs flex flex-col items-center">
                <img
                  src={`/fotos/${photo.filename}`}
                  alt={photo.filename}
                  className="w-full h-32 object-cover rounded mb-1"
                />
                <span>{photo.filename} {photo.selected && <span className="text-emerald-400">(seleccionada)</span>}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
