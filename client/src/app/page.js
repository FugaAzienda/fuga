"use client"
import { useRouter } from "next/navigation"
import SearchBar from "@/components/SearchBar"
import { STRUTTURE } from "@/lib/data"

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
          {["Milano", "Roma", "Firenze", "Venezia", "Napoli", "Bologna", "Torino", "Palermo"].map(citta => {
            const count = STRUTTURE.filter(s => s.citta === citta).length
            return (
              <div
                key={citta}
                onClick={() => router.push(`/cerca?dest=${citta}`)}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl p-5 cursor-pointer transition-colors"
              >
                <p className="font-semibold text-gray-900">{citta}</p>
                <p className="text-sm text-gray-400 mt-1">{count} strutture</p>
              </div>
            )
          })}
        </div>
      </section>

    </main>
  )
}