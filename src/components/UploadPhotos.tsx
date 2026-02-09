"use client";
import { useState } from 'react';

export default function UploadPhotos({ packId }: { packId: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('packId', packId);
      await fetch('/api/photos/create', {
        method: 'POST',
        body: formData,
      });
    }
    setLoading(false);
    setSuccess(true);
    setFiles([]);
  };

  return (
    <div className="my-6 p-4 bg-neutral-900 rounded-xl border border-neutral-800">
      <h4 className="font-semibold mb-2">Subir fotos al pack</h4>
      <input type="file" multiple onChange={handleFileChange} className="mb-2" />
      <div className="mt-4">
        <button onClick={handleUpload} disabled={loading || files.length === 0} className="px-4 py-2 bg-emerald-600 rounded-lg font-semibold hover:bg-emerald-700 transition w-full">
          {loading ? 'Subiendo...' : 'Subir fotos'}
        </button>
      </div>
      {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
      {success && <div className="text-emerald-400 text-sm mt-2">¡Fotos subidas!</div>}
    </div>
  );
}
