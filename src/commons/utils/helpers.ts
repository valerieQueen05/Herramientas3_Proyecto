import { put, del } from "@vercel/blob";
import { logger } from "./logger";

// "Cafés Calientes" -> "cafes-calientes"
export const createSlug = (name: string): string => {
    return name
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '') // quita tildes
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')    // quita caracteres especiales
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// Sube un archivo a Vercel Blob y devuelve su URL pública (o null si falla).
// put() lee el token de la variable BLOB_READ_WRITE_TOKEN del .env
// Date.now() en el nombre evita que dos archivos con el mismo nombre choquen.
export async function uploadImage(path: string, file: File): Promise<string | null> {
    try {
        const blob = await put(`${path}/${Date.now()}-${file.name}`, file, {
            access: 'public',
        });
        return blob.url;
    } catch (error) {
        logger({ error: error as Error, module: "uploadImage" });
        return null;
    }
}

// Borra un archivo de Vercel Blob a partir de su URL.
// Lo usamos si la imagen se subió pero el producto no se pudo guardar en la BD.
export async function deleteImage(url: string): Promise<void> {
    try {
        await del(url);
    } catch (error) {
        logger({ error: error as Error, module: "deleteImage" });
    }
}
