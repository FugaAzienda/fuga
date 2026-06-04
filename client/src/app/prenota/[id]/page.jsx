"use client"
import { useState, useEffect, use } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-browser"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
export const dynamic = 'force-dynamic'
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

function FormPagamento({ bookingId }) {
  const stripe = useStripe()
  const elements = useElements()
  const [errore, setErrore] = useState("")
  const [caricamento, setCaricamento] = useState(false)

  async function handlePaga(e) {
    e.preventDefault()
    if (!stripe || !elements) return
    setCaricamento(true)
    setErrore("")
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/prenotazione-confermata?booking=${bookingId}`
      }
    })
    if (error) {
      setErrore(error.message)
      setCaricamento(false)
    }
  }

  return (
    <form onSubmit={handlePaga} className="flex flex-col gap-4">
      <PaymentElement />
      {errore && <p className="text-red-500 text-sm">{errore}</p>}
      <button type="submit" disabled={caricamento || !stripe}
        className="bg-gray-900 text-white rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
        {caricamento ? "Pagamento in corso..." : "Paga ora"}
      </button>
    </form>
  )
}

export default function PrenotaPage({ params: paramsPromise }) {
  const params = use(paramsPromise)
  const [pronto, setPronto] = useState(false)
  const [camera, setCamera] = useState(null)
  const [clientSecret, setClientSecret] = useState(null)
  const [bookingId, setBookingId] = useState(null)
  const [errore, setErrore] = useState("")
  const searchParams = useSearchParams()
  const supabase = createClient()
  const router = useRouter()

  const checkin = searchParams.get("checkin")
  const checkout = searchParams.get("checkout")
  const ospiti = searchParams.get("ospiti") || 1

  const notti = checkin && checkout
    ? Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24))
    : 1

  useEffect(() => {
    async function init() {
      const [{ data: { session } }, { data: cam }] = await Promise.all([
        supabase.auth.getSession(),
        supabase.from("rooms").select("*").eq("id", Number(params.id)).single()
      ])
      if (!session) { router.push("/auth/login"); return }
      if (!cam) { setErrore("Camera non trovata"); return }
      setCamera(cam)

      const totale = cam.prezzo_base * notti

      const { data: esistente } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("room_id", Number(params.id))
        .eq("checkin", checkin)
        .eq("checkout", checkout)
        .eq("stato", "in_attesa")
        .maybeSingle()


      let booking = esistente

      if (!booking) {
        const codice = "FUG-" + Date.now().toString(36).toUpperCase()
        const { data: nuova } = await supabase.from("bookings").insert({
          user_id: session.user.id,
          room_id: Number(params.id),
          checkin,
          checkout,
          num_ospiti: Number(ospiti),
          prezzo_totale: totale,
          codice_conferma: codice
        }).select().single()
        booking = nuova
      }

      if (!booking) { setErrore("Errore nella prenotazione"); return }
      setBookingId(booking.id)
      const res = await fetch("http://localhost:3001/api/pagamenti/crea-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ importo: totale, booking_id: booking.id })
      })
      const { clientSecret } = await res.json()
      setClientSecret(clientSecret)
      setPronto(true)
    }
    init()
  }, [])

  if (errore) return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-red-500">{errore}</p>
    </main>
  )

  if (!pronto || !clientSecret) return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-400 text-sm">Preparazione pagamento...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Completa la prenotazione</h1>
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">{camera.nome}</h2>
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <div className="flex justify-between"><span>Check-in</span><span className="text-gray-900">{checkin}</span></div>
            <div className="flex justify-between"><span>Check-out</span><span className="text-gray-900">{checkout}</span></div>
            <div className="flex justify-between"><span>Ospiti</span><span className="text-gray-900">{ospiti}</span></div>
            <div className="flex justify-between"><span>Notti</span><span className="text-gray-900">{notti}</span></div>
            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold text-gray-900">
              <span>Totale</span><span>€{camera.prezzo_base * notti}</span>
            </div>
          </div>
        </div>
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <FormPagamento bookingId={bookingId} />
          </Elements>
        )}
      </div>
    </main >
  )
}