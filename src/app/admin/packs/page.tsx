import Link from 'next/link';

export const dynamic = 'force-dynamic';

function getStatusBadge(status: string) {
  const statusMap: Record<string, { label: string; color: string }> = {
    DIRECTORIO: { label: 'Directorio', color: 'bg-gray-500' },
    ASIGNADO: { label: 'Asignado', color: 'bg-blue-500' },
    EN_PROCESO: { label: 'En proceso', color: 'bg-yellow-500' },
    PROCESADO: { label: 'Procesado', color: 'bg-purple-500' },
    DISPONIBLE: { label: 'Disponible', color: 'bg-emerald-600' },
  };
  const s = statusMap[status] || { label: status, color: 'bg-neutral-700' };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${s.color}`}>{s.label}</span>
  );
}

async function getPacks() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/packs`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function PacksAdminPage() {
  const packs = await getPacks();
  return (
    <main className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Gestión de Packs</h2>
      <div className="mb-4 flex justify-end">
        <Link href="/admin/packs/new" className="px-4 py-2 bg-emerald-600 rounded-lg font-semibold hover:bg-emerald-700 transition">Crear nuevo pack</Link>
      </div>
      <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800">
        <table className="w-full text-left">
          <thead>
            <tr className="text-neutral-400">
              <th className="py-2">Nombre</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {packs.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-neutral-500">No hay packs registrados.</td></tr>
            ) : (
              packs.map((pack: any) => (
                <tr key={pack.id} className="border-b border-neutral-800">
                  <td className="py-2">{pack.name}</td>
                  <td>{pack.clientEmail}</td>
                  <td>{getStatusBadge(pack.status)}</td>
                  <td>
                    <Link href={`/admin/packs/${pack.id}`} className="text-emerald-400 hover:underline">Ver</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
