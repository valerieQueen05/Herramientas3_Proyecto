import { aroma } from "@/src/utils/location";
import { NextResponse } from "next/server";
import { logger } from "@/src/commons/utils/logger";
import { dashboardContainer } from "../dashboard.container";

// catch() gives `unknown`; logger expects string | Error
const toError = (error: unknown) => error instanceof Error ? error : String(error);

export async function getDashboard() {
  try {
    const data = await dashboardContainer.getResumen.execute();

    if (!data)
      return NextResponse.json({ message: aroma.errors.serverError }, { status: 500 });

    return NextResponse.json({ data });
  } catch (error) {
    logger({ error: toError(error), module: "getDashboard" });
    return NextResponse.json({ message: aroma.errors.serverError }, { status: 500 });
  }
}
