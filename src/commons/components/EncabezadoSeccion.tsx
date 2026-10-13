import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface EncabezadoSeccionProps {
  icon: LucideIcon;
  titulo: string;
  subtitulo: string;
  accion?: ReactNode;
}

export default function EncabezadoSeccion({
  icon: Icon,
  titulo,
  subtitulo,
  accion,
}: EncabezadoSeccionProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
          <Icon size={20} />
        </span>
        <div>
          <h1 className="text-lg font-bold text-gray-900">{titulo}</h1>
          <p className="text-sm text-gray-500">{subtitulo}</p>
        </div>
      </div>
      {accion}
    </div>
  );
}