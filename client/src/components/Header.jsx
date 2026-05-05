"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b border-gray-100 bg-white sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        
        <Link href="/" className="text-xl font-bold text-gray-900">
          Fuga
        </Link>

        <nav className="flex gap-6 items-center">
          <Link
            href="/cerca"
            className={`text-sm ${pathname === "/cerca" ? "text-gray-900 font-semibold" : "text-gray-400 hover:text-gray-900"}`}
          >
            Esplora
          </Link>
          <Link
            href="/auth/login"
            className="text-sm text-gray-400 hover:text-gray-900"
          >
            Accedi
          </Link>
          <Link
            href="/auth/registrati"
            className="text-sm bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors"
          >
            Registrati
          </Link>
        </nav>

      </div>
    </header>
  )
}