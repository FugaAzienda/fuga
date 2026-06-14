"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"

const CITTA = ["Milano", "Milazzo", "Vercelli", "Rovigo", "Varese", "Roma", "Genova", "Firenza", "Torino", "Campobasso", "Napoli", "Catanzaro", "Trento", "Venezia", "Bologna", "Perugia", "Palermo", "Trieste", "Ancona", "Aquila"]

export default function SearchBar() {
  const [indiceAttivo, setIndiceAttivo] = useState(-1)
  const router = useRouter();
  const [destinazione, setDestinazione] = useState("")
  const [checkin, setCheckin] = useState("")
  const [checkout, setCheckout] = useState("")
  const [ospiti, setOspiti] = useState(1)
  const [suggerimenti, setSuggerimenti] = useState([]);
  const [erroreRicerca, setErroreRicerca] = useState("")

  function handleCerca() {
    if (!destinazione) {
      setErroreRicerca("Inserisci una destinazione")
      setTimeout(() => setErroreRicerca(""), 3000)
      return
    }
    if (!checkin) {
      setErroreRicerca("Inserisci la data di check-in")
      setTimeout(() => setErroreRicerca(""), 3000)
      return
    }
    if (!checkout) {
      setErroreRicerca("Inserisci la data di check-out")
      setTimeout(() => setErroreRicerca(""), 3000)
      return
    }
    setErroreRicerca("")
    router.push(`/cerca?dest=${destinazione}&checkin=${checkin}&checkout=${checkout}&ospiti=${ospiti}`)
  }
  function handleDestinazione(value) {
    setDestinazione(value)
    if (value.length < 2) setSuggerimenti([])
    else {
      const filtrati = CITTA.filter(c => c.toLowerCase().includes(value.toLowerCase()))
      setSuggerimenti(filtrati);
    }
  }
  function handleTasto(e) {
    if (e.key === "ArrowDown") {
      setIndiceAttivo(prev => Math.min(prev + 1, suggerimenti.length - 1))
    }
    if (e.key === "ArrowUp") {
      setIndiceAttivo(prev => Math.max(prev - 1, -1))
    }
    if (e.key === "Enter" && indiceAttivo >= 0) {
      setDestinazione(suggerimenti[indiceAttivo])
      setSuggerimenti([])
      setIndiceAttivo(-1)
    }
    if (e.key === "Enter" && indiceAttivo === -1) {
      handleCerca()
    }
  }

  return (
    <div className="relative">
      {erroreRicerca && (
        <div className="absolute -top-12 left-0 right-0 bg-red-500 text-white text-sm px-4 py-2 rounded-xl text-center">
          {erroreRicerca}
        </div>
      )}
      <div className="max-w-4xl mx-auto flex flex-wrap gap-3 bg-white border border-gray-200 rounded-2xl p-4 shadow-md">
        <div className="relative flex-1 min-w-48 ">
          <input
            type="text"
            placeholder="Dove vuoi andare?"
            value={destinazione}
            onKeyDown={handleTasto}
            onChange={(e) => handleDestinazione(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400"
          />
          {suggerimenti.length > 0 && (
            <ul className="absolute top-full left-0 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg mt-1 w-full z-10">
              {suggerimenti.map((citta, index) => (
                <li
                  key={citta}
                  onClick={() => { setDestinazione(citta); setSuggerimenti([]) }}
                  className={`px-4 py-2 cursor-pointer text-sm ${indiceAttivo === index ? "bg-gray-100" : "hover:bg-gray-50"}`}
                >
                  {citta}
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          type="date"
          value={checkin}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => {
            setCheckin(e.target.value)
            if (checkout && e.target.value >= checkout) setCheckout("")
          }}
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400"
        />
        <input
          type="date"
          value={checkout}
          min={checkin || new Date().toISOString().split("T")[0]}
          disabled={!checkin}
          onChange={(e) => setCheckout(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400"
        />
        <select
          value={ospiti}
          onChange={(e) => setOspiti(Number(e.target.value))}
          className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400"
        >
          {[1, 2, 3, 4, 5, 6].map(n => (
            <option key={n} value={n}>{n} {n === 1 ? "ospite" : "ospiti"}</option>
          ))}
        </select>
        <button
          onClick={handleCerca}
          className="bg-gray-900 text-white rounded-xl px-8 py-3 text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Cerca
        </button>
      </div>
    </div>
  )
}