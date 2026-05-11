"use client"
import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegistratiPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errore, setErrore] = useState("")
    const [successo, setSuccesso] = useState(false)
    const [caricamento, setCaricamento] = useState(false)
    const router = useRouter()
    const supabase = createClient()
    const [mostraPassword, setMostraPassword] = useState(false)

    async function handleRegistrati() {
        setCaricamento(true)
        setErrore("")
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) {
            setErrore(error.message)
            setCaricamento(false)
        } else if (data?.user?.identities?.length === 0) {
            setErrore("Questa email è già registrata")
            setCaricamento(false)
        } else {
            setSuccesso(true)
            setCaricamento(false)
        }
    }

    if (successo) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Controlla la tua email</h1>
                    <p className="text-gray-400 text-sm">Abbiamo inviato un link di conferma a {email}</p>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Crea un account</h1>
                <p className="text-gray-400 text-sm mb-8">Inizia a pianificare la tua fuga</p>

                <div className="flex flex-col gap-3">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400"
                    />
                    <div className="relative">
                        <input
                            type={mostraPassword ? "text" : "password"}
                            placeholder="Password (min. 6 caratteri)"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400"
                        />
                        <button
                            type="button"
                            onClick={() => setMostraPassword(prev => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                        >
                            {mostraPassword ? "Nascondi" : "Mostra"}
                        </button>
                    </div>
                    {errore && <p className="text-red-500 text-sm">{errore}</p>}
                    <button
                        onClick={handleRegistrati}
                        disabled={caricamento}
                        className="bg-gray-900 text-white rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        {caricamento ? "Registrazione..." : "Registrati"}
                    </button>
                </div>

                <p className="text-sm text-gray-400 mt-6 text-center">
                    Hai già un account?{" "}
                    <Link href="/auth/login" className="text-gray-900 font-medium">
                        Accedi
                    </Link>
                </p>
            </div>
        </main>
    )
}