"use client"

import { useState, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { cars } from "@/data/cars"
import HeroSearch from "@/components/HeroSearch"
import Header from "@/components/Header"
import CarCard from "@/components/CarCard"
import FilterSidebar from "@/components/FilterSidebar"
import ActiveFiltersBar from "@/components/ActiveFiltersBar"
import CompareModal from "@/components/CompareModal"
import RequestCarModal from "@/components/RequestCarModal"
import { SlidersHorizontal } from "lucide-react"

export default function HomeClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [compareList, setCompareList] = useState([])
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)

  const toggleCompare = (car) => {
    setCompareList(prev => {
      if (prev.some(c => c.id === car.id)) {
        return prev.filter(c => c.id !== car.id)
      }
      if (prev.length >= 4) {
        alert("Puedes comparar hasta un máximo de 4 vehículos a la vez.")
        return prev
      }
      return [...prev, car]
    })
  }

  const removeCompare = (carId) => {
    setCompareList(prev => prev.filter(c => c.id !== carId))
  }

  // Determinar si estamos en modo "Landing" o "Catálogo"
  const hasActiveSearch = searchParams.toString().length > 0

  // Extraer valores de URL
  const search = searchParams.get("search")?.toLowerCase() || ""
  const brand = searchParams.get("brand") || ""
  const model = searchParams.get("model") || ""
  const country = searchParams.get("country") || ""
  const minPrice = Number(searchParams.get("minPrice")) || 0
  const maxPrice = Number(searchParams.get("maxPrice")) || Infinity
  const minYear = Number(searchParams.get("minYear")) || 0
  const maxYear = Number(searchParams.get("maxYear")) || Infinity
  const minKm = Number(searchParams.get("minKm")) || 0
  const maxKm = Number(searchParams.get("maxKm")) || Infinity
  const minPower = Number(searchParams.get("minPower")) || 0
  const traction = searchParams.get("traction") || ""
  const sort = searchParams.get("sort") || "default"

  // Paginación
  const ITEMS_PER_PAGE = 20
  const pageParam = searchParams.get("page") || "1"
  let currentPage = parseInt(pageParam)
  if (isNaN(currentPage) || currentPage < 1) currentPage = 1

  // Helpers para parsear fechas
  const parseUploadDate = (dateStr) => {
    if (!dateStr) return 0;
    const [d, m, y] = dateStr.split('/');
    return new Date(`${y}-${m}-${d}T12:00:00Z`).getTime();
  };

  const parseYearMonth = (ymStr) => {
    if (!ymStr) return 0;
    const parts = String(ymStr).split('/');
    if (parts.length === 2) {
      return Number(parts[1]) * 100 + Number(parts[0]);
    }
    return Number(parts[0]) * 100;
  };

  // Memoize el filtrado para evitar re-cálculos innecesarios
  const filteredCars = useMemo(() => {
    const result = cars.filter(car => {
      // Búsqueda de texto (ampliada a nombre, marca, modelo, descripción y extras)
      const matchesSearch = !search ||
        car.name?.toLowerCase().includes(search) ||
        car.brand?.toLowerCase().includes(search) ||
        car.model?.toLowerCase().includes(search) ||
        car.description?.toLowerCase().includes(search) ||
        car.extras?.some(extra => extra.toLowerCase().includes(search))

      // Coincidencias exactas
      const matchesBrand = !brand || car.brand === brand
      const matchesModel = !model || car.model === model
      const matchesCountry = !country || car.country === country
      const matchesTraction = !traction || car.traction === traction

      // Rangos
      const carYear = Number(String(car.year).split('/')[1] || car.year)
      const matchesPrice = car.price >= minPrice && car.price <= maxPrice
      const matchesYear = carYear >= minYear && carYear <= maxYear
      const matchesKm = car.km >= minKm && car.km <= maxKm
      const matchesPower = car.power >= minPower

      return matchesSearch && matchesBrand && matchesModel && matchesCountry &&
             matchesTraction && matchesPrice && matchesYear &&
             matchesKm && matchesPower
    })

    // Aplicar ordenación
    return result.sort((a, b) => {
      switch (sort) {
        case "price_asc": return a.price - b.price;
        case "price_desc": return b.price - a.price;
        case "year_asc": return parseYearMonth(a.year) - parseYearMonth(b.year);
        case "year_desc": return parseYearMonth(b.year) - parseYearMonth(a.year);
        case "km_asc": return a.km - b.km;
        case "km_desc": return b.km - a.km;
        case "date_asc": return parseUploadDate(a.uploadDate) - parseUploadDate(b.uploadDate);
        case "default":
        case "date_desc":
        default:
          return parseUploadDate(b.uploadDate) - parseUploadDate(a.uploadDate);
      }
    });
  }, [search, brand, model, country, minPrice, maxPrice, minYear, maxYear, minKm, maxKm, minPower, traction, sort])

  // Lógica de corte por página
  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE)
  if (currentPage > totalPages && totalPages > 0) currentPage = totalPages

  const paginatedCars = filteredCars.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )


  // Vista Landing Page (Buscador Principal)
  if (!hasActiveSearch) {
    return (
      <main className="bg-black text-white min-h-screen">
        <HeroSearch />
      </main>
    )
  }

  // Vista Catálogo (Resultados)
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <main className="flex-1 pb-24 lg:pb-0">
      
      <div id="catalogo" className="flex max-w-[1920px] mx-auto">
        {/* Sidebar Desktop & Drawer Mobile */}
        <FilterSidebar 
          carsData={cars} 
          isMobileOpen={isMobileFiltersOpen} 
          onCloseMobile={() => setIsMobileFiltersOpen(false)} 
          filteredCarsCount={filteredCars.length}
        />

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 overflow-hidden">
          <Header 
            compareList={compareList} 
            onRemoveCompare={removeCompare} 
            onOpenCompare={() => setIsCompareModalOpen(true)} 
          />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 w-full mt-32 md:mt-24">
            {/* Izquierda: Coches encontrados */}
            <div className="bg-white/5 border border-white/10 p-2.5 rounded-full px-5">
              <span className="text-white font-black mr-2 whitespace-nowrap">
                {filteredCars.length} <span className="font-normal text-sm text-gray-400">coches encontrados</span>
              </span>
            </div>
            
            {/* Derecha: Ordenar por */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2.5 rounded-full px-5">
              <label className="text-gray-400 text-sm hidden sm:block font-bold">Ordenar por:</label>
              <select 
                value={sort}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams.toString())
                  if (e.target.value !== 'default') {
                    params.set("sort", e.target.value)
                  } else {
                    params.delete("sort")
                  }
                  router.push(`/?${params.toString()}`, { scroll: false })
                }}
                className="bg-transparent text-white focus:outline-none focus:text-primary transition cursor-pointer font-bold appearance-none outline-none"
              >
                <option value="default">Fecha de subida (Nuevos)</option>
                <option value="date_asc">Fecha de subida (Antiguos)</option>
                <option value="price_asc">Precio (Menor a Mayor)</option>
                <option value="price_desc">Precio (Mayor a Menor)</option>
                <option value="year_desc">Año (Más recientes)</option>
                <option value="year_asc">Año (Más antiguos)</option>
                <option value="km_asc">Kilómetros (Menor a Mayor)</option>
                <option value="km_desc">Kilómetros (Mayor a Menor)</option>
              </select>
            </div>
          </div>

          <ActiveFiltersBar />

          {/* Grid de Coches */}
          {filteredCars.length > 0 ? (
            <div className="flex flex-col gap-6">
              {paginatedCars.map(car => (
                <CarCard 
                  key={car.id} 
                  car={car} 
                  isCompared={compareList.some(c => c.id === car.id)}
                  onToggleCompare={() => toggleCompare(car)}
                />
              ))}

              {/* Controles de Paginación */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 mb-4 flex-wrap">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString())
                      params.set("page", currentPage - 1)
                      router.push(`/?${params.toString()}`)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg disabled:opacity-30 hover:bg-red-600 transition-colors"
                  >
                    Anterior
                  </button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages })
                      .map((_, i) => i + 1)
                      .filter(p => p >= currentPage - 2 && p <= currentPage + 2)
                      .map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          const params = new URLSearchParams(searchParams.toString())
                          params.set("page", p)
                          router.push(`/?${params.toString()}`)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors font-bold ${currentPage === p ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString())
                      params.set("page", currentPage + 1)
                      router.push(`/?${params.toString()}`)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    className="px-4 py-2 bg-gray-800 text-white font-semibold rounded-lg disabled:opacity-30 hover:bg-red-600 transition-colors"
                  >
                    Siguiente
                  </button>

                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-gray-400 font-medium">Ir a:</span>
                    <input 
                      type="number"
                      min={1}
                      max={totalPages}
                      placeholder={currentPage}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          let p = parseInt(e.currentTarget.value);
                          if (!isNaN(p)) {
                            if (p < 1) p = 1;
                            if (p > totalPages) p = totalPages;
                            const params = new URLSearchParams(searchParams.toString());
                            params.set("page", p);
                            router.push(`/?${params.toString()}`);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                      className="w-16 h-10 bg-gray-800 border border-gray-700 text-white rounded-lg text-center font-bold focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-900 rounded-xl border border-gray-800">
              <p className="text-xl text-gray-400 mb-6">No se han encontrado vehículos con estos criterios.</p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => router.push('/?all=true', { scroll: false })}
                  className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition"
                >
                  Limpiar filtros
                </button>
                <button 
                  onClick={() => setIsRequestModalOpen(true)}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition font-semibold shadow-lg shadow-red-600/30"
                >
                  Solicitar coche a medida
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold hover:bg-red-700 transition active:scale-95"
        >
          <SlidersHorizontal size={20} />
          Filtrar resultados
        </button>
      </div>

      {isCompareModalOpen && (
        <CompareModal cars={compareList} onClose={() => setIsCompareModalOpen(false)} />
      )}
      <RequestCarModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />
    </main>
    </div>
  )
}
