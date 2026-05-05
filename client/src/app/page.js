"use client"
import { useRouter } from "next/navigation"
import SearchBar from "@/components/SearchBar"

export default function HomePage() {
  const router = useRouter()
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}
      <section className="relative bg-gray-900 text-white py-24 px-4">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            La tua prossima fuga inizia qui
          </h1>
          <p className="text-gray-400 text-lg">
            Trova hotel, ville e rifugi esclusivi in tutta Italia
          </p>
        </div>
        <SearchBar />
      </section>

      {/* DESTINAZIONI POPOLARI */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Destinazioni popolari</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { citta: "Milano", case: "128 strutture" },
            { citta: "Roma", case: "214 strutture" },
            { citta: "Firenze", case: "97 strutture" },
            { citta: "Venezia", case: "74 strutture" },
            { citta: "Napoli", case: "89 strutture" },
            { citta: "Bologna", case: "56 strutture" },
            { citta: "Torino", case: "63 strutture" },
            { citta: "Palermo", case: "41 strutture" },
          ].map(({ citta, case: n }) => (
            <div
              key={citta}
              onClick={() => router.push(`/cerca?dest=${citta}`)}
              className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl p-5 cursor-pointer transition-colors"
            >
              <p className="font-semibold text-gray-900">{citta}</p>
              <p className="text-sm text-gray-400 mt-1">{n}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}