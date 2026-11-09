import { forwardToStrapi } from "../_lib/strapi";

export async function POST(request: Request) {
  return forwardToStrapi(request, "/api/contact-messages/submit");
}
