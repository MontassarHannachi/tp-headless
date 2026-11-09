import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const STRAPI_URL = process.env.API_INTERNAL_URL ?? "http://strapi:1337";

const ALLOWED_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "avif",
]);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;

  if (
    !Array.isArray(path) ||
    path.length < 2 ||
    path[0] !== "uploads"
  ) {
    return NextResponse.json(
      { error: "Invalid media path" },
      { status: 400 }
    );
  }

  const filename = path[path.length - 1];
  const extension = filename.split(".").pop()?.toLowerCase();

  if (!extension || !ALLOWED_EXTENSIONS.has(extension)) {
    return NextResponse.json(
      { error: "Unsupported media type" },
      { status: 415 }
    );
  }

  const safePath = path.map(encodeURIComponent).join("/");
  const upstreamUrl = `${STRAPI_URL}/${safePath}`;

  try {
    const upstream = await fetch(upstreamUrl, {
      method: "GET",
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10000),
    });

    if (!upstream.ok) {
      return new NextResponse(null, {
        status: upstream.status === 404 ? 404 : 502,
      });
    }

    const contentType = upstream.headers.get("content-type") ?? "";

    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid upstream content type" },
        { status: 415 }
      );
    }

    const image = await upstream.arrayBuffer();

    if (image.byteLength > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image too large" },
        { status: 413 }
      );
    }

    return new NextResponse(image, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Media service unavailable" },
      { status: 502 }
    );
  }
}
