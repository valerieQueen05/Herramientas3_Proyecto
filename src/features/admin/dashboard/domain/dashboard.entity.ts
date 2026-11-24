// Fechas desde las que se calcula cada periodo del resumen de ventas
export interface IPeriodos {
  hoy: Date;    // hoy a las 00:00
  semana: Date; // lunes de esta semana a las 00:00
  mes: Date;    // día 1 de este mes a las 00:00
}

// Ventas de un periodo (solo pedidos ENTREGADOS)
export interface IVentasPeriodo {
  ventas: number;   // cantidad de pedidos entregados
  ingresos: number; // suma del total de esos pedidos
  utilidad: number; // ingresos - costo (precio de compra de lo vendido)
}

export interface IProductoVendido {
  id: number;
  nombre: string;
  categoria: string;
  imagen: string | null;
  vendidos: number;
  stock: number;
  precio: number;
}

export interface IClienteFiel {
  id: number;
  nombre: string;
  pedidos: number;
}

// Lo que devuelve el repositorio: los datos crudos sacados de la BD
export interface IDashboardRaw {
  pedidosHoyPorEstado: { estado: string; cantidad: number }[];
  ventas: { dia: IVentasPeriodo; semana: IVentasPeriodo; mes: IVentasPeriodo };
  masVendidos: IProductoVendido[];
  clientesFieles: IClienteFiel[];
}

// Lo que devuelve la API: los datos ya listos para la pantalla
export interface IDashboard {
  totalesHoy: { entregados: number; pendientes: number; cancelados: number; total: number };
  metaDelDia: { actual: number; meta: number };
  ventas: IDashboardRaw["ventas"];
  masVendidos: (IProductoVendido & { stockBajo: boolean })[];
  clientesFieles: IClienteFiel[];
}
