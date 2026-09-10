"use client";

// 1. Quitamos ModalContent de las importaciones
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

interface ICustomModal {
  abierto: boolean;              
  alCerrar: () => void;          
  titulo: string;                
  textoBotonAccion: string;      
  colorBotonAccion?: string;     
  children: React.ReactNode;     
}

export default function Ventanasemergentes({
  abierto,
  alCerrar,
  titulo,
  textoBotonAccion,
  colorBotonAccion = "bg-[#16123f]",
  children
}: ICustomModal) {
  return (
    // 2. Quitamos la propiedad "placement"
    <Modal isOpen={abierto} onOpenChange={alCerrar}>
        <ModalHeader className="flex flex-col gap-1 text-[#16123f]">
          {titulo}
        </ModalHeader>
        
        <ModalBody>
          {children}
        </ModalBody>
        
        <ModalFooter>
          {/* 3. Cambiamos "light" por "ghost" */}
            <Button variant="ghost" onPress={alCerrar}>
            Cancelar
          </Button>
          <Button className={`${colorBotonAccion} text-white font-bold`} onPress={alCerrar}>
            {textoBotonAccion}
          </Button>
        </ModalFooter>
    </Modal>
  );
}