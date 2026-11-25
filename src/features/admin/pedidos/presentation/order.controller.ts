import { NextResponse } from "next/server";
import { aroma } from "@/src/utils/location";
import { logger } from "@/src/commons/utils/logger";
import { isAdminRole, requireAdmin, requireAuth } from "@/src/commons/lib/auth";
import { IRequestParams } from "@/src/utils/interfaces";
import { orderContainer } from "../order.container";
import { EstadoPedido } from "../domain/order.entity";
import { createOrderSchema, updateOrderStatusSchema } from "../schemas/orderSchema";

const toError = (error: unknown) => (error instanceof Error ? error : String(error));
const serverError = () =>
  NextResponse.json({ message: aroma.errors.serverError }, { status: 500 });

const getIdFromParams = async (params: IRequestParams["params"]) => {
  const { id } = await params;
  const numericId = Number(id);
  return Number.isInteger(numericId) && numericId > 0 ? numericId : null;
};

const ESTADOS_VALIDOS: EstadoPedido[] = [
  "SOLICITADO",
  "PENDIENTE",
  "ENTREGADO",
  "CANCELADO",
];

export async function listOrders(req: Request) {
  try {
    const auth = await requireAuth();
    if (auth.response) return auth.response;

    const { searchParams } = new URL(req.url);
    const estadoParam = searchParams.get("estado")?.toUpperCase() as EstadoPedido | undefined;
    const estado = estadoParam && ESTADOS_VALIDOS.includes(estadoParam) ? estadoParam : undefined;

    // Los clientes solo ven sus propios pedidos; el administrador ve todos
    const usuarioId = isAdminRole(auth.user.rol) ? undefined : auth.user.id;

    const data = await orderContainer.listOrders.execute({ usuarioId, estado });

    if (!data) {
      return NextResponse.json({ message: aroma.errors.notFoundData }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    logger({ error: toError(error), module: "listOrders" });
    return serverError();
  }
}

export async function createOrder(req: Request) {
  try {
    const auth = await requireAuth();
    if (auth.response) return auth.response;

    const bodyData = await req.json();
    const validation = createOrderSchema.safeParse(bodyData);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0]?.message ?? aroma.errors.unprocessableContent },
        { status: 422 }
      );
    }

    const result = await orderContainer.createOrder.execute({
      usuarioId: auth.user.id,
      direccion: validation.data.direccion,
      items: validation.data.items,
    });

    if (!result.ok) {
      return NextResponse.json({ message: result.error }, { status: result.status });
    }

    return NextResponse.json(
      { message: "Pedido realizado correctamente", data: result.data },
      { status: 201 }
    );
  } catch (error) {
    logger({ error: toError(error), module: "createOrder" });
    return serverError();
  }
}

export async function getOrderById(req: Request, { params }: IRequestParams) {
  try {
    const auth = await requireAuth();
    if (auth.response) return auth.response;

    const id = await getIdFromParams(params);
    if (!id) {
      return NextResponse.json({ message: aroma.errors.invalidId }, { status: 400 });
    }

    const data = await orderContainer.getOrderById.execute(id);
    if (!data) {
      return NextResponse.json({ message: aroma.errors.notFound }, { status: 404 });
    }

    if (!isAdminRole(auth.user.rol) && data.usuarioId !== auth.user.id) {
      return NextResponse.json({ message: "Acceso restringido" }, { status: 403 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    logger({ error: toError(error), module: "getOrderById" });
    return serverError();
  }
}

export async function updateOrderStatus(req: Request, { params }: IRequestParams) {
  try {
    const auth = await requireAdmin();
    if (auth.response) return auth.response;

    const id = await getIdFromParams(params);
    if (!id) {
      return NextResponse.json({ message: aroma.errors.invalidId }, { status: 400 });
    }

    const bodyData = await req.json();
    const validation = updateOrderStatusSchema.safeParse(bodyData);

    if (!validation.success) {
      return NextResponse.json(
        { message: aroma.errors.unprocessableContent },
        { status: 422 }
      );
    }

    const result = await orderContainer.updateOrderStatus.execute({
      id,
      estado: validation.data.estado,
      actualizadoPorId: auth.user.id,
    });

    if (!result.ok) {
      return NextResponse.json({ message: result.error }, { status: result.status });
    }

    return NextResponse.json({ message: "Estado del pedido actualizado correctamente" });
  } catch (error) {
    logger({ error: toError(error), module: "updateOrderStatus" });
    return serverError();
  }
}
