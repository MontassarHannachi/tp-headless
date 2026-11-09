import { forwardToStrapi } from "../_lib/strapi";

export async function POST(request: Request) {
  return forwardToStrapi(request, "/api/orders/checkout");
}
