import { Filter, Calendar, RefreshCw, ChevronRight } from "lucide-react";

// Simulamos los datos que vendrían de la base de datos
const historialPedidos = [
  { id: "ORD-1042", fecha: "2026-08-26", valor: "$9.75", estado: "Entregado", colorBg: "bg-[#75c9b7]", colorText: "text-[#16123f]" },
  { id: "ORD-1041", fecha: "2026-08-25", valor: "$9.75", estado: "Pendiente", colorBg: "bg-[#ffe26a]", colorText: "text-[#16123f]" },
  { id: "ORD-1040", fecha: "2026-08-24", valor: "$5.50", estado: "Solicitado", colorBg: "bg-[#c7ddcc]", colorText: "text-[#16123f]" },
  { id: "ORD-1039", fecha: "2026-08-23", valor: "$11.50", estado: "Cancelado", colorBg: "bg-gray-200", colorText: "text-gray-500" },
  { id: "ORD-1038", fecha: "2026-08-22", valor: "$13.00", estado: "Entregado", colorBg: "bg-[#75c9b7]", colorText: "text-[#16123f]" },
];

export default function PedidosUsuario() {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Título de la sección */}
      <div>
        <h1 className="text-2xl font-bold text-[#16123f]">Últimos Pedidos</h1>
        <p className="text-gray-500 mt-1 text-sm">Consulta el historial de tus pedidos y vuelve a realizarlos.</p>
      </div>

      {/* Barra de Filtros (Simulada visualmente) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4">
        
        {/* Filtro Estado */}
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <Filter size={14} /> Estado
          </label>
          <select className="bg-[#f0f7f4] border-none rounded-xl px-4 py-3 text-sm text-[#16123f] outline-none focus:ring-2 focus:ring-[#75c9b7] appearance-none cursor-pointer">
            <option>Todos</option>
            <option>Entregado</option>
            <option>Pendiente</option>
          </select>
        </div>

        {/* Filtro Fecha */}
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <Calendar size={14} /> Fecha
          </label>
          <input 
            type="date" 
            className="bg-[#f0f7f4] border-none rounded-xl px-4 py-3 text-sm text-[#16123f] outline-none focus:ring-2 focus:ring-[#75c9b7]"
          />
        </div>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* Encabezados de la tabla */}
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Orden</th>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold">Valor</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Opciones</th>
              </tr>
            </thead>
            
            {/* Cuerpo de la tabla usando .map() */}
            <tbody className="divide-y divide-gray-100 text-sm">
              {historialPedidos.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-[#16123f]">{pedido.id}</td>
                  <td className="px-6 py-4 text-gray-500">{pedido.fecha}</td>
                  <td className="px-6 py-4 font-bold text-[#16123f]">{pedido.valor}</td>
                  <td className="px-6 py-4">
                    {/* Etiqueta de estado dinámica */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${pedido.colorBg} ${pedido.colorText}`}>
                      {pedido.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center gap-2 bg-[#16123f] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#2a235f] transition-colors">
                      <RefreshCw size={12} />
                      Volver a pedir
                      <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}