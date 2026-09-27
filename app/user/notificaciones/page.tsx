import { Bell, CheckCircle2 } from "lucide-react";

// Simulamos los datos de las notificaciones
const notificaciones = [
  {
    id: 1,
    titulo: "Pedido entregado",
    descripcion: "Tu orden ORD-1042 ha sido entregada.",
    tiempo: "Hace 10 min",
    nueva: true, 
  },
  {
    id: 2,
    titulo: "Pedido en preparación",
    descripcion: "Tu orden ORD-1041 está siendo preparada.",
    tiempo: "Hace 1h",
    nueva: true,
  },
  {
    id: 3,
    titulo: "Promoción disponible",
    descripcion: "2x1 en Frappuccinos este viernes.",
    tiempo: "Hace 3h",
    nueva: false, 
  },
  {
    id: 4,
    titulo: "Stock actualizado",
    descripcion: "Latte de Avellana disponible nuevamente.",
    tiempo: "Ayer",
    nueva: false,
  },
];

export default function NotificacionesUsuario() {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Título de la sección */}
      <div>
        <h1 className="text-2xl font-bold text-[#16123f]">Notificaciones</h1>
        <p className="text-gray-500 mt-1 text-sm">Mantente al tanto del estado de tus pedidos y novedades.</p>
      </div>

     {/* Contenedor de Notificaciones */}
        <div className="flex flex-col gap-4">
        {notificaciones.map((notif) => (
          <div 
            key={notif.id} 
            // Si es nueva, le ponemos fondo menta clarito, si no, fondo blanco
            className={`flex items-center justify-between p-4 md:p-5 rounded-3xl shadow-sm transition-colors ${notif.nueva ? 'bg-[#e8f4ec]' : 'bg-white'}`}
          >
            {/* Lado izquierdo: Icono y Textos */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${notif.nueva ? 'bg-[#75c9b7] text-white' : 'bg-gray-100 text-[#16123f]'}`}>
                <Bell size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[#16123f] text-sm md:text-base">{notif.titulo}</h3>
                <p className="text-gray-500 text-xs md:text-sm mt-0.5">{notif.descripcion}</p>
              </div>
            </div>
            
            {/* Lado derecho: Tiempo y Checkmark */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-xs font-medium">{notif.tiempo}</span>
              {/* Solo mostramos el check si la notificación es "nueva" */}
              {notif.nueva && (
                <CheckCircle2 className="text-[#75c9b7]" size={20} />
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}