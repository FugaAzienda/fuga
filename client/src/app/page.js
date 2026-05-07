import { supabase } from "@/lib/supabase"
import SearchBar from "@/components/SearchBar"
import DestinazioniPopari from "@/components/DestinazioniPopari"

export default async function HomePage() {
  const { data: strutture } = await supabase.from("rooms").select("citta")

  const citta = ["Milano", "Roma", "Firenze", "Venezia", "Napoli", "Bologna", "Torino", "Palermo"]
  const destinazioni = citta.map(c => ({
    citta: c,
    count: strutture?.filter(s => s.citta === c).length || 0
  }))

  return (
    <main className="min-h-screen bg-white text-gray-900">
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

      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Destinazioni popolari</h2>
        <DestinazioniPopari destinazioni={destinazioni} />
      </section>
    </main>
  )
}