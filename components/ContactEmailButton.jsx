"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function ContactEmailButton({ car }) {
  const [isOpen, setIsOpen] = useState(false);
  const [solicitud, setSolicitud] = useState({ 
    dni: '', 
    nombre: '', 
    correo: ''
  });
  const [solicitudStatus, setSolicitudStatus] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSolicitudStatus('enviando');

    try {
      const res = await fetch('/api/solicitud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...solicitud,
          marca: car.brand,
          modelo: car.model,
          infoExtra: `Interesado en ID: ${car.id}. Precio: ${car.price}€`
        })
      });

      if (res.ok) {
        setSolicitudStatus('exito');
        setSolicitud({ dni: '', nombre: '', correo: '' });
        setTimeout(() => {
          setSolicitudStatus('');
          setIsOpen(false);
        }, 3000);
      } else {
        setSolicitudStatus('error');
      }
    } catch (error) {
      setSolicitudStatus('error');
    }
  };

  const modal = isOpen ? createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition bg-white/5 rounded-full p-2"
          >
            <X size={24} />
          </button>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight pr-12">
            Contactar por Email
          </h2>
          <p className="text-gray-400 mb-6 font-medium">
            Déjanos tus datos y te enviaremos más información sobre el <span className="text-white font-bold">{car.brand} {car.model}</span>.
          </p>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 text-left">
            
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Nombre completo</label>
              <input 
                type="text" 
                required 
                value={solicitud.nombre}
                onChange={e => setSolicitud({...solicitud, nombre: e.target.value})}
                className="w-full bg-black text-white border border-white/10 rounded-lg p-4 focus:outline-none focus:border-red-600 transition text-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Correo electrónico</label>
              <input 
                type="email" 
                required 
                value={solicitud.correo}
                onChange={e => setSolicitud({...solicitud, correo: e.target.value})}
                className="w-full bg-black text-white border border-white/10 rounded-lg p-4 focus:outline-none focus:border-red-600 transition text-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">DNI</label>
              <input 
                type="text" 
                required 
                value={solicitud.dni}
                onChange={e => setSolicitud({...solicitud, dni: e.target.value})}
                className="w-full bg-black text-white border border-white/10 rounded-lg p-4 focus:outline-none focus:border-red-600 transition text-lg"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={solicitudStatus === 'enviando'}
              className="w-full mt-4 h-[62px] bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 text-lg"
            >
              {solicitudStatus === 'enviando' ? 'Enviando...' : 'Enviar Consulta'}
            </button>
            
            {solicitudStatus === 'exito' && (
              <div className="mt-4 p-4 bg-green-900/30 border border-green-800 rounded-lg text-green-400 font-medium text-center">
                ¡Correo enviado con éxito! Nos pondremos en contacto pronto.
              </div>
            )}
            {solicitudStatus === 'error' && (
              <div className="mt-4 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400 font-medium text-center">
                Hubo un error al enviar el correo. Inténtalo de nuevo.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex-1 text-center btn-led-email px-6 py-3 rounded font-bold transition"
      >
        Contactar por Email
      </button>
      {modal}
    </>
  );
}
