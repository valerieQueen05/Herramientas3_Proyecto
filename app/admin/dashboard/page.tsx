"use client";

import { useEffect, useState } from "react";
import Navbar from "@/src/commons/components/Barralateral";
import CardAroma from "@/src/commons/components/CardAroma";
import MetaDelDia from "@/src/features/admin/dashboard/components/Metadeldia";
import ProductosMasVendidos from "@/src/features/admin/dashboard/components/Productosmasvendidos";
import ResumenVentas from "@/src/features/admin/dashboard/components/Resumenventas";
import ClientesFieles from "@/src/features/admin/dashboard/components/Clientesfieles";
import Title from "@/src/commons/components/Title";
import { apiFetch } from "@/src/commons/utils/api";
import { IDashboard } from "@/src/features/admin/dashboard/domain/dashboard.entity";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<IDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Al abrir la página pedimos todos los datos del dashboard en una sola llamada
  useEffect(() => {
    apiFetch<{ data: IDashboard }>("/api/dashboard")
      .then((res) => setDashboard(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Error al cargar el dashboard"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 flex flex-col gap-6">
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {!dashboard && !error && (
          <p className="text-sm text-gray-400">Cargando datos...</p>
        )}

        {dashboard && (
          <>
            {/* Totales del día */}
            <section className="flex flex-col gap-3">
              <Title title="Totales del día" icon="trend" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <CardAroma
                  icon="check"
                  value={dashboard.totalesHoy.entregados}
                  description="Entregados"
                  backgroundColor="bg-emerald-50"
                  iconBg="bg-emerald-100"
                  iconColor="text-emerald-600"
                />
                <CardAroma
                  icon="clock"
                  value={dashboard.totalesHoy.pendientes}
                  description="Pendientes"
                  backgroundColor="bg-blue-50"
                  iconBg="bg-blue-100"
                  iconColor="text-blue-600"
                />
                <CardAroma
                  icon="xCircle"
                  value={dashboard.totalesHoy.cancelados}
                  description="Cancelados"
                  backgroundColor="bg-red-50"
                  iconBg="bg-red-100"
                  iconColor="text-red-500"
                />
                <CardAroma
                  icon="assignment"
                  value={dashboard.totalesHoy.total}
                  description="Total"
                  backgroundColor="bg-white"
                  iconBg="bg-gray-100"
                  iconColor="text-gray-600"
                />
                <MetaDelDia actual={dashboard.metaDelDia.actual} meta={dashboard.metaDelDia.meta} />
              </div>
            </section>

            {/* Productos más vendidos */}
            <ProductosMasVendidos productos={dashboard.masVendidos} />

            {/* Resumen de ventas + Clientes fieles */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResumenVentas ventas={dashboard.ventas} />
              <ClientesFieles clientes={dashboard.clientesFieles} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}
