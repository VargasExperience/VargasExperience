"use client"
import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react"

export default function CarGallery({ images, gridMode = false }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const [isZoomed, setIsZoomed] = useState(false)

  const active = images[activeIndex]

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeFullscreen()
      if (e.key === "ArrowRight") nextImage()
      if (e.key === "ArrowLeft") prevImage()
    }
    if (isFullscreen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "auto"
    }
  }, [isFullscreen, activeIndex])

  const closeFullscreen = () => {
    setIsFullscreen(false)
    setIsZoomed(false)
  }

  const nextImage = (e) => {
    if (e) e.stopPropagation()
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    setIsZoomed(false)
  }

  const prevImage = (e) => {
    if (e) e.stopPropagation()
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    setIsZoomed(false)
  }

  const toggleZoom = (e) => {
    e.stopPropagation()
    setIsZoomed(!isZoomed)
  }

  return (
    <div className={gridMode ? "" : "mt-6"}>
      {gridMode ? (
        <div className="grid grid-cols-2 gap-4">
          {images.map((img, index) => (
            <div 
              key={index}
              className={`relative rounded-xl border border-white/10 overflow-hidden cursor-pointer group ${index === 0 && images.length % 2 !== 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/3] sm:aspect-[16/9]"}`}
              onClick={() => {
                setActiveIndex(index)
                setIsFullscreen(true)
              }}
            >
              <img
                src={img}
                alt={`Imagen coche ${index + 1}`}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/30">
                <div className="bg-black/60 p-3 rounded-full text-white backdrop-blur-sm">
                  <Expand size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Imagen principal */}
          <div 
            className="relative rounded-xl overflow-hidden border border-white/10 cursor-pointer group"
            onClick={() => setIsFullscreen(true)}
          >
            <img
              src={active}
              alt="Imagen principal del coche"
              className="w-full h-[400px] object-cover transition duration-300 group-hover:opacity-90"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/20">
              <div className="bg-black/60 p-3 rounded-full text-white backdrop-blur-sm">
                <Expand size={24} />
              </div>
            </div>
          </div>

          {/* Miniaturas */}
          <div className="flex gap-4 mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setActiveIndex(index)}
                className={`w-24 h-24 object-cover rounded cursor-pointer transition shrink-0
                  ${activeIndex === index ? "ring-2 ring-red-600 opacity-100" : "opacity-50 hover:opacity-100"}
                `}
              />
            ))}
          </div>
        </>
      )}

      {/* Fullscreen Lightbox */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white p-2 bg-black/50 rounded-full transition"
            onClick={() => setIsFullscreen(false)}
          >
            <X size={32} />
          </button>

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button 
                className="absolute left-4 md:left-8 text-white/70 hover:text-white p-3 bg-black/50 rounded-full transition hover:scale-110"
                onClick={prevImage}
              >
                <ChevronLeft size={36} />
              </button>
              <button 
                className="absolute right-4 md:right-8 text-white/70 hover:text-white p-3 bg-black/50 rounded-full transition hover:scale-110"
                onClick={nextImage}
              >
                <ChevronRight size={36} />
              </button>
            </>
          )}

          {/* Expanded Image Container */}
          <div 
            className={`w-full h-full flex items-center justify-center ${isZoomed ? "overflow-auto" : "overflow-hidden"}`}
            onClick={() => closeFullscreen()}
          >
            <img
              src={active}
              alt="Coche ampliado"
              className={`transition-transform duration-300 ${
                isZoomed 
                  ? "scale-[2] cursor-zoom-out" 
                  : "max-w-[90vw] max-h-[90vh] object-contain cursor-zoom-in"
              }`}
              onClick={toggleZoom}
              draggable={false}
            />
          </div>
          
          {/* Image Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm font-semibold tracking-widest">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  )
}
