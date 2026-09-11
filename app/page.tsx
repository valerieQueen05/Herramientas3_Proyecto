import Navbar from "../componentes/Barralateral";
import CardAroma from "../componentes/CardAroma";
import MetaDelDia from "../componentes/Metadeldia";
import ProductosMasVendidos from "../componentes/Productosmasvendidos";
import ResumenVentas from "../componentes/Resumenventas";
import ClientesFieles from "../componentes/Clientesfieles";
import Title from "@/componentes/Title";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 flex flex-col gap-6">
        {/* Totales del día */}
        <section className="flex flex-col gap-3">
          <Title title="Totales del día" icon="trend" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <CardAroma
              icon="check"
              value={2}
              description="Entregados"
              backgroundColor="bg-emerald-50"
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
            />
            <CardAroma
              icon="clock"
              value={2}
              description="Pendientes"
              backgroundColor="bg-blue-50"
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
            <CardAroma
              icon="xCircle"
              value={1}
              description="Cancelados"
              backgroundColor="bg-red-50"
              iconBg="bg-red-100"
              iconColor="text-red-500"
            />
            <CardAroma
              icon="assignment"
              value={7}
              description="Total"
              backgroundColor="bg-white"
              iconBg="bg-gray-100"
              iconColor="text-gray-600"
            />
            <MetaDelDia actual={2} meta={50} />
          </div>
        </section>

        {/* Productos más vendidos */}
        <ProductosMasVendidos />

        {/* Resumen de ventas + Clientes fieles */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResumenVentas />
          <ClientesFieles />
        </section>
      </main>
    </div>
  );
}