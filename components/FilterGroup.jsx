"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FilterGroup({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/10 py-4">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left font-semibold text-gray-200 hover:text-white transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      
      {isOpen && (
        <div className="mt-4 flex flex-col gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
