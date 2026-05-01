import { Outfit } from "next/font/google"
import "@/styles/globals.css"

const outfit = Outfit({ subsets: ["latin"] })

export const metadata = {
  title: "VARGAS EXPERIENCE",
  description: "LA MEJOR EXPERIENCIA EN IMPORTACIÓN DE COCHES"
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={outfit.className}>
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}
