import { IDashboard, IDashboardRaw, IPeriodos } from "../domain/dashboard.entity";
import { DashboardRepository } from "../domain/dashboard.repository";

// Reglas del negocio del dashboard (si cambian, solo se tocan aquí)
const META_DIARIA = 50;     // pedidos entregados que queremos lograr cada día
const STOCK_BAJO = 10;      // con este stock o menos, el producto se marca en naranja
const TOP = 5;              // cuántos productos y clientes mostrar

// Calcula desde qué fecha empieza hoy, esta semana (lunes) y este mes (día 1)
const calcularPeriodos = (): IPeriodos => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const semana = new Date(hoy);
    // getDay(): 0 = domingo, 1 = lunes... Restamos los días que pasaron desde el lunes
    semana.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));

    const mes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    return { hoy, semana, mes };
};

const contar = (raw: IDashboardRaw, estado: string) =>
    raw.pedidosHoyPorEstado.find((g) => g.estado === estado)?.cantidad ?? 0;

export class GetResumenUseCase {
    constructor(private repo: DashboardRepository) {}

    async execute(): Promise<IDashboard | false> {
        const raw = await this.repo.getResumen(calcularPeriodos(), TOP);
        if (!raw || raw === true) return false;

        const entregados = contar(raw, "ENTREGADO");

        return {
            totalesHoy: {
                entregados,
                // "Pendientes" = todo lo que aún no se entrega: solicitados + pendientes
                pendientes: contar(raw, "SOLICITADO") + contar(raw, "PENDIENTE"),
                cancelados: contar(raw, "CANCELADO"),
                total: raw.pedidosHoyPorEstado.reduce((acc, g) => acc + g.cantidad, 0),
            },
            metaDelDia: { actual: entregados, meta: META_DIARIA },
            ventas: raw.ventas,
            masVendidos: raw.masVendidos.map((p) => ({ ...p, stockBajo: p.stock <= STOCK_BAJO })),
            clientesFieles: raw.clientesFieles,
        };
    }
}
