import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { logger } from "@/src/commons/utils/logger";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { message: "Debes seleccionar una imagen." },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Formato no permitido. Usa JPG, PNG o WebP." },
        { status: 415 }
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: "La imagen no puede superar 5 MB." },
        { status: 413 }
      );
    }

    const blob = await put(
      `products/${crypto.randomUUID()}`,
      file,
      { access: "public" }
    );

    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch (error) {
    logger({
      error: error instanceof Error ? error : String(error),
      module: "uploadProductImage",
    });

    return NextResponse.json(
      { message: "No se pudo subir la imagen." },
      { status: 500 }
    );
  }
}