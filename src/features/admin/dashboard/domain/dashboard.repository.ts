import { IDashboardRaw, IPeriodos } from "./dashboard.entity";

// El dashboard solo LEE datos: no crea, edita ni elimina nada
export interface DashboardRepository {
    getResumen(periodos: IPeriodos, limite: number): Promise<IDashboardRaw | boolean>;
}
