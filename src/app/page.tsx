import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white">
      <h1 className="text-3xl font-bold mb-6">Gestor de Packs Fotográficos</h1>
      <div className="flex gap-4">
        <Link href="/admin" className="px-6 py-3 bg-emerald-600 rounded-lg font-semibold hover:bg-emerald-700 transition">Panel Fotógrafo</Link>
        <Link href="/cliente" className="px-6 py-3 bg-sky-600 rounded-lg font-semibold hover:bg-sky-700 transition">Vista Cliente</Link>
      </div>
    </main>
  );
}