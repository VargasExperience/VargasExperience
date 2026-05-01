import Link from "next/link";
import { Gauge, Calendar, Cog, GripHorizontal } from "lucide-react";

// Función pura: calcular texto relativo de fecha de subida
function getUploadDateText(dateStr) {
  if (!dateStr) return "Subido recientemente";
  const [day, month, year] = dateStr.split('/');
  const date = new Date(`${year}-${month}-${day}T12:00:00Z`);
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86_400_000);

  if (diffDays === 0) return `Subido el ${dateStr} (hace unas horas)`;
  if (diffDays === 1) return `Subido el ${dateStr} (hace 1 día)`;
  if (diffDays < 30) return `Subido el ${dateStr} (hace ${diffDays} días)`;
  if (diffDays < 365) {
    const m = Math.floor(diffDays / 30);
    return `Subido el ${dateStr} (hace ${m === 1 ? '1 mes' : `${m} meses`})`;
  }
  const y = Math.floor(diffDays / 365);
  const m = Math.floor((diffDays % 365) / 30);
  const yearsStr = y === 1 ? '1 año' : `${y} años`;
  const monthsStr = m > 0 ? ` y ${m === 1 ? '1 mes' : `${m} meses`}` : '';
  return `Subido el ${dateStr} (hace ${yearsStr}${monthsStr})`;
}

export default function CarCard({ car, isCompared, onToggleCompare }) {

  return (
    <div className="relative group">
      <Link 
        href={`/coches/${car.id}`}
        className="flex flex-col md:flex-row bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-glow hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
      >
      {/* Imagen */}
      <div className="relative w-full md:w-80 h-56 md:h-auto shrink-0 overflow-hidden">
        <img 
          src={car.images[0]} 
          alt={car.name} 
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-grow p-6 justify-between">
        <div>
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors">
              {car.name}
            </h3>
            <span className="text-2xl font-black text-primary whitespace-nowrap drop-shadow-md">
              {car.price.toLocaleString()} €
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1 font-medium">{car.brand} • {car.country}</p>
        </div>

        {/* Especificaciones (Bento Box) */}
        <div className="grid grid-cols-2 gap-2 mt-6">
          <div className="col-span-2 flex flex-row items-center justify-between bg-black/40 border border-white/5 p-3 rounded-xl">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Motor</span>
            <div className="flex items-center gap-4 text-white font-black text-sm md:text-base">
              <span className="flex items-center gap-1.5"><Cog size={16} className="text-primary" /> {car.power} CV</span>
              <span className="flex items-center gap-1.5"><GripHorizontal size={16} className="text-primary" /> {car.traction}</span>
            </div>
          </div>
          <div className="flex flex-col justify-center bg-black/40 border border-white/5 p-3 rounded-xl">
            <Calendar size={16} className="text-primary mb-1" />
            <span className="text-lg font-black text-white">{car.year}</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase">Año</span>
          </div>
          <div className="flex flex-col justify-center bg-black/40 border border-white/5 p-3 rounded-xl">
            <Gauge size={16} className="text-primary mb-1" />
            <span className="text-lg font-black text-white">{car.km.toLocaleString()}</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase">Kilómetros</span>
          </div>
        </div>

        {/* Footer de la tarjeta */}
        <div className="mt-4 flex flex-col md:flex-row justify-between items-end">
          <p className="hidden md:block text-sm text-gray-500 line-clamp-2 max-w-[65%]">
            {car.description}
          </p>
          <div className="flex flex-col items-end gap-3 mt-4 md:mt-0 text-right w-full md:w-auto">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onToggleCompare) onToggleCompare();
              }}
              className={`flex items-center justify-center px-6 py-2.5 rounded-xl transition-all shadow-lg border text-sm font-bold tracking-widest w-full md:w-auto
                ${isCompared 
                  ? 'bg-red-900 border-red-900 text-gray-300 hover:bg-red-800' 
                  : 'bg-primary border-primary text-white hover:bg-red-500 hover:shadow-glow hover:-translate-y-0.5'}
              `}
              title={isCompared ? "Quitar del comparador" : "Añadir a comparar"}
            >
              {isCompared ? "COMPARANDO" : "COMPARAR"}
            </button>
            <div className="text-xs text-gray-500 font-medium">
              {getUploadDateText(car.uploadDate)}
            </div>
          </div>
        </div>
      </div>
      </Link>
    </div>
  );
}
