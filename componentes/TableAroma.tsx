import Buscador from "./Buscador";
import Badge from "./Badge";
import { Pencil, Trash2 } from "lucide-react";

interface ITableAromaProps {
    headers: string[];
    data: any[];
    handleEdit: (item: any) => void;
    handleDelete: (item: any) => void;
    handleSearch: (query: string) => void;
    searchValue: string;
}

export default function TableAroma({ headers, data, handleEdit, handleDelete, handleSearch, searchValue }: ITableAromaProps) {
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
                        onClick={() => {
                          handleEdit && handleEdit(c);
                        }}
                        className="transition hover:text-[#16123f]"
                        aria-label="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={handleDelete ? () => handleDelete(c) : undefined}
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