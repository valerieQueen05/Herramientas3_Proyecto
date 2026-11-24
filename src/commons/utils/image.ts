// Reglas de las imágenes de productos.
// Este archivo no importa nada del servidor, así que lo pueden usar
// tanto el modal (navegador) como el controller (servidor).

export const IMAGE_MAX_MB = 2;
export const IMAGE_MAX_SIZE = IMAGE_MAX_MB * 1024 * 1024; // 2 MB en bytes
export const IMAGE_TYPES = ["image/jpeg", "image/png"];

// Revisa el tipo y el tamaño. Devuelve el mensaje de error, o null si está bien.
export const validateImage = (file: File): string | null => {
  if (!IMAGE_TYPES.includes(file.type)) return "La imagen debe ser JPG o PNG";
  if (file.size === 0) return "La imagen está vacía";
  if (file.size > IMAGE_MAX_SIZE) return `La imagen no puede superar ${IMAGE_MAX_MB} MB`;
  return null;
};

// El tipo (file.type) lo decide la extensión del archivo, y se puede falsificar
// renombrando un .txt a .png. Por eso revisamos los primeros bytes ("firma"),
// que son distintos en cada formato:
//   PNG  -> 89 50 4E 47
//   JPEG -> FF D8 FF
export const isRealImage = async (file: File): Promise<boolean> => {
  const bytes = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  const isJpg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  return isPng || isJpg;
};
