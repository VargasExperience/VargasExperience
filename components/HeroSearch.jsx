"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cars } from "@/data/cars";
import RequestCarModal from "./RequestCarModal";
import ComboBox from "./ComboBox";

export default function HeroSearch() {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxKm, setMaxKm] = useState("");
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const brands = [...new Set(cars.map(car => car.brand))].filter(Boolean);

  // Modelos dependientes de la marca seleccionada (o todos si no hay marca)
  const availableModels = brand
    ? [...new Set(cars.filter(car => car.brand === brand).map(car => car.model))].filter(Boolean)
    : [...new Set(cars.map(car => car.model))].filter(Boolean);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (brand) params.set("brand", brand);
    if (model) params.set("model", model);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minYear) params.set("minYear", minYear);
    if (maxKm) params.set("maxKm", maxKm);

    // Si no han seleccionado nada pero le dan a buscar
    if (!search && !brand && !model && !maxPrice && !minYear && !maxKm) {
      params.set("all", "true");
    }

    router.push(`/?${params.toString()}`);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4 relative"
      style={{ backgroundImage: "url('/images/hero.jpg')" }}
    >
      {/* Overlay oscuro y capa de relámpagos */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
      <div className="absolute inset-0 mix-blend-overlay animate-lightning pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-4xl text-center">
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
          VARGAS <span className="text-red-600"> EXPERIENCE</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-12 font-medium drop-shadow">
          ENCUENTRA EL COCHE DE TUS SUEÑOS
        </p>

        {/* Buscador Principal */}
        <form
          onSubmit={handleSearch}
          className="bg-black/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-4xl mx-auto relative overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-left text-sm font-semibold text-gray-400 mb-2">Marca</label>
              <ComboBox
                value={brand}
                onChange={(val) => {
                  setBrand(val);
                  setModel("");
                }}
                placeholder="Todas las marcas"
                className="w-full bg-black/50 backdrop-blur-sm text-white border border-white/10 rounded-xl p-4 focus:outline-none focus:border-primary focus:shadow-glow-subtle transition-all text-lg"
                options={[
                  { label: "Todas las marcas", value: "" },
                  ...brands.map(b => ({ label: b, value: b }))
                ]}
              />
            </div>

            <div>
              <label className="block text-left text-sm font-semibold text-gray-400 mb-2">Modelo</label>
              <ComboBox
                value={model}
                onChange={setModel}
                placeholder="Todos los modelos"
                disabled={!brand && availableModels.length === 0}
                className="w-full bg-black/50 backdrop-blur-sm text-white border border-white/10 rounded-xl p-4 focus:outline-none focus:border-primary focus:shadow-glow-subtle transition-all text-lg"
                options={[
                  { label: "Todos los modelos", value: "" },
                  ...availableModels.map(m => ({ label: m, value: m }))
                ]}
              />
            </div>

            <div>
              <label className="block text-left text-sm font-semibold text-gray-400 mb-2">Versión / Extra</label>
              <input
                type="text"
                placeholder="Ej. GTI, Competition..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/50 backdrop-blur-sm text-white border border-white/10 rounded-xl p-4 focus:outline-none focus:border-primary focus:shadow-glow-subtle transition-all text-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-left text-sm font-semibold text-gray-400 mb-2">Precio Máximo (€)</label>
              <ComboBox
                value={maxPrice}
                onChange={setMaxPrice}
                placeholder="Cualquier precio"
                className="w-full bg-black/50 backdrop-blur-sm text-white border border-white/10 rounded-xl p-4 focus:outline-none focus:border-primary focus:shadow-glow-subtle transition-all text-lg"
                options={[
                  { label: "Cualquier precio", value: "" },
                  { label: "Hasta 10.000 €", value: "10000" },
                  { label: "Hasta 20.000 €", value: "20000" },
                  { label: "Hasta 30.000 €", value: "30000" },
                  { label: "Hasta 40.000 €", value: "40000" },
                  { label: "Hasta 50.000 €", value: "50000" },
                  { label: "Hasta 60.000 €", value: "60000" },
                  { label: "Hasta 80.000 €", value: "80000" },
                  { label: "Hasta 100.000 €", value: "100000" },
                  { label: "Hasta 150.000 €", value: "150000" }
                ]}
              />
            </div>

            <div>
              <label className="block text-left text-sm font-semibold text-gray-400 mb-2">Año Mínimo</label>
              <ComboBox
                value={minYear}
                onChange={setMinYear}
                placeholder="Cualquier año"
                className="w-full bg-black/50 backdrop-blur-sm text-white border border-white/10 rounded-xl p-4 focus:outline-none focus:border-primary focus:shadow-glow-subtle transition-all text-lg"
                options={[
                  { label: "Cualquier año", value: "" },
                  ...[1990, 1995, 2000, 2005, 2010, 2015, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025].map(y => ({ label: `Desde ${y}`, value: y.toString() }))
                ]}
              />
            </div>

            <div>
              <label className="block text-left text-sm font-semibold text-gray-400 mb-2">Km Máximos</label>
              <ComboBox
                value={maxKm}
                onChange={setMaxKm}
                placeholder="Cualquier kilometraje"
                className="w-full bg-black/50 backdrop-blur-sm text-white border border-white/10 rounded-xl p-4 focus:outline-none focus:border-primary focus:shadow-glow-subtle transition-all text-lg"
                options={[
                  { label: "Cualquier kilometraje", value: "" },
                  { label: "Hasta 10.000 km", value: "10000" },
                  { label: "Hasta 30.000 km", value: "30000" },
                  { label: "Hasta 50.000 km", value: "50000" },
                  { label: "Hasta 80.000 km", value: "80000" },
                  { label: "Hasta 100.000 km", value: "100000" },
                  { label: "Hasta 150.000 km", value: "150000" },
                  { label: "Hasta 200.000 km", value: "200000" }
                ]}
              />
            </div>

            <div className="flex items-end mt-4 md:mt-0">
              <button
                type="submit"
                className="w-full h-[62px] bg-primary hover:bg-red-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 hover:shadow-glow text-lg"
              >
                <Search size={24} />
                <span>Buscar</span>
              </button>
            </div>
          </div>
        </form>

        {/* Botón para solicitar coche */}
        <div className="mt-8 flex flex-col items-center">
          <p className="text-gray-300 font-medium mb-3">¿No encuentras el coche que buscas?</p>
          <button 
            onClick={() => setIsRequestModalOpen(true)}
            className="px-8 py-3 bg-primary border border-primary text-white font-bold rounded-xl hover:bg-red-500 transition-all shadow-glow hover:scale-105 active:scale-95"
          >
            Solicitar coche a medida
          </button>
        </div>
      </div>

      <RequestCarModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />
    </div>
  );
}
