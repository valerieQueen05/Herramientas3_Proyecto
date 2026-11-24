"use client";

import { useState } from "react";
import { Card, Tabs } from "@heroui/react";
import { PiCalendarCheck, PiWallet, PiPiggyBank, PiCaretRight } from "react-icons/pi";
import Title from "@/src/commons/components/Title";

import { IDashboard, IVentasPeriodo } from "@/src/features/admin/dashboard/domain/dashboard.entity";

const formatoCOP = (valor: number) => `$${valor.toLocaleString("es-CO")}`;

// Arma las 3 filas de un periodo a partir de los datos reales
const filas = (v: IVentasPeriodo) => [
  { icon: <PiCalendarCheck size={18} />, valor: v.ventas.toLocaleString("es-CO"), descripcion: "Ventas realizadas (pedidos entregados)" },
  { icon: <PiWallet size={18} />, valor: formatoCOP(v.ingresos), descripcion: "Ingresos" },
  { icon: <PiPiggyBank size={18} />, valor: formatoCOP(v.utilidad), descripcion: "Utilidad (ingresos - costo)" },
];

type Periodo = keyof IDashboard["ventas"]; // "dia" | "semana" | "mes"

// Las ventas vienen de /api/dashboard: día = hoy, semana = desde el lunes, mes = desde el día 1
export default function ResumenVentas({ ventas }: { ventas: IDashboard["ventas"] }) {
  const [periodo, setPeriodo] = useState<Periodo>("dia");

  return (
    <Card className="w-full min-w-0 border border-black/5 shadow-sm p-4">
      <Card.Header className="p-0 mb-3 flex-row items-center justify-between">
        <Title title="Resumen de ventas" />
        <Tabs selectedKey={periodo} onSelectionChange={(key) => setPeriodo(String(key) as Periodo)}>
          <Tabs.ListContainer className="bg-gray-100 rounded-lg p-0.5">
            <Tabs.List className="gap-0.5">
              <Tabs.Tab id="dia" className="px-3 py-1 text-xs rounded-md data-selected:bg-white data-selected:shadow-sm">
                Día
              </Tabs.Tab>
              <Tabs.Tab id="semana" className="px-3 py-1 text-xs rounded-md data-selected:bg-white data-selected:shadow-sm">
                Semana
              </Tabs.Tab>
              <Tabs.Tab id="mes" className="px-3 py-1 text-xs rounded-md data-selected:bg-white data-selected:shadow-sm">
                Mes
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
      </Card.Header>

      <div className="flex flex-col gap-2">
        {filas(ventas[periodo]).map((item) => (
          <div
            key={item.descripcion}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gray-50 text-[#16123f]">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-[#16123f]">{item.valor}</p>
                <p className="text-xs text-gray-400">{item.descripcion}</p>
              </div>
            </div>
            <PiCaretRight className="text-gray-300" />
          </div>
        ))}
      </div>
    </Card>
  );
}