import StruttureList from "@/components/StruttureList"
import { STRUTTURE } from "@/lib/data"

export default async function CercaPage({ searchParams }) {
    const params = await searchParams
    const dest = params?.dest || ""
    const risultati = STRUTTURE.filter(s =>
        s.citta.toLowerCase() === dest.toLowerCase()
    )

    return (
        <main className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-2">
                    {dest || "Tutte le strutture"}
                </h1>
                <p className="text-gray-400 mb-8">
                    {risultati.length} strutture trovate
                </p>
                <StruttureList strutture={risultati} />
            </div>
        </main>
    )
}