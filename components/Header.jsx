"use client";
import { useRouter } from "next/navigation";
import { X, Scale } from "lucide-react";

export default function Header({ compareList = [], onRemoveCompare, onOpenCompare }) {
  const router = useRouter();

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] sm:w-auto">
      <div 
        onClick={() => router.push('/')}
        className="cursor-pointer group/capsule bg-black/80 backdrop-blur-3xl border border-white/10 py-3 px-6 md:px-10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(255,26,26,0.6)] transition-all duration-500 flex flex-col sm:flex-row items-center justify-center gap-6"
      >
        <div className="text-2xl font-black tracking-tight shrink-0 drop-shadow-md">
          <span className="text-white group-hover/capsule:text-red-600 transition-colors duration-300">VARGAS</span>{" "}
          <span className="text-red-600 group-hover/capsule:text-white transition-colors duration-300">EXPERIENCE</span>
        </div>
        
        {/* Comparador en Header */}
        {compareList.length > 0 && (
          <div className="flex flex-1 items-center justify-end gap-4 md:gap-6 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-400 hidden xl:block">Para comparar:</span>
              <div className="flex gap-2">
                {compareList.map(car => (
                  <div key={car.id} className="flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm p-1.5 pl-3 rounded-full group animate-in zoom-in duration-200 hover:border-white/20 transition-all">
                    <span className="text-xs font-bold text-white max-w-[80px] md:max-w-[120px] truncate">{car.brand} {car.model}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveCompare(car.id);
                      }}
                      className="bg-white/5/80 hover:bg-red-600 rounded-full p-1 transition-colors text-gray-300 hover:text-white"
                      title="Quitar"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onOpenCompare();
              }}
              disabled={compareList.length < 2}
              className={`flex shrink-0 items-center gap-2 px-5 py-2 rounded-full font-bold transition-all
                ${compareList.length >= 2 
                  ? 'bg-red-600 text-white hover:bg-red-500 hover:scale-105 active:scale-95 hover:shadow-glow' 
                  : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/10'}
              `}
            >
              <Scale size={18} />
              Comparar ({compareList.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
