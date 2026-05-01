import React from 'react';

export default function FilterRange({ minPlaceholder, maxPlaceholder, minValue, maxValue, onMinChange, onMaxChange }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        placeholder={minPlaceholder}
        value={minValue || ""}
        onChange={(e) => onMinChange(e.target.value)}
        className="w-full bg-white/5 text-white border border-white/10 rounded p-2 focus:outline-none focus:border-red-600 transition"
      />
      <span className="text-gray-500">-</span>
      <input
        type="number"
        placeholder={maxPlaceholder}
        value={maxValue || ""}
        onChange={(e) => onMaxChange(e.target.value)}
        className="w-full bg-white/5 text-white border border-white/10 rounded p-2 focus:outline-none focus:border-red-600 transition"
      />
    </div>
  );
}
