import {
  responseErrorWithMessage,
  responseSuccessWithData,
} from "@/lib/Response";
import ScrapMethod, { AnimeType } from "@/lib/ScrapMethod";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const params = new URL(req.url);
  const order_by = params.searchParams.get("order_by") ?? "updated";
  const page = params.searchParams.get("page") ?? 1;

  try {
    const data = await ScrapMethod({
      order_by,
      page,
      type: AnimeType.ongoing,
    });

    return NextResponse.json(responseSuccessWithData(data));
  } catch (error) {
    console.log("OnGoing Error: ", error);

    return NextResponse.json(responseErrorWithMessage());
  }
}
