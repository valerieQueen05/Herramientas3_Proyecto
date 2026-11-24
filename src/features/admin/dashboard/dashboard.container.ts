import { PrismaDashboardRepository } from "./infrastructure/prisma-dashboard.repository";
import { GetResumenUseCase } from "./application/get-resumen.use-case";

const repo = new PrismaDashboardRepository();

export const dashboardContainer = {
    getResumen: new GetResumenUseCase(repo),
};
