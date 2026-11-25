"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coffee, User, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { apiFetch } from "@/src/commons/utils/api";

type AuthMode = "login" | "register";

interface AuthResponse {
  message: string;
  redirectTo: string;
}

export default function Login() {
  const [modo, setModo] = useState<AuthMode>("login");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const cambiarModo = (nuevoModo: AuthMode) => {
    setModo(nuevoModo);
    setError(null);
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (modo === "register" && password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      const endpoint = modo === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        modo === "login"
          ? { email, contrasena: password }
          : {
              nombre,
              apellido,
              email,
              contrasena: password,
              confirmarContrasena: confirmPassword,
            };

      const res = await apiFetch<AuthResponse>(endpoint, {
        method: "POST",
        body,
      });

      router.push(res.redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "bg-[#e8f4ec]/50 border-none rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-[#75c9b7] w-full text-sm text-[#16123f]";

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
        <p className="text-gray-500 text-sm mt-1">
          {modo === "login"
            ? "Inicia sesión para realizar y seguir tus pedidos"
            : "Crea tu cuenta para empezar a pedir en Café Aroma"}
        </p>
      </div>

      {/* Tarjeta Blanca del Formulario */}
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-sm">
        <h2 className="text-2xl font-bold text-[#16123f]">
          {modo === "login" ? "Bienvenido" : "Crear cuenta"}
        </h2>
        <p className="text-gray-400 text-sm mb-6 mt-1">
          {modo === "login"
            ? "Ingresa tus datos para continuar"
            : "Completa tus datos para registrarte como cliente"}
        </p>

        {error && (
          <p
            role="alert"
            className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-xs font-medium text-red-600"
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {modo === "register" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#16123f]">Nombre</label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 text-[#75c9b7]" size={18} />
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className={inputClass}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    minLength={2}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#16123f]">Apellido</label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 text-[#75c9b7]" size={18} />
                  <input
                    type="text"
                    placeholder="Tu apellido"
                    className={inputClass}
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    minLength={2}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Input Correo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#16123f]">Correo electrónico</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-[#75c9b7]" size={18} />
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                className={inputClass}
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
                placeholder={modo === "register" ? "Mínimo 8 caracteres" : "••••••••"}
                className="bg-[#e8f4ec]/50 border-none rounded-xl pl-11 pr-11 py-3 outline-none focus:ring-2 focus:ring-[#75c9b7] w-full text-sm text-[#16123f]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={modo === "register" ? 8 : 1}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Mostrar u ocultar contraseña"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {modo === "register" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#16123f]">Confirmar contraseña</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 text-[#75c9b7]" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  className={inputClass}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
            </div>
          )}

          {/* Botón Ingresar / Registrarse */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#16123f] text-white rounded-xl py-3.5 mt-2 font-medium hover:bg-[#2a235f] transition-colors flex items-center justify-center gap-2 text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Coffee size={18} />
            {loading
              ? modo === "login"
                ? "Ingresando..."
                : "Creando cuenta..."
              : modo === "login"
                ? "Iniciar Sesión"
                : "Crear Cuenta"}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-500">
          {modo === "login" ? (
            <>
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => cambiarModo("register")}
                className="text-[#75c9b7] font-semibold hover:underline cursor-pointer"
              >
                Regístrate
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => cambiarModo("login")}
                className="text-[#75c9b7] font-semibold hover:underline cursor-pointer"
              >
                Inicia sesión
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
