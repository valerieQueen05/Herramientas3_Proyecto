import Image from "next/image";
import { Card, Table } from "@heroui/react";
import { ImageOff } from "lucide-react";
import Title from "@/src/commons/components/Title";
import { IDashboard } from "@/src/features/admin/dashboard/domain/dashboard.entity";

const formatoPrecio = (valor: number) =>
  `$${valor.toLocaleString("es-CO")}`;

// Los productos vienen de /api/dashboard (los que más unidades han vendido)
export default function ProductosMasVendidos({ productos }: { productos: IDashboard["masVendidos"] }) {
  return (
    <Card className="w-full min-w-0 border border-black/5 shadow-sm p-4">
      <Card.Header className="p-0 mb-2">
        <Title title="Productos más vendidos" icon="trophy" />
      </Card.Header>

      {productos.length === 0 ? (
        <p className="py-2 text-sm text-gray-400">Aún no hay ventas registradas.</p>
      ) : (
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
                  key={producto.id}
                  className="border-b border-gray-50 last:border-0"
                >
                  <Table.Cell className="py-3">
                    {producto.imagen?.startsWith("https://") ? (
                      <Image
                        src={producto.imagen}
                        alt={producto.nombre}
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-50 text-gray-300">
                        <ImageOff size={16} />
                      </div>
                    )}
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
      )}
    </Card>
  );
}