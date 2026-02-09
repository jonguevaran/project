"use client";
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

export default function NewPackPage() {
  const [form, setForm] = useState({
    name: '',
    clientEmail: '',
    photogEmail: '',
    directoryId: 1,
    maxPhotos: 20,
    language: 'es',
    token: uuidv4(),
    watermarkText: '',
    watermarkOpacity: 0.5,
  });

  // Cargar valores predeterminados del último pack
  useEffect(() => {
    fetch('/api/packs')
      .then(res => res.json())
      .then(packs => {
        setDirectoryIdsOcupados(packs.map((pack: any) => pack.directoryId));
        if (packs.length > 0) {
          const lastPack = packs[0];
          setForm(f => ({
            ...f,
            clientEmail: lastPack.clientEmail || '',
            photogEmail: lastPack.photogEmail || '',
            watermarkText: lastPack.watermarkText || '',
            watermarkOpacity: lastPack.watermarkOpacity ?? 0.5,
          }));
        }
      });
  }, []);
    const handleCopyToken = () => {
      navigator.clipboard.writeText(form.token);
    };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [directoryIdsOcupados, setDirectoryIdsOcupados] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Obtener directorios ocupados al cargar el formulario
    fetch('/api/packs')
      .then(res => res.json())
      .then(packs => {
        setDirectoryIdsOcupados(packs.map((pack: any) => pack.directoryId));
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | number = value;
    if (name === 'directoryId' || name === 'maxPhotos') {
      newValue = Number(value);
    }
    setForm({ ...form, [name]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/packs/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push('/admin/packs');
    } else {
      const data = await res.json();
      setError(data.error || 'Error al crear el pack');
    }
    setLoading(false);
  };

  return (
    <main className="max-w-xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Crear nuevo pack</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-neutral-900/50 p-6 rounded-xl border border-neutral-800">
        <div>
          <label className="block text-xs mb-1">Nombre</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 rounded bg-neutral-800 text-white" required />
        </div>
        <div>
          <label className="block text-xs mb-1">Email Cliente</label>
          <input name="clientEmail" value={form.clientEmail} onChange={handleChange} className="w-full p-2 rounded bg-neutral-800 text-white" required type="email" />
        </div>
        <div>
          <label className="block text-xs mb-1">Email Fotógrafo</label>
          <input name="photogEmail" value={form.photogEmail} onChange={handleChange} className="w-full p-2 rounded bg-neutral-800 text-white" required type="email" />
        </div>
        <div>
          <label className="block text-xs mb-1">Directorio</label>
          <select
            name="directoryId"
            value={form.directoryId}
            onChange={handleChange}
            className="w-full p-2 rounded bg-neutral-800 text-white"
            required
          >
            {[...Array(30)].map((_, i) => {
              const dirId = i + 1;
              return (
                <option
                  key={dirId}
                  value={dirId}
                  disabled={directoryIdsOcupados.includes(dirId)}
                >
                  {`Directorio ${dirId}`}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Máx. Fotos Seleccionables</label>
          <input name="maxPhotos" value={form.maxPhotos} onChange={handleChange} className="w-full p-2 rounded bg-neutral-800 text-white" required type="number" min={1} />
        </div>
        <div>
          <label className="block text-xs mb-1">Idioma</label>
          <select name="language" value={form.language} onChange={handleChange} className="w-full p-2 rounded bg-neutral-800 text-white">
            <option value="es">Español</option>
            <option value="pt">Português</option>
            <option value="en">English</option>
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Token único</label>
          <div className="flex gap-2">
            <input name="token" value={form.token} readOnly className="w-full p-2 rounded bg-neutral-800 text-white" required />
            <button type="button" onClick={handleCopyToken} className="px-3 py-2 bg-neutral-700 rounded text-xs hover:bg-neutral-600">Copiar</button>
          </div>
        </div>
        <div>
          <label className="block text-xs mb-1">Texto marca de agua</label>
          <input name="watermarkText" value={form.watermarkText} onChange={handleChange} className="w-full p-2 rounded bg-neutral-800 text-white" />
        </div>
        <div>
          <label className="block text-xs mb-1">Opacidad marca de agua (0-1)</label>
          <input name="watermarkOpacity" value={form.watermarkOpacity} onChange={handleChange} className="w-full p-2 rounded bg-neutral-800 text-white" type="number" min={0} max={1} step={0.01} />
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button type="submit" className="w-full py-2 bg-emerald-600 rounded-lg font-semibold hover:bg-emerald-700 transition" disabled={loading}>
          {loading ? 'Creando...' : 'Crear pack'}
        </button>
      </form>
    </main>
  );
}
