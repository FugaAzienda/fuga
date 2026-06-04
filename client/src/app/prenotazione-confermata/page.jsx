"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import Link from "next/link"
export const dynamic = 'force-dynamic'
export default function ConfermaPage() {
    const [booking, setBooking] = useState(null)
    const searchParams = useSearchParams()
    const supabase = createClient()
    const bookingId = searchParams.get("booking")
    useEffect(() => {
        async function carica() {
            if (!bookingId) return

            const [{ data: { session } }, { data }] = await Promise.all([
                supabase.auth.getSession(),
                supabase.from("bookings").select("*, rooms(nome, citta, zona)").eq("id", bookingId).single()
            ])

            if (data) {
                setBooking(data)
                fetch("http://localhost:3001/api/email/conferma", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: session?.user?.email || "",
                        nome: "",
                        camera: data.rooms?.nome,
                        checkin: data.checkin,
                        checkout: data.checkout,
                        totale: data.prezzo_totale,
                        codice: data.codice_conferma
                    })
                })
            }
        }
        carica()
    }, [])

    if (!booking) return (
        <main className="min-h-screen bg-white flex items-center justify-center">
            <p className="text-gray-400 text-sm">Caricamento In Corso...</p>
        </main>
    )

    return (
        <main className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Prenotazione confermata</h1>
                <p className="text-gray-400 text-sm mb-8">Codice: <span className="font-mono font-semibold text-gray-900">{booking.codice_conferma}</span></p>

                <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8">
                    <h2 className="font-semibold text-gray-900 mb-4">{booking.rooms.nome}</h2>
                    <div className="flex flex-col gap-2 text-sm text-gray-500">
                        <div className="flex justify-between"><span>Check-in</span><span className="text-gray-900">{booking.checkin}</span></div>
                        <div className="flex justify-between"><span>Check-out</span><span className="text-gray-900">{booking.checkout}</span></div>
                        <div className="flex justify-between"><span>Ospiti</span><span className="text-gray-900">{booking.num_ospiti}</span></div>
                        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold text-gray-900">
                            <span>Totale pagato</span><span>€{booking.prezzo_totale}</span>
                        </div>
                    </div>
                </div>

                <Link href="/" className="bg-gray-900 text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-gray-700 transition-colors">
                    Torna alla home
                </Link>
            </div>
        </main>
    )
}