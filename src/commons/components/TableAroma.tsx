import Buscador from "@/src/commons/components/Buscador";
import Badge from "@/src/commons/components/Badge";
import { Pencil, Trash2 } from "lucide-react";

// Fila genérica: todas tienen id, nombre y estado; precio/stock/categoria son opcionales (productos)
interface ITableRow {
    id: number;
    nombre: string;
    estado: string;
    precio?: string | number;
    stock?: string | number;
    categoria?: string;
}

interface ITableAromaProps<T extends ITableRow> {
    headers: string[];
    data: T[];
    handleEdit: (item: T) => void;
    handleDelete: (item: T) => void;
    handleSearch: (query: string) => void;
    searchValue: string;
}

export default function TableAroma<T extends ITableRow>({ headers, data, handleEdit, handleDelete, handleSearch, searchValue }: ITableAromaProps<T>) {
  return (
    <div>
    {<Buscador placeholder="Buscar..." value={searchValue} onChange={handleSearch} />}

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                {headers.map((header) => (
                  <th key={header} className="px-6 py-3 font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
            
              {data?.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                  <td className="px-6 py-3 text-gray-400">#{c.id}</td>
                  <td className="px-6 py-3 font-medium text-gray-900">{c.nombre}</td>
                  {c.precio && <td className="px-6 py-3 text-gray-700">{c.precio}</td>}
                  {c.stock && <td className="px-6 py-3 text-gray-700">{c.stock}</td>}
                  {c.categoria && <td className="px-6 py-3 text-gray-700">{c.categoria}</td>}
                  <td className="px-6 py-3">
                    <Badge variant={c.estado.toLowerCase() as "activo" | "inactivo"} label={c.estado} />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex justify-end gap-3 text-gray-400">
                      <button
                        onClick={() => handleEdit(c)}
                        className="transition hover:text-[#16123f]"
                        aria-label="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        className="transition hover:text-red-600"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  )}