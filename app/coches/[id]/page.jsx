import { cars } from "@/data/cars"
import { notFound } from "next/navigation"
import CarGallery from "@/components/CarGallery"
import WhatsAppButton from "@/components/WhatsAppButton"
import ContactEmailButton from "@/components/ContactEmailButton"
import BackButton from "@/components/BackButton"

export default async function CarDetail({ params }) {
  const { id } = await params
  const car = cars.find(c => c.id === id)

  if (!car) notFound()

  return (
    <div className="bg-black text-white min-h-screen p-6 md:p-12">
      <div className="max-w-[1400px] mx-auto">
        <BackButton />
        <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight pl-16 md:pl-0">
          {car.brand} <span className="text-red-600">{car.model}</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Izquierda: Imágenes en Cuadrícula */}
          <div className="lg:col-span-7 xl:col-span-8">
            <CarGallery images={car.images} gridMode={true} />
          </div>

          {/* Derecha: Características */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-black/40 p-8 rounded-3xl border border-white/10 sticky top-24 backdrop-blur-2xl shadow-xl relative overflow-hidden">
              <h2 className="text-3xl font-black mb-6 text-white">
                Características
              </h2>
              
              {/* Bento grid para características */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="col-span-2 bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 block">Motor</span> 
                  <span className="font-black text-xl text-white">{car.engine}</span>
                </div>
                
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-center items-center text-center">
                  <span className="font-black text-2xl text-white">{car.power} CV</span>
                  <span className="text-gray-400 text-xs font-bold uppercase mt-1">Potencia</span>
                </div>
                
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-center items-center text-center">
                  <span className="font-black text-xl text-white">{car.year}</span>
                  <span className="text-gray-400 text-xs font-bold uppercase mt-1">Año / Mes</span>
                </div>
                
                <div className="col-span-2 flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Tracción</span>
                  <span className="font-bold text-white text-lg">{car.traction}</span>
                </div>
                
                <div className="col-span-2 flex justify-between items-center bg-white/5 border border-white/10 p-5 rounded-2xl">
                  <span className="text-gray-300 text-sm font-bold uppercase tracking-widest">Kilómetros</span>
                  <span className="font-black text-2xl text-white">{car.km.toLocaleString()} <span className="text-sm font-bold text-gray-400">km</span></span>
                </div>
              </div>

              <div className="mb-8 bg-white/5 p-5 rounded-2xl border border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">Descripción</h3>
                <p className="text-gray-300 leading-relaxed text-sm font-medium">{car.description}</p>
              </div>

              {/* Extras */}
              {car.extras && car.extras.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">Extras Destacados</h3>
                  <div className="flex flex-wrap gap-2">
                    {car.extras.map((extra, idx) => (
                      <span key={idx} className="bg-white/5 text-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold border border-white/10 hover:bg-white/10 transition-colors">
                        {extra}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <p className="text-5xl text-white font-black mb-6 tracking-tighter">
                  {car.price.toLocaleString()} €
                </p>
                <div className="w-full flex flex-col gap-3 mt-6">
                  <WhatsAppButton />
                  <ContactEmailButton car={car} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
