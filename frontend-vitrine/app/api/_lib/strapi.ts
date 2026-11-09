export async function forwardToStrapi(request: Request, endpoint: string) {
  const baseUrl = process.env.API_INTERNAL_URL;
  const secret = process.env.STORE_API_SECRET;

  if (!baseUrl || !secret) {
    return Response.json(
      { error: { message: "Configuration serveur incomplète." } },
      { status: 500 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: { message: "Requête JSON invalide." } },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json(
      { error: { message: "Données invalides." } },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-store-secret": secret,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    let payload: unknown;

    try {
      payload = await upstream.json();
    } catch {
      payload = {
        error: {
          message: upstream.ok
            ? "Réponse invalide du serveur."
            : "Le serveur n'a pas pu traiter la demande.",
        },
      };
    }

    return Response.json(payload, { status: upstream.status });
  } catch {
    return Response.json(
      { error: { message: "Impossible de contacter le serveur. Réessayez." } },
      { status: 502 }
    );
  }
}
