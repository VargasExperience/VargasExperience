"use client";

import { X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function ActiveFiltersBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Obtenemos todos los parámetros actuales
  const params = new URLSearchParams(searchParams.toString());
  
  // Extraemos las keys que son de filtros (excluyendo "all" y "sort")
  const activeFilters = [];
  params.forEach((value, key) => {
    if (key !== "all" && key !== "sort" && key !== "page") {
      activeFilters.push({ key, value });
    }
  });

  if (activeFilters.length === 0) return null;

  const removeFilter = (filterKey) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(filterKey);
    params.delete("page");
    
    if (filterKey === "brand") {
      params.delete("model");
    }
    
    if (params.toString() === "") {
      params.set("all", "true");
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    router.push(`${pathname}?all=true`, { scroll: false });
  };

  const formatKeyName = (key) => {
    const names = {
      search: "Versión/Extra",
      brand: "Marca",
      model: "Modelo",
      country: "País",
      minPrice: "Precio Min",
      maxPrice: "Precio Max",
      minYear: "Año Min",
      maxYear: "Año Max",
      minKm: "KM Min",
      maxKm: "KM Max",
      minPower: "Potencia Min",
      traction: "Tracción",
    };
    return names[key] || key;
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm text-gray-400 mr-2">Filtros activos:</span>
      {activeFilters.map(({ key, value }) => (
        <div
          key={key}
          className="flex items-center gap-1 bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-sm font-medium"
        >
          <span>
            {formatKeyName(key)}: {value}
          </span>
          <button
            onClick={() => removeFilter(key)}
            className="hover:text-red-200 transition p-0.5"
            aria-label={`Eliminar filtro ${formatKeyName(key)}`}
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <button
        onClick={clearAll}
        className="text-sm text-gray-400 hover:text-white transition ml-2 underline decoration-gray-600 underline-offset-4"
      >
        Limpiar todos
      </button>
    </div>
  );
}
