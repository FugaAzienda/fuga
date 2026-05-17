"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [utente, setUtente] = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      setUtente(session.user)
      const { data } = await supabase.from("profiles").select("avatar_url").eq("id", session.user.id).single()
      if (data?.avatar_url) setAvatarUrl(data.avatar_url)
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUtente(session?.user ?? null)
      if (session?.user) {
        const { data } = await supabase.from("profiles").select("avatar_url").eq("id", session.user.id).single()
        if (data?.avatar_url) setAvatarUrl(data.avatar_url)
      } else {
        setAvatarUrl(null)
      }
    })

    function onAvatarAggiornato(e) {
      setAvatarUrl(e.detail.url + "?t=" + Date.now())
    }
    window.addEventListener("avatarAggiornato", onAvatarAggiornato)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener("avatarAggiornato", onAvatarAggiornato)
    }
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-900">Fuga</Link>
        <nav className="flex gap-6 items-center">
          <Link href="/" className={`text-sm ${pathname === "/" ? "text-gray-900 font-semibold" : "text-gray-400 hover:text-gray-900"}`}>Home</Link>
          <Link href="/cerca" className={`text-sm ${pathname === "/cerca" ? "text-gray-900 font-semibold" : "text-gray-400 hover:text-gray-900"}`}>Esplora</Link>
          {utente ? (
            <>
              <Link href="/profilo" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                    </svg>
                  )}
                </div>
              </Link>
              <button onClick={handleLogout} className="text-sm bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors">Esci</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-gray-400 hover:text-gray-900">Accedi</Link>
              <Link href="/auth/registrati" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors">Registrati</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}