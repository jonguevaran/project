"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientAccessPage() {
  const [token, setToken] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      router.push(`/cliente/${token.trim()}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white p-4">
      <div className="w-full max-w-md p-8 bg-neutral-900 rounded-xl shadow-lg border border-neutral-800">
        <h1 className="text-2xl font-bold mb-6 text-center text-emerald-400">
          Acceso Cliente
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="token"
              className="block text-sm font-medium text-neutral-400 mb-2"
            >
              Ingresa tu código de acceso
            </label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Ej: ABC-123"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white placeholder-neutral-600 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Ver Fotos
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          ¿No tienes un código? Contacta a tu fotógrafo.
        </p>
      </div>
    </main>
  );
}
