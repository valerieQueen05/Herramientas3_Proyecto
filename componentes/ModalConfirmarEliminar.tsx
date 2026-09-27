"use client";

import Modal from "./Modal";

interface ModalConfirmarEliminarProps {
  titulo: string;
  nombre: string;
  onCancelar: () => void;
  onConfirmar: () => void;
}

export default function ModalConfirmarEliminar({
  titulo,
  nombre,
  onCancelar,
  onConfirmar,
}: ModalConfirmarEliminarProps) {
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
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Eliminar
          </button>
        </>
      }
    >
      <p className="text-sm text-gray-600">
        ¿Estás segura de que deseas eliminar{" "}
        <span className="font-semibold text-gray-900">{nombre}</span>? Esta
        acción no se puede deshacer.
      </p>
    </Modal>
  );
}