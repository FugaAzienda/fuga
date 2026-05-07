"use client"
import { useRouter } from "next/navigation"

export default function DestinazioniPopari({ destinazioni }) {
  const router = useRouter()
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {destinazioni.map(({ citta, count }) => (
        <div
          key={citta}
          onClick={() => router.push(`/cerca?dest=${citta}`)}
          className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl p-5 cursor-pointer transition-colors"
        >
          <p className="font-semibold text-gray-900">{citta}</p>
          <p className="text-sm text-gray-400 mt-1">{count} strutture</p>
        </div>
      ))}
    </div>
  )
}