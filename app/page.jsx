import { Suspense } from "react"
import HomeClient from "@/components/HomeClient"

export default function Home() {
  return (
    <Suspense fallback={
      <main className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-lg animate-pulse">Cargando...</div>
      </main>
    }>
      <HomeClient />
    </Suspense>
  )
}
