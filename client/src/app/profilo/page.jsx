"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"

export default function ProfiloPage() {
  const [pronto, setPronto] = useState(false)
  const [utente, setUtente] = useState(null)
  const [nome, setNome] = useState("")
  const [cognome, setCognome] = useState("")
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [caricamento, setCaricamento] = useState(false)
  const [salvato, setSalvato] = useState(false)
  const [modificando, setModificando] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push("/auth/login"); return }
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()
      if (data) {
        setNome(data.nome || "")
        setCognome(data.cognome || "")
        setAvatarUrl(data.avatar_url || null)
      }
      setUtente(session.user)
      setPronto(true)
    }
    init()
  }, [])

  async function handleSalva() {
    if (!utente) return
    setCaricamento(true)
    setSalvato(false)
    await supabase.from("profiles").upsert({ id: utente.id, nome, cognome })
    setCaricamento(false)
    setSalvato(true)
    setModificando(false)
  }

  async function handleAvatar(e) {
    if (!utente) return
    const file = e.target.files[0]
    if (!file) return

    const urlLocale = URL.createObjectURL(file)
    setAvatarUrl(urlLocale)

    const estensione = file.name.split(".").pop()
    const path = `${utente.id}/avatar_${Date.now()}.${estensione}`
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path)
      const urlFinale = data.publicUrl + "?t=" + Date.now()
      setAvatarUrl(urlFinale)
      window.dispatchEvent(new CustomEvent("avatarAggiornato", { detail: { url: data.publicUrl } }))
      await supabase.from("profiles").upsert({ id: utente.id, avatar_url: data.publicUrl })
    }
  }
  if (!pronto) return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-400 text-sm">Caricamento...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-4 py-12">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Il tuo profilo</h1>
          <button
            onClick={() => { setModificando(prev => !prev); setSalvato(false) }}
            className="text-sm text-gray-400 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-xl transition-colors"
          >
            {modificando ? "Annulla" : "Modifica"}
          </button>
        </div>
        {/* Avatar */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center mb-4">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl text-gray-400">
                {nome ? nome[0].toUpperCase() : utente.email[0].toUpperCase()}
              </span>
            )}
          </div>
          {modificando && (
            <label className="cursor-pointer text-xs text-gray-400 hover:text-gray-600 underline">
              Cambia foto
              <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
            </label>
          )}
          <h2 className="text-2xl font-bold text-gray-900 mt-3">
            {nome && cognome ? `${nome} ${cognome}` : nome || "Utente"}
          </h2>
          <p className="text-sm text-gray-400 mt-1">{utente.email}</p>
        </div>

        {/* Campi */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Email</label>
            <p className="text-sm text-gray-900 py-3">{utente.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Nome</label>
            {modificando ? (
              <input type="text" placeholder="Il tuo nome" value={nome} onChange={e => setNome(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400" />
            ) : (
              <p className="text-sm text-gray-900 py-3">{nome || "Non inserito"}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Cognome</label>
            {modificando ? (
              <input type="text" placeholder="Il tuo cognome" value={cognome} onChange={e => setCognome(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400" />
            ) : (
              <p className="text-sm text-gray-900 py-3">{cognome || "Non inserito"}</p>
            )}
          </div>

          {salvato && <p className="text-green-500 text-sm">Profilo salvato</p>}

          {modificando && (
            <button onClick={handleSalva} disabled={caricamento}
              className="bg-gray-900 text-white rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
              {caricamento ? "Salvataggio..." : "Salva modifiche"}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}