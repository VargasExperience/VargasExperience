"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()}
      className="fixed top-4 left-4 md:top-8 md:left-8 z-50 text-gray-400 hover:text-white bg-black/80 backdrop-blur-xl/60 hover:bg-red-600 transition-all border border-white/10 hover:border-red-500 p-3 rounded-full backdrop-blur-md shadow-2xl group"
      aria-label="Volver atrás"
    >
      <ArrowLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
    </button>
  );
}
