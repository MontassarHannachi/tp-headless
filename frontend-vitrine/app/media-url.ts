export function mediaUrl(value?: string | null): string {
  if (!value) return "";

  let pathname: string;

  try {
    pathname = new URL(value, "http://strapi.internal").pathname;
  } catch {
    return "";
  }

  if (!pathname.startsWith("/uploads/")) {
    return "";
  }

  const safePath = pathname
    .split("/")
    .map((part) => encodeURIComponent(decodeURIComponent(part)))
    .join("/");

  return `/api/media${safePath}`;
}
