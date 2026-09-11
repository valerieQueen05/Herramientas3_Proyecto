import { Card, Table } from "@heroui/react";
import Title from "./Title";

interface IProducto {
  emoji: string;
  nombre: string;
  categoria: string;
  vendidos: number;
  stock: number;
  precio: number;
  stockBajo?: boolean;
}

const productos: IProducto[] = [
  { emoji: "☕", nombre: "Latte Clásico", categoria: "Cafés Calientes", vendidos: 28, stock: 40, precio: 8500 },
  { emoji: "🧋", nombre: "Frappuccino Caramelo", categoria: "Bebidas Frías", vendidos: 22, stock: 25, precio: 12500 },
  { emoji: "☕", nombre: "Cappuccino Italiano", categoria: "Cafés Calientes", vendidos: 19, stock: 32, precio: 9000 },
  { emoji: "🧁", nombre: "Muffin de Arándanos", categoria: "Postres", vendidos: 15, stock: 15, precio: 5500, stockBajo: true },
  { emoji: "🥐", nombre: "Croissant de Mantequilla", categoria: "Panadería", vendidos: 12, stock: 30, precio: 4500 },
];

const formatoPrecio = (valor: number) =>
  `$${valor.toLocaleString("es-CO")}`;

export default function ProductosMasVendidos() {
  return (
    <Card className="w-full min-w-0 border border-black/5 shadow-sm p-4">
      <Card.Header className="p-0 mb-2">
        <Title title="Productos más vendidos" icon="trophy" />
      </Card.Header>

      <Table className="w-full">
        <Table.ScrollContainer>
          <Table.Content aria-label="Productos más vendidos">
            <Table.Header className="border-b border-gray-100 text-[11px] uppercase tracking-wide text-gray-400">
              <Table.Column className="text-left font-medium py-2">Producto</Table.Column>
              <Table.Column className="text-left font-medium py-2">Nombre</Table.Column>
              <Table.Column className="text-right font-medium py-2">Vendidos</Table.Column>
              <Table.Column className="text-right font-medium py-2">Stock</Table.Column>
              <Table.Column className="text-right font-medium py-2">Precio</Table.Column>
            </Table.Header>
            <Table.Body>
              {productos.map((producto) => (
                <Table.Row
                  key={producto.nombre}
                  className="border-b border-gray-50 last:border-0"
                >
                  <Table.Cell className="py-3">
                    <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-50 text-lg">
                      <span aria-hidden>{producto.emoji}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <p className="text-sm font-semibold text-[#16123f]">
                      {producto.nombre}
                    </p>
                    <p className="text-xs text-gray-400">{producto.categoria}</p>
                  </Table.Cell>
                  <Table.Cell className="py-3 text-right text-sm font-medium text-gray-700">
                    {producto.vendidos}
                  </Table.Cell>
                  <Table.Cell
                    className={`py-3 text-right text-sm font-medium ${
                      producto.stockBajo ? "text-orange-500" : "text-gray-700"
                    }`}
                  >
                    {producto.stock}
                  </Table.Cell>
                  <Table.Cell className="py-3 text-right text-sm font-medium text-gray-700">
                    {formatoPrecio(producto.precio)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </Card>
  );
}