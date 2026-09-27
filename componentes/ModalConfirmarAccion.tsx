"use client";

import Modal from "./Modal";

interface ModalConfirmarAccionProps {
  titulo: string;
  mensaje: string;
  textoBoton: string;
  colorBoton: "navy" | "rojo";
  onCancelar: () => void;
  onConfirmar: () => void;
}

export default function ModalConfirmarAccion({
  titulo,
  mensaje,
  textoBoton,
  colorBoton,
  onCancelar,
  onConfirmar,
}: ModalConfirmarAccionProps) {
  const claseBoton =
    colorBoton === "rojo"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-[#16123f] hover:opacity-90";

  return (
    <Modal
      title={titulo}
      onClose={onCancelar}
      footer={
        <>
          <button
            onClick={onCancelar}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition ${claseBoton}`}
          >
            {textoBoton}
          </button>
        </>
      }
    >
      <p className="text-sm text-gray-600">{mensaje}</p>
    </Modal>
  );
}