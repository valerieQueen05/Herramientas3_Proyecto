import { LucideIcon } from "lucide-react";

interface TarjetaFacturacionProps {
  icon: LucideIcon;
  value: string | number;
  description: string;
  iconBg: string;
  iconColor: string;
}

export default function TarjetaFacturacion({
  icon: Icon,
  value,
  description,
  iconBg,
  iconColor,
}: TarjetaFacturacionProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
        <Icon size={18} />
      </span>
      <div>
        <p className="text-lg font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}