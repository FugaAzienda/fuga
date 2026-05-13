"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"

export default function Saluto() {
    const [nome, setNome] = useState(null)
    const supabase = createClient()

    useEffect(() => {
        async function carica() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return
            const { data } = await supabase.from("profiles").select("nome").eq("id", session.user.id).single()
            if (data?.nome) setNome(data.nome)
        }
        carica()
    }, [])

    if (!nome) return null
    return (
        <div className="text-center mt-4">
            <p className="text-2xl font-bold text-white">
                Bentornato, {nome}
            </p>
            <p className="text-sm text-gray-400 mt-1">
                Trova il tuo prossimo rifugio
            </p>
        </div>
    )
}