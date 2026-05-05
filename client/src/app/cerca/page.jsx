import StruttureList from "@/components/StruttureList"

const STRUTTURE = [
    { id: 1, citta: "Milano", nome: "Hotel Brera", zona: "Brera", prezzo: 120, posti: 2, descrizione: "Boutique hotel nel cuore di Brera, a 5 minuti dalla metro." },
    { id: 2, citta: "Milano", nome: "Appartamento Navigli", zona: "Navigli", prezzo: 85, posti: 4, descrizione: "Ampio appartamento con vista sul naviglio, cucina attrezzata." },
    { id: 3, citta: "Milano", nome: "Suite Duomo", zona: "Centro", prezzo: 210, posti: 2, descrizione: "Suite di lusso a 200 metri dal Duomo, servizio concierge." },
    { id: 4, citta: "Milano", nome: "Loft Isola", zona: "Isola", prezzo: 95, posti: 3, descrizione: "Loft moderno nel quartiere Isola, design contemporaneo." },
    { id: 5, citta: "Roma", nome: "Hotel Trastevere", zona: "Trastevere", prezzo: 110, posti: 2, descrizione: "Piccolo hotel nel quartiere più caratteristico di Roma." },
    { id: 6, citta: "Roma", nome: "Appartamento Prati", zona: "Prati", prezzo: 90, posti: 4, descrizione: "Appartamento spazioso vicino a Castel Sant'Angelo." },
    { id: 7, citta: "Roma", nome: "Suite Colosseo", zona: "Celio", prezzo: 180, posti: 2, descrizione: "Vista diretta sul Colosseo, colazione inclusa." },
    { id: 8, citta: "Firenze", nome: "Palazzo Oltrarno", zona: "Oltrarno", prezzo: 140, posti: 2, descrizione: "Palazzo storico restaurato con affreschi originali." },
    { id: 9, citta: "Venezia", nome: "Ca' Cannaregio", zona: "Cannaregio", prezzo: 160, posti: 2, descrizione: "Palazzo veneziano sul canale, barca privata inclusa." },
]

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