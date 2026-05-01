"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import FilterGroup from "./FilterGroup";
import FilterRange from "./FilterRange";
import { X } from "lucide-react";
import ComboBox from "./ComboBox";

export default function FilterSidebar({ carsData, isMobileOpen, onCloseMobile, filteredCarsCount }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Helper para actualizar la URL
  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("all"); // Quitar "all" cuando se aplica otro filtro
    params.delete("page"); // Resetear página al filtrar
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Si la URL se queda sin filtros (ej. se borró el último y se borró "all"),
    // quizás volver al catálogo con "all=true" para no enviarlo a la landing de golpe, 
    // a menos que el usuario realmente quiera ir a la landing.
    // Vamos a dejar que vuelva a la landing si no hay params.
    if (params.toString() === "") {
      params.set("all", "true");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Obtener valores únicos para los selects (memoizados para evitar recálculos)
  const brands = useMemo(
    () => [...new Set(carsData.map(car => car.brand))].filter(Boolean),
    [carsData]
  );
  const countries = useMemo(
    () => [...new Set(carsData.map(car => car.country))].filter(Boolean),
    [carsData]
  );
  const tractions = useMemo(
    () => [...new Set(carsData.map(car => car.traction))].filter(Boolean),
    [carsData]
  );

  const selectedBrand = searchParams.get("brand");
  const availableModels = useMemo(
    () => selectedBrand
      ? [...new Set(carsData.filter(car => car.brand === selectedBrand).map(car => car.model))].filter(Boolean)
      : [...new Set(carsData.map(car => car.model))].filter(Boolean),
    [carsData, selectedBrand]
  );

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header Mobile Solo */}
      <div className="flex justify-between items-center p-4 border-b border-white/10 lg:hidden sticky top-0 bg-black/80 backdrop-blur-xl z-10">
        <h2 className="text-xl font-bold text-white">Filtros</h2>
        <button onClick={onCloseMobile} className="text-gray-400 hover:text-white p-2">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">

        <FilterGroup title="Marca, Modelo y Origen">
          <label className="block text-sm text-gray-400 mb-1 mt-2">Marca</label>
          <ComboBox
            value={searchParams.get("brand") || ""}
            onChange={(val) => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("all");
              params.delete("page");
              if (val) params.set("brand", val);
              else params.delete("brand");
              params.delete("model");
              if (params.toString() === "") params.set("all", "true");
              router.push(`${pathname}?${params.toString()}`, { scroll: false });
            }}
            placeholder="Cualquier marca"
            className="w-full bg-white/5 text-white border border-white/10 rounded p-2 focus:outline-none focus:border-red-600 transition mb-3"
            options={[
              { label: "Cualquier marca", value: "" },
              ...brands.map(b => ({ label: b, value: b }))
            ]}
          />

          <label className="block text-sm text-gray-400 mb-1">Modelo</label>
          <ComboBox
            value={searchParams.get("model") || ""}
            onChange={(val) => updateFilter("model", val)}
            placeholder="Cualquier modelo"
            disabled={!selectedBrand && availableModels.length === 0}
            className="w-full bg-white/5 text-white border border-white/10 rounded p-2 focus:outline-none focus:border-red-600 transition mb-3 disabled:opacity-50"
            options={[
              { label: "Cualquier modelo", value: "" },
              ...availableModels.map(m => ({ label: m, value: m }))
            ]}
          />

          <label className="block text-sm text-gray-400 mb-1">Versión / Extra</label>
          <input
            type="text"
            placeholder="Ej. Competition, V8..."
            value={searchParams.get("search") || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full bg-white/5 text-white border border-white/10 rounded p-2 focus:outline-none focus:border-red-600 transition mb-3"
          />

          <label className="block text-sm text-gray-400 mb-1">País</label>
          <ComboBox
            value={searchParams.get("country") || ""}
            onChange={(val) => updateFilter("country", val)}
            placeholder="Cualquier país"
            className="w-full bg-white/5 text-white border border-white/10 rounded p-2 focus:outline-none focus:border-red-600 transition mb-3"
            options={[
              { label: "Cualquier país", value: "" },
              ...countries.map(c => ({ label: c, value: c }))
            ]}
          />
        </FilterGroup>

        <FilterGroup title="Precio (€)">
          <div className="flex gap-2">
            <ComboBox
              value={searchParams.get("minPrice") || ""}
              onChange={(val) => updateFilter("minPrice", val)}
              placeholder="Desde"
              className="w-full bg-white/5 text-white border border-white/10 rounded p-2 focus:outline-none focus:border-red-600 transition"
              options={[
                { label: "Desde", value: "" },
                { label: "10.000 €", value: "10000" },
                { label: "20.000 €", value: "20000" },
                { label: "30.000 €", value: "30000" },
                { label: "40.000 €", value: "40000" },
                { label: "50.000 €", value: "50000" },
                { label: "60.000 €", value: "60000" },
                { label: "80.000 €", value: "80000" },
                { label: "100.000 €", value: "100000" },
                { label: "150.000 €", value: "150000" },
                { label: "200.000 €", value: "200000" }
              ]}
            />
            <ComboBox
              value={searchParams.get("maxPrice") || ""}
              onChange={(val) => updateFilter("maxPrice", val)}
              placeholder="Hasta"
              className="w-full bg-white/5 text-white border border-white/10 rounded p-2 focus:outline-none focus:border-red-600 transition"
              options={[
                { label: "Hasta", value: "" },
                { label: "20.000 €", value: "20000" },
                { label: "30.000 €", value: "30000" },
                { label: "40.000 €", value: "40000" },
                { label: "50.000 €", value: "50000" },
                { label: "60.000 €", value: "60000" },
                { label: "80.000 €", value: "80000" },
                { label: "100.000 €", value: "100000" },
                { label: "150.000 €", value: "150000" },
                { label: "200.000 €", value: "200000" },
                { label: "300.000 €", value: "300000" }
              ]}
            />
          </div>
        </FilterGroup>

        <FilterGroup title="Año de Matriculación">
          <div className="flex gap-2">
            <ComboBox
              value={searchParams.get("minYear") || ""}
              onChange={(val) => updateFilter("minYear", val)}
              placeholder="Desde"
              className="w-full bg-white/5 text-white border border-white/10 rounded p-2 focus:outline-none focus:border-red-600 transition"
              options={[
                { label: "Desde", value: "" },
                ...[1990, 1995, 2000, 2005, 2010, 2015, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map(y => ({ label: y.toString(), value: y.toString() }))
              ]}
            />
            <ComboBox
              value={searchParams.get("maxYear") || ""}
              onChange={(val) => updateFilter("maxYear", val)}
              placeholder="Hasta"
              className="w-full bg-white/5 text-white border border-white/10 rounded p-2 focus:outline-none focus:border-red-600 transition"
              options={[
                { label: "Hasta", value: "" },
                ...[1990, 1995, 2000, 2005, 2010, 2015, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].reverse().map(y => ({ label: y.toString(), value: y.toString() }))
              ]}
            />
          </div>
        </FilterGroup>

        <FilterGroup title="Kilometraje">
          <div className="flex gap-2">
            <ComboBox
              value={searchParams.get("minKm") || ""}
              onChange={(val) => updateFilter("minKm", val)}
              placeholder="Desde km"
              className="w-full bg-white/5 text-white border border-white/10 rounded p-2 focus:outline-none focus:border-red-600 transition"
              options={[
                { label: "Desde km", value: "" },
                { label: "10.000 km", value: "10000" },
                { label: "30.000 km", value: "30000" },
                { label: "50.000 km", value: "50000" },
                { label: "80.000 km", value: "80000" },
                { label: "100.000 km", value: "100000" },
                { label: "150.000 km", value: "150000" },
                { label: "200.000 km", value: "200000" }
              ]}
            />
            <ComboBox
              value={searchParams.get("maxKm") || ""}
              onChange={(val) => updateFilter("maxKm", val)}
              placeholder="Hasta km"
              className="w-full bg-white/5 text-white border border-white/10 rounded p-2 focus:outline-none focus:border-red-600 transition"
              options={[
                { label: "Hasta km", value: "" },
                { label: "10.000 km", value: "10000" },
                { label: "30.000 km", value: "30000" },
                { label: "50.000 km", value: "50000" },
                { label: "80.000 km", value: "80000" },
                { label: "100.000 km", value: "100000" },
                { label: "150.000 km", value: "150000" },
                { label: "200.000 km", value: "200000" }
              ]}
            />
          </div>
        </FilterGroup>

        <FilterGroup title="Motor y Rendimiento">
          <label className="block text-sm text-gray-400 mb-1 mt-2">Potencia mínima (CV)</label>
          <ComboBox
            value={searchParams.get("minPower") || ""}
            onChange={(val) => updateFilter("minPower", val)}
            placeholder="Mínimo CV"
            className="w-full bg-white/5 text-white border border-white/10 rounded p-2 focus:outline-none focus:border-red-600 transition mb-4"
            options={[
              { label: "Mínimo CV", value: "" },
              { label: "150 CV", value: "150" },
              { label: "200 CV", value: "200" },
              { label: "300 CV", value: "300" },
              { label: "400 CV", value: "400" },
              { label: "500 CV", value: "500" },
              { label: "600 CV", value: "600" },
              { label: "700 CV", value: "700" }
            ]}
          />

          <label className="block text-sm text-gray-400 mb-1">Tracción</label>
          <ComboBox
            value={searchParams.get("traction") || ""}
            onChange={(val) => updateFilter("traction", val)}
            placeholder="Cualquiera"
            className="w-full bg-white/5 text-white border border-white/10 rounded p-2 focus:outline-none focus:border-red-600 transition"
            options={[
              { label: "Cualquiera", value: "" },
              ...tractions.map(t => ({ label: t, value: t }))
            ]}
          />
        </FilterGroup>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 sticky bottom-0 bg-black/80 backdrop-blur-xl z-10">
        <button
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full bg-primary hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-all shadow-glow hover:scale-[1.02] active:scale-[0.98]"
        >
          Mostrar {filteredCarsCount !== undefined ? filteredCarsCount : ""} coches
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-80 shrink-0 border-r border-white/10 bg-black/40 backdrop-blur-xl h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          {/* Drawer Content */}
          <div className="relative w-full max-w-sm bg-black/90 backdrop-blur-2xl border-l border-white/10 h-full ml-auto shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
