"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coffee, User, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Lógica de ruteo simulada:
    // Si el usuario escribe la palabra "admin", lo enviamos a la ruta de tu compañera.
    // De lo contrario, asume que es un cliente y lo envía a tu ruta.
    if (email.toLowerCase().includes("admin")) {
      router.push("/admin/dashboard");
    } else {
      router.push("/user/inicio");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans p-4">
      {/* Encabezado del Login */}
      <div className="flex flex-col items-center mb-6">
        <div className="bg-[#16123f] w-12 h-12 rounded-xl flex items-center justify-center mb-3">
          <Coffee className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold text-[#16123f] flex items-center gap-2">
          Café Aroma
        </h1>
        <p className="text-gray-500 text-sm mt-1">Inicia sesión para realizar y seguir tus pedidos</p>
      </div>

      {/* Tarjeta Blanca del Formulario */}
      <div className="bg-white rounded-3xl p-8 w-full max-w-100 shadow-sm">
        <h2 className="text-2xl font-bold text-[#16123f]">Bienvenido</h2>
        <p className="text-gray-400 text-sm mb-6 mt-1">Ingresa tus datos para continuar</p>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          
          {/* Input Usuario */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#16123f]">Usuario</label>
            <div className="relative flex items-center">
              <User className="absolute left-4 text-[#75c9b7]" size={18} />
              <input 
                type="text" 
                placeholder="tu_usuario"
                className="bg-[#e8f4ec]/50 border-none rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#75c9b7] w-full text-sm text-[#16123f]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Input Contraseña */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#16123f]">Contraseña</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-[#75c9b7]" size={18} />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-[#e8f4ec]/50 border-none rounded-xl pl-11 pr-11 py-3 outline-none focus:ring-2 focus:ring-[#75c9b7] w-full text-sm text-[#16123f]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Recordarme y Olvidé contraseña */}
          <div className="flex items-center justify-between mt-1">
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-[#16123f] focus:ring-[#16123f] focus:ring-offset-0 w-4 h-4 cursor-pointer" />
              Recordarme
            </label>
            <a href="#" className="text-xs text-[#75c9b7] font-medium hover:underline">¿Olvidaste tu contraseña?</a>
          </div>

          {/* Botón Ingresar */}
          <button 
            type="submit" 
            className="w-full bg-[#16123f] text-white rounded-xl py-3.5 mt-2 font-medium hover:bg-[#2a235f] transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
          >
            <Coffee size={18} />
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-500">
          ¿No tienes cuenta? <a href="#" className="text-[#75c9b7] font-semibold hover:underline">Regístrate</a>
        </div>
      </div>
    </div>
  );
}