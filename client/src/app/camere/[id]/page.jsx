import { STRUTTURE } from "@/lib/data"
export default function camere({params}){
    const struttura = STRUTTURE.find(s => s.id === Number(params.id))
    if (!struttura) {
    return <div>Struttura non trovata</div>
  }
    return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{struttura.nome}</h1>
      <p className="text-gray-400 mb-6">{struttura.zona} · {struttura.citta}</p>
      <p className="text-gray-600 mb-8">{struttura.descrizione}</p>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-gray-900">€{struttura.prezzo}<span className="text-sm font-normal text-gray-400">/notte</span></span>
        <button className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors">
          Prenota
        </button>
      </div>
    </div>
  )
}