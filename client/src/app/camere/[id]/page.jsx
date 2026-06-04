import { supabase } from "@/lib/supabase"
export const dynamic = 'force-dynamic'
export default async function CameraPage({ params }) {
  const { data: struttura, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error || !struttura) {
    return <div className="p-8 text-gray-500">Struttura non trovata</div>
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{struttura.nome}</h1>
      <p className="text-gray-400 mb-6">{struttura.zona} · {struttura.citta}</p>
      <p className="text-gray-600 mb-8">{struttura.descrizione}</p>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-gray-900">
          €{struttura.prezzo_base}
          <span className="text-sm font-normal text-gray-400">/notte</span>
        </span>
        <button className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors">
          Prenota
        </button>
      </div>
    </div>
  )
}