export interface ProductoPedido {
  nombre: string;
  cantidad: number;
  precioUnit: number;
}

export interface Pedido {
  id: number;
  fecha: string;
  cliente: string;
  ubicacion: string;
  estado: "Solicitado" | "Pendiente" | "Entregado" | "Cancelado";
  productos: ProductoPedido[];
}

export const formatoCOP = (valor: number) => `$${valor.toLocaleString("es-CO")}`;

export const valorPedido = (pedido: Pedido) =>
  pedido.productos.reduce((acc, p) => acc + p.cantidad * p.precioUnit, 0);

export const pedidosIniciales: Pedido[] = [
  {
    id: 1045,
    fecha: "2026-08-26 09:15",
    cliente: "Laura Patiño",
    ubicacion: "Calle 72 # 11-30, Chapinero",
    estado: "Solicitado",
    productos: [
      { nombre: "Latte Clásico", cantidad: 2, precioUnit: 8500 },
      { nombre: "Muffin de Arándanos", cantidad: 1, precioUnit: 5500 },
    ],
  },
  {
    id: 1044,
    fecha: "2026-08-26 08:50",
    cliente: "Esteban Ríos",
    ubicacion: "Av. Caracas # 14-45, Centro",
    estado: "Solicitado",
    productos: [{ nombre: "Frappuccino Caramelo", cantidad: 1, precioUnit: 12500 }],
  },
  {
    id: 1043,
    fecha: "2026-08-26 08:32",
    cliente: "Valentina Cruz",
    ubicacion: "Calle 100 # 45-20, Usaquén",
    estado: "Pendiente",
    productos: [
      { nombre: "Cappuccino Italiano", cantidad: 2, precioUnit: 9000 },
      { nombre: "Croissant de Mantequilla", cantidad: 3, precioUnit: 4500 },
    ],
  },
  {
    id: 1042,
    fecha: "2026-08-26 08:10",
    cliente: "Camilo Ortega",
    ubicacion: "Cra 7 # 115-30, Norte",
    estado: "Pendiente",
    productos: [{ nombre: "Cold Brew Vainilla", cantidad: 2, precioUnit: 10500 }],
  },
  {
    id: 1041,
    fecha: "2026-08-26 07:55",
    cliente: "Daniela Mora",
    ubicacion: "Calle 85 # 12-50, Chapinero",
    estado: "Entregado",
    productos: [
      { nombre: "Espresso Doble", cantidad: 2, precioUnit: 6000 },
      { nombre: "Brownie de Chocolate", cantidad: 1, precioUnit: 6500 },
    ],
  },
  {
    id: 1040,
    fecha: "2026-08-26 07:30",
    cliente: "Felipe Castaño",
    ubicacion: "Cra 11 # 93-77, Chicó",
    estado: "Entregado",
    productos: [{ nombre: "Matcha Latte", cantidad: 1, precioUnit: 11000 }, { nombre: "Cookies de Chocolate", cantidad: 1, precioUnit: 3500 }],
  },
  {
    id: 1039,
    fecha: "2026-08-26 07:05",
    cliente: "Isabella Gómez",
    ubicacion: "Calle 127 # 20-15, Suba",
    estado: "Cancelado",
    productos: [{ nombre: "Cheesecake de Frutos Rojos", cantidad: 1, precioUnit: 9500 }],
  },
];