"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function RequestCarModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [solicitud, setSolicitud] = useState({ 
    dni: '', 
    nombre: '', 
    correo: '', 
    marca: '', 
    modelo: '', 
    infoExtra: '' 
  });
  const [solicitudStatus, setSolicitudStatus] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }

    setSolicitudStatus('enviando');
    try {
      const res = await fetch('/api/solicitud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(solicitud)
      });
      if (res.ok) {
        setSolicitudStatus('exito');
        setSolicitud({ dni: '', nombre: '', correo: '', marca: '', modelo: '', infoExtra: '' });
        setStep(1);
        setTimeout(() => {
          setSolicitudStatus('');
          onClose();
        }, 3000);
      } else {
        setSolicitudStatus('error');
      }
    } catch (error) {
      setSolicitudStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Fondo borroso independiente */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-2xl"
        onClick={onClose}
      />
      
      {/* Contenedor del formulario centrado */}
      <div 
        className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl relative shadow-2xl transition-all z-10 max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra de progreso */}
        <div className="flex w-full h-1 bg-white/5">
          <div className={`h-full bg-red-600 transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
        </div>

        <div className="p-5 md:p-8">
          <button 
            onClick={() => {
              setStep(1);
              onClose();
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition bg-gray-800/50 backdrop-blur-md rounded-full p-2 z-10 border border-white/10 shadow-xl"
          >
            <X size={20} />
          </button>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight pr-10">
            {step === 1 ? "Tus Datos" : "El Coche de tus Sueños"}
          </h2>
          <p className="text-gray-400 mb-8 font-medium">
            {step === 1 
              ? "Para comenzar, necesitamos algunos datos de contacto." 
              : "Cuéntanos exactamente qué vehículo estás buscando."}
          </p>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {step === 1 && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Nombre completo</label>
                  <input 
                    type="text" 
                    required 
                    value={solicitud.nombre}
                    onChange={e => setSolicitud({...solicitud, nombre: e.target.value})}
                    className="w-full bg-black text-white border border-white/10 rounded-lg p-3 md:p-4 focus:outline-none focus:border-red-600 transition text-base md:text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">DNI</label>
                  <input 
                    type="text" 
                    required 
                    value={solicitud.dni}
                    onChange={e => setSolicitud({...solicitud, dni: e.target.value})}
                    className="w-full bg-black text-white border border-white/10 rounded-lg p-3 md:p-4 focus:outline-none focus:border-red-600 transition text-base md:text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Correo electrónico</label>
                  <input 
                    type="email" 
                    required 
                    value={solicitud.correo}
                    onChange={e => setSolicitud({...solicitud, correo: e.target.value})}
                    className="w-full bg-black text-white border border-white/10 rounded-lg p-3 md:p-4 focus:outline-none focus:border-red-600 transition text-base md:text-lg"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Marca</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej. Porsche"
                    value={solicitud.marca}
                    onChange={e => setSolicitud({...solicitud, marca: e.target.value})}
                    className="w-full bg-black text-white border border-white/10 rounded-lg p-3 md:p-4 focus:outline-none focus:border-red-600 transition text-base md:text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Modelo</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej. 911 GT3 RS"
                    value={solicitud.modelo}
                    onChange={e => setSolicitud({...solicitud, modelo: e.target.value})}
                    className="w-full bg-black text-white border border-white/10 rounded-lg p-3 md:p-4 focus:outline-none focus:border-red-600 transition text-base md:text-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Información extra (Opcional)</label>
                  <textarea 
                    rows={4}
                    placeholder="Año específico, color, extras imprescindibles..."
                    value={solicitud.infoExtra}
                    onChange={e => setSolicitud({...solicitud, infoExtra: e.target.value})}
                    className="w-full bg-black text-white border border-white/10 rounded-lg p-3 md:p-4 focus:outline-none focus:border-red-600 transition text-base md:text-lg resize-none"
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2 mt-4 flex gap-4">
              {step === 2 && (
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  disabled={solicitudStatus === 'enviando'}
                  className="w-1/3 h-[62px] bg-white/5 hover:bg-gray-700 text-white font-bold rounded-lg transition-all"
                >
                  Atrás
                </button>
              )}
              
              <button 
                type="submit" 
                disabled={solicitudStatus === 'enviando'}
                className={`${step === 2 ? 'w-2/3' : 'w-full'} h-[62px] bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 text-lg`}
              >
                {step === 1 ? 'Siguiente paso' : (solicitudStatus === 'enviando' ? 'Enviando...' : 'Enviar Solicitud')}
              </button>
            </div>
            
            <div className="md:col-span-2">
              {solicitudStatus === 'exito' && (
                <div className="mt-4 p-4 bg-green-900/30 border border-green-800 rounded-lg text-green-400 font-medium text-center">
                  ¡Solicitud enviada con éxito! Nos pondremos en contacto contigo pronto.
                </div>
              )}
              {solicitudStatus === 'error' && (
                <div className="mt-4 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400 font-medium text-center">
                  Hubo un error al enviar la solicitud. Inténtalo de nuevo.
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
