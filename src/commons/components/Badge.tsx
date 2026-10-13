type BadgeVariant =
  | "activo"
  | "inactivo"
  | "administrador"
  | "administrativo"
  | "mensajero"
  | "solicitado"
  | "pendiente"
  | "entregado"
  | "cancelado";

const estilos: Record<BadgeVariant, string> = {
  activo: "bg-emerald-50 text-emerald-700",
  inactivo: "bg-gray-100 text-gray-500",
  administrador: "bg-violet-50 text-violet-700",
  administrativo: "bg-teal-50 text-teal-700",
  mensajero: "bg-amber-50 text-amber-700",
  solicitado: "bg-amber-50 text-amber-700",
  pendiente: "bg-blue-50 text-blue-700",
  entregado: "bg-emerald-50 text-emerald-700",
  cancelado: "bg-red-50 text-red-600",
};

const conPunto: BadgeVariant[] = ["activo", "inactivo"];

const puntoColor: Partial<Record<BadgeVariant, string>> = {
  activo: "bg-emerald-500",
  inactivo: "bg-gray-400",
};

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
}

export default function Badge({ variant, label }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${estilos[variant]}`}
    >
      {conPunto.includes(variant) && (
        <span className={`h-1.5 w-1.5 rounded-full ${puntoColor[variant]}`} />
      )}
      {label}
    </span>
  );
}