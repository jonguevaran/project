import Link from 'next/link';

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 flex items-center space-x-4">
          <h1 className="text-3xl font-light tracking-wider">PHOTOGRAPHER <span className="font-bold text-emerald-500">ADMIN</span></h1>
        </header>
        <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 backdrop-blur-sm mb-8">
          <h2 className="text-xl font-medium mb-4 flex items-center text-neutral-300">Gestión de Packs</h2>
          <p className="text-neutral-400 mb-2">Aquí podrás crear, ver y gestionar los packs y sus estados.</p>
          <Link href="/admin/packs" className="inline-block mt-2 px-4 py-2 bg-emerald-600 rounded-lg font-semibold hover:bg-emerald-700 transition">Ir a gestión de packs</Link>
        </div>
      </div>
    </main>
  );
}
