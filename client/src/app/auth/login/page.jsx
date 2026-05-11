"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errore, setErrore] = useState("")
  const [caricamento, setCaricamento] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin() {
    setCaricamento(true)
    setErrore("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setErrore("Email o password errati")
      setCaricamento(false)
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bentornato</h1>
        <p className="text-gray-400 text-sm mb-8">Accedi al tuo account Fuga</p>

        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400"
          />
          {errore && <p className="text-red-500 text-sm">{errore}</p>}
          <button
            onClick={handleLogin}
            disabled={caricamento}
            className="bg-gray-900 text-white rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {caricamento ? "Accesso..." : "Accedi"}
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Non hai un account?{" "}
          <Link href="/auth/registrati" className="text-gray-900 font-medium">
            Registrati
          </Link>
        </p>
      </div>
    </main>
  )
}