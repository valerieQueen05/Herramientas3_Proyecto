import { Card, Avatar } from "@heroui/react";
import Title from "@/src/commons/components/Title";
import { IClienteFiel } from "@/src/features/admin/dashboard/domain/dashboard.entity";

const iniciales = (nombre: string) =>
  nombre
    .split(" ")
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("");

// Los clientes vienen de /api/dashboard (los que más pedidos han hecho)
export default function ClientesFieles({ clientes }: { clientes: IClienteFiel[] }) {
  return (
    <Card className="w-full min-w-0 border border-black/5 shadow-sm p-4">
      <Card.Header className="p-0 mb-3">
        <Title title="Clientes fieles" icon="trophy" />
      </Card.Header>

      <div className="flex flex-col gap-1">
        {clientes.length === 0 && (
          <p className="p-2 text-sm text-gray-400">Aún no hay pedidos registrados.</p>
        )}
        {clientes.map((cliente, index) => (
          <div
            key={cliente.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center h-5 w-5 rounded-full bg-gray-100 text-[11px] font-semibold text-gray-500">
                {index + 1}
              </span>
              <Avatar size="sm">
                <Avatar.Fallback>{iniciales(cliente.nombre)}</Avatar.Fallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-[#16123f]">
                  {cliente.nombre}
                </p>
                <p className="text-xs text-gray-400">
                  {cliente.pedidos} pedidos en total
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#16123f] bg-[#c7ddcc] rounded-full px-2 py-1">
              {cliente.pedidos}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}