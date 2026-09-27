"use client";

import { Search } from "lucide-react";

interface BuscadorProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export default function Buscador({ placeholder, value, onChange }: BuscadorProps) {
  return (
    <div className="relative">
      <Search
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#16123f] focus:ring-1 focus:ring-[#16123f]"
      />
    </div>
  );
}