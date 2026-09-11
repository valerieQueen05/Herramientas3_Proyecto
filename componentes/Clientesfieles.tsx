import { Card, Avatar } from "@heroui/react";
import Title from "./Title";

interface ICliente {
  nombre: string;
  pedidos: number;
}

const clientes: ICliente[] = [
  { nombre: "Laura Patiño", pedidos: 48 },
  { nombre: "Esteban Ríos", pedidos: 36 },
  { nombre: "Valentina Cruz", pedidos: 29 },
  { nombre: "Camilo Ortega", pedidos: 22 },
  { nombre: "Daniela Mora", pedidos: 18 },
];

const iniciales = (nombre: string) =>
  nombre
    .split(" ")
    .map((parte) => parte[0])
    .slice(0, 2)
    .join("");

export default function ClientesFieles() {
  return (
    <Card className="w-full min-w-0 border border-black/5 shadow-sm p-4">
      <Card.Header className="p-0 mb-3">
        <Title title="Clientes fieles" icon="trophy" />
      </Card.Header>

      <div className="flex flex-col gap-1">
        {clientes.map((cliente, index) => (
          <div
            key={cliente.nombre}
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