"use client";
import { useState } from 'react';

export default function SelectPhotos({ pack }: { pack: any }) {
  const [selected, setSelected] = useState<string[]>(pack.photos.filter((p: any) => p.selected).map((p: any) => p.id));
  const [viewingIndex, setViewingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((sid) => sid !== id));
    } else if (selected.length < pack.maxPhotos) {
      setSelected([...selected, id]);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    const res = await fetch('/api/photos/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packId: pack.id, selectedIds: selected }),
    });
    if (res.ok) {
      setSuccess(true);
    } else {
      const data = await res.json();
      setError(data.error || 'Error al confirmar selección');
    }
    setLoading(false);
  };

  const openLightbox = (index: number) => setViewingIndex(index);
  const closeLightbox = () => setViewingIndex(null);
  
  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewingIndex !== null) {
      setViewingIndex((viewingIndex + 1) % pack.photos.length);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewingIndex !== null) {
      setViewingIndex((viewingIndex - 1 + pack.photos.length) % pack.photos.length);
    }
  };

  return (
    <div className="my-6">
      <h4 className="font-semibold mb-2">Selecciona hasta {pack.maxPhotos} fotos</h4>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
        {pack.photos.map((photo: any, index: number) => (
          <li
            key={photo.id}
            className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all relative group ${selected.includes(photo.id) ? 'border-emerald-500' : 'border-transparent'}`}
            onClick={() => openLightbox(index)}
          >
            <div className="aspect-square bg-neutral-900 relative">
               <img
                src={`/fotos/${photo.filename}`}
                alt={photo.filename}
                className="w-full h-full object-cover"
              />
              {selected.includes(photo.id) && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-2 bg-neutral-800 text-xs text-center truncate">
              {photo.filename}
            </div>
          </li>
        ))}
      </ul>
      
      <button onClick={handleConfirm} disabled={loading || selected.length === 0} className="w-full sm:w-auto px-6 py-3 bg-emerald-600 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? 'Enviando...' : `Confirmar selección (${selected.length}/${pack.maxPhotos})`}
      </button>

      {error && <div className="text-red-400 text-sm mt-3 bg-red-950/30 p-3 rounded border border-red-900">{error}</div>}
      {success && <div className="text-emerald-400 text-sm mt-3 bg-emerald-950/30 p-3 rounded border border-emerald-900">¡Selección confirmada! Gracias.</div>}

      {/* Lightbox */}
      {viewingIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 z-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button 
            onClick={prevPhoto}
            className="absolute left-4 text-neutral-400 hover:text-white p-4 z-50 transition hover:bg-white/10 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button 
            onClick={nextPhoto}
            className="absolute right-4 text-neutral-400 hover:text-white p-4 z-50 transition hover:bg-white/10 rounded-full"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div 
            className="relative max-w-full max-h-full flex flex-col items-center justify-center"
            onClick={() => toggleSelect(pack.photos[viewingIndex].id)}
          >
            <img 
              src={`/fotos/${pack.photos[viewingIndex].filename}`} 
              alt={pack.photos[viewingIndex].filename}
              className={`max-h-[85vh] max-w-full object-contain shadow-2xl transition cursor-pointer ${selected.includes(pack.photos[viewingIndex].id) ? 'ring-4 ring-emerald-500' : ''}`}
            />
            <div className="mt-4 flex items-center gap-3">
               <span className="text-neutral-300 font-medium text-lg">{pack.photos[viewingIndex].filename}</span>
               {selected.includes(pack.photos[viewingIndex].id) ? (
                 <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded font-bold uppercase tracking-wide">Seleccionada</span>
               ) : (
                 <span className="text-neutral-500 text-xs px-2 py-1 border border-neutral-700 rounded font-medium uppercase tracking-wide">Clic para seleccionar</span>
               )}
            </div>
            <div className="absolute top-4 right-4 pointer-events-none">
               {selected.includes(pack.photos[viewingIndex].id) && (
                   <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                   </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
