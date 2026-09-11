"use client";

import { useState } from "react";
import { Card, Tabs } from "@heroui/react";
import { PiCalendarCheck, PiWallet, PiPiggyBank, PiCaretRight } from "react-icons/pi";
import Title from "./Title";

interface IResumenItem {
  icon: React.ReactNode;
  valor: string;
  descripcion: string;
}

const datosPorPeriodo: Record<string, IResumenItem[]> = {
  dia: [
    { icon: <PiCalendarCheck size={18} />, valor: "42", descripcion: "Ventas realizadas" },
    { icon: <PiWallet size={18} />, valor: "$1,245,000", descripcion: "Ganancias totales" },
    { icon: <PiPiggyBank size={18} />, valor: "$186,500", descripcion: "Ahorro acumulado" },
  ],
  semana: [
    { icon: <PiCalendarCheck size={18} />, valor: "268", descripcion: "Ventas realizadas" },
    { icon: <PiWallet size={18} />, valor: "$7,890,000", descripcion: "Ganancias totales" },
    { icon: <PiPiggyBank size={18} />, valor: "$1,120,000", descripcion: "Ahorro acumulado" },
  ],
  mes: [
    { icon: <PiCalendarCheck size={18} />, valor: "1,140", descripcion: "Ventas realizadas" },
    { icon: <PiWallet size={18} />, valor: "$32,450,000", descripcion: "Ganancias totales" },
    { icon: <PiPiggyBank size={18} />, valor: "$4,760,000", descripcion: "Ahorro acumulado" },
  ],
};

export default function ResumenVentas() {
  const [periodo, setPeriodo] = useState("dia");

  return (
    <Card className="w-full min-w-0 border border-black/5 shadow-sm p-4">
      <Card.Header className="p-0 mb-3 flex-row items-center justify-between">
        <Title title="Resumen de ventas" />
        <Tabs selectedKey={periodo} onSelectionChange={(key) => setPeriodo(String(key))}>
          <Tabs.ListContainer className="bg-gray-100 rounded-lg p-0.5">
            <Tabs.List className="gap-0.5">
              <Tabs.Tab id="dia" className="px-3 py-1 text-xs rounded-md data-[selected]:bg-white data-[selected]:shadow-sm">
                Día
              </Tabs.Tab>
              <Tabs.Tab id="semana" className="px-3 py-1 text-xs rounded-md data-[selected]:bg-white data-[selected]:shadow-sm">
                Semana
              </Tabs.Tab>
              <Tabs.Tab id="mes" className="px-3 py-1 text-xs rounded-md data-[selected]:bg-white data-[selected]:shadow-sm">
                Mes
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
      </Card.Header>

      <div className="flex flex-col gap-2">
        {datosPorPeriodo[periodo].map((item) => (
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