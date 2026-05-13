"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function StruttureList({ strutture, checkin, checkout, ospiti }) {
  const [selezionata, setSelezionata] = useState(null)
  const router = useRouter()
  return (
    <>
      {/* LISTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strutture.map(s => (
          <div
            key={s.id}
            onClick={() => setSelezionata(s)}
            className="border border-gray-200 rounded-2xl p-5 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-semibold text-gray-900">{s.nome}</h2>
              <span className="text-sm font-bold text-gray-900">€{s.prezzo_base}/notte</span>
            </div>
            <p className="text-sm text-gray-400 mb-1">{s.zona} · {s.posti} ospiti</p>
            <p className="text-sm text-gray-500 line-clamp-2">{s.descrizione}</p>
          </div>
        ))}
        {strutture.length === 0 && (
          <p className="text-gray-400 col-span-2">Nessuna struttura trovata per questa destinazione.</p>
        )}
      </div>

      {/* POPUP */}
      {selezionata && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelezionata(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900">{selezionata.nome}</h2>
              <button
                onClick={() => setSelezionata(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-light"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-3">{selezionata.zona} · {selezionata.citta}</p>
            <p className="text-gray-600 mb-6">{selezionata.descrizione}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-900">€{selezionata.prezzo_base}<span className="text-sm font-normal text-gray-400">/notte</span></span>
              <button
                onClick={() => router.push(`/prenota/${selezionata.id}?checkin=${checkin}&checkout=${checkout}&ospiti=${ospiti}`)}
                className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Prenota
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}