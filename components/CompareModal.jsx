"use client";

import { X } from "lucide-react";

export default function CompareModal({ cars, onClose }) {
  if (!cars || cars.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-[1600px] max-h-[90vh] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-black/50">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Comparador de Vehículos</h2>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-red-600 rounded-full transition-colors text-white shadow-lg">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 scrollbar-thin scrollbar-thumb-gray-700">
          <div className="min-w-[800px]">
            {/* Grid header */}
            <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: `200px repeat(${cars.length}, minmax(250px, 1fr))` }}>
              <div className="font-bold text-gray-500 uppercase tracking-widest text-xs flex items-end pb-4 border-b border-white/10">
                Características
              </div>
              {cars.map(car => (
                <div key={car.id} className="flex flex-col items-center text-center border-b border-white/10 pb-4 relative group">
                  <div className="relative w-full max-w-[280px] aspect-[4/3] mb-4 rounded-xl overflow-hidden shadow-lg border border-white/10">
                    <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <h3 className="font-bold text-xl text-white">{car.brand}</h3>
                  <p className="text-red-500 font-semibold">{car.model}</p>
                </div>
              ))}
            </div>

            {/* Grid rows */}
            {[
              { label: "Precio", getValue: c => `${c.price.toLocaleString()} €`, highlight: true },
              { label: "Año / Mes", getValue: c => c.year },
              { label: "Kilometraje", getValue: c => `${c.km.toLocaleString()} km` },
              { label: "Potencia", getValue: c => `${c.power} CV` },
              { label: "Motor", getValue: c => c.engine },
              { label: "Tracción", getValue: c => c.traction },
              { label: "País de Origen", getValue: c => c.country },
              { label: "Extras Destacados", getValue: c => c.extras && c.extras.length > 0 ? (
                <div className="flex flex-col gap-1 items-center">
                  {c.extras.map((ex, i) => (
                    <span key={i} className="text-xs bg-white/5 px-2 py-1 rounded text-gray-300 border border-white/10">{ex}</span>
                  ))}
                </div>
              ) : "-" },
            ].map((row, idx) => (
              <div key={idx} className="grid gap-6 py-5 border-b border-white/10/50 hover:bg-white/5/40 transition-colors" style={{ gridTemplateColumns: `200px repeat(${cars.length}, minmax(250px, 1fr))` }}>
                <div className="font-semibold text-gray-400 flex items-center">{row.label}</div>
                {cars.map(car => (
                  <div key={car.id} className={`flex items-center justify-center text-center p-2 rounded ${row.highlight ? 'text-3xl font-black text-white tracking-tighter' : 'text-gray-200 text-lg'}`}>
                    {row.getValue(car)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
