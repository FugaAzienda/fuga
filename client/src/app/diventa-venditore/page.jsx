"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"

export const dynamic = 'force-dynamic'

export default function DiventaVenditore() {
  const [pronto, setPronto] = useState(false)
  const [utente, setUtente] = useState(null)
  const [inviatoGia, setInviatoGia] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const [form, setForm] = useState({
    nome_azienda: "",
    partita_iva: "",
    indirizzo: "",
    telefono: ""
  })
  const [documento, setDocumento] = useState(null)
  const [selfie, setSelfie] = useState(null)
  const [contratto, setContratto] = useState(null)
  const [accettaTermini, setAccettaTermini] = useState(false)
  const [caricamento, setCaricamento] = useState(false)
  const [errore, setErrore] = useState("")
  const [successo, setSuccesso] = useState(false)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push("/auth/login"); return }
      setUtente(session.user)

      const { data } = await supabase
        .from("vendor_applications")
        .select("stato")
        .eq("user_id", session.user.id)
        .maybeSingle()

      if (data) setInviatoGia(true)
      setPronto(true)
    }
    init()
  }, [])

  async function handleInvia() {
    if (!form.nome_azienda || !form.partita_iva || !form.indirizzo || !form.telefono) {
      setErrore("Compila tutti i campi")
      return
    }
    if (!documento || !selfie || !contratto) {
      setErrore("Carica tutti i documenti richiesti")
      return
    }
    if (!accettaTermini) {
      setErrore("Devi accettare i termini e condizioni")
      return
    }

    setCaricamento(true)
    setErrore("")

    async function uploadFile(file, nome) {
      const ext = file.name.split(".").pop()
      const path = `${utente.id}/${nome}.${ext}`
      const { error } = await supabase.storage.from("vendor-docs").upload(path, file, { upsert: true })
      if (error) throw error
      return path
    }

    try {
      const [docPath, selfiePath, contrattoPath] = await Promise.all([
        uploadFile(documento, "documento"),
        uploadFile(selfie, "selfie"),
        uploadFile(contratto, "contratto")
      ])

      await supabase.from("vendor_applications").insert({
        user_id: utente.id,
        ...form,
        documento_url: docPath,
        selfie_url: selfiePath,
        contratto_url: contrattoPath
      })

      setSuccesso(true)
    } catch (err) {
      setErrore("Errore durante l'invio. Riprova.")
    }
    setCaricamento(false)
  }

  if (!pronto) return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-400 text-sm">Caricamento...</p>
    </main>
  )

  if (inviatoGia) return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Richiesta inviata</h1>
        <p className="text-gray-400 text-sm">Hai già inviato una richiesta per diventare venditore. Ti contatteremo via email.</p>
      </div>
    </main>
  )

  if (successo) return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Richiesta inviata</h1>
        <p className="text-gray-400 text-sm">La tua richiesta è in revisione. Ti contatteremo entro 48 ore.</p>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Diventa venditore</h1>
        <p className="text-gray-400 text-sm mb-8">Pubblica le tue strutture su Fuga e raggiungi migliaia di viaggiatori.</p>

        <div className="flex flex-col gap-6">
          {/* Dati azienda */}
          <div className="flex flex-col gap-3">
            <h2 className="font-semibold text-gray-900">Dati azienda</h2>
            <input type="text" placeholder="Nome azienda o attività"
              value={form.nome_azienda} onChange={e => setForm({ ...form, nome_azienda: e.target.value })}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400" />
            <input type="text" placeholder="Partita IVA"
              value={form.partita_iva} onChange={e => setForm({ ...form, partita_iva: e.target.value })}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400" />
            <input type="text" placeholder="Indirizzo sede legale"
              value={form.indirizzo} onChange={e => setForm({ ...form, indirizzo: e.target.value })}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400" />
            <input type="tel" placeholder="Telefono"
              value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400" />
          </div>

          {/* Documenti */}
          <div className="flex flex-col gap-3">
            <h2 className="font-semibold text-gray-900">Documenti</h2>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Documento d'identità (fronte/retro)</label>
              <input type="file" accept="image/*,.pdf" onChange={e => setDocumento(e.target.files[0])}
                className="text-sm text-gray-500" />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Selfie con documento</label>
              <input type="file" accept="image/*" onChange={e => setSelfie(e.target.files[0])}
                className="text-sm text-gray-500" />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">
                Contratto firmato —{" "}
                <a href="/contratto-venditore.pdf" download className="text-gray-900 underline">
                  scarica il contratto
                </a>
              </label>
              <input type="file" accept=".pdf" onChange={e => setContratto(e.target.files[0])}
                className="text-sm text-gray-500" />
            </div>
          </div>

          {/* Termini */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={accettaTermini} onChange={e => setAccettaTermini(e.target.checked)}
              className="mt-1" />
            <span className="text-sm text-gray-500">
              Dichiaro che i dati inseriti sono veritieri e accetto i{" "}
              <a href="/termini-venditore" className="text-gray-900 underline">termini e condizioni</a>{" "}
              per i venditori di Fuga.
            </span>
          </label>

          {errore && <p className="text-red-500 text-sm">{errore}</p>}

          <button onClick={handleInvia} disabled={caricamento}
            className="bg-gray-900 text-white rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
            {caricamento ? "Invio in corso..." : "Invia richiesta"}
          </button>
        </div>
      </div>
    </main>
  )
}