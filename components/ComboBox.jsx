"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function ComboBox({ value, onChange, options, placeholder, className, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const normalizedOptions = options.map(opt => 
    typeof opt === 'object' && opt !== null ? opt : { label: String(opt), value: String(opt) }
  );

  const safeValue = value || "";

  const filteredOptions = normalizedOptions.filter(opt => 
    opt.label.toLowerCase().includes(safeValue.toLowerCase()) ||
    opt.value.toLowerCase().includes(safeValue.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative w-full h-full">
        <input
          type="text"
          value={safeValue}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${className} pr-10`}
        />
        <div 
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white cursor-pointer"
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <ChevronDown size={20} />
        </div>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl max-h-60 overflow-auto text-left">
          {filteredOptions.map((option, idx) => (
            <li
              key={idx}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="px-4 py-3 hover:bg-red-600 cursor-pointer text-gray-200 hover:text-white transition-colors border-b border-white/10 last:border-0"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
