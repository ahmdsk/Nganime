import {
  responseSuccessWithData,
  responseErrorWithMessage,
} from "@/lib/Response";
import ScrapMethod, { AnimeType } from "@/lib/ScrapMethod";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const params = new URL(req.url);
  const order_by = params.searchParams.get("order_by") ?? "updated";
  const page = params.searchParams.get("page") ?? 1;
  const query = params.searchParams.get("q")?.replaceAll(" ", "+") ?? "";

  try {
    const data = await ScrapMethod({
      order_by,
      page,
      type: AnimeType.search,
      query,
    });

    return NextResponse.json(responseSuccessWithData(data));
  } catch (error) {
    console.log("Search Error: ", error);

    return NextResponse.json(responseErrorWithMessage());
  }
}
