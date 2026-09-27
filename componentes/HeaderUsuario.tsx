import { Bell } from "lucide-react";

export default function HeaderUsuario() {
  return (
    <header className="h-24 flex items-center justify-end px-10 w-full">
      <div className="flex items-center gap-6">
        
        {/* Icono de campana con su indicador Teal */}
        <button className="relative p-2 text-[#16123f] hover:opacity-70 transition-opacity bg-white rounded-full shadow-sm">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-[#75c9b7] text-[#16123f] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            2
          </span>
        </button>

        {/* Perfil de Usuario */}
        <div className="flex items-center gap-3">
          <div className="bg-[#16123f] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
            MA
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-[#16123f]">María Anderson</span>
            <span className="text-gray-500 text-[11px]">Cliente</span>
          </div>
        </div>
      </div>
    </header>
  );
}