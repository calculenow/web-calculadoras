export default async (request, context) => {
  const url = new URL(request.url);

  // Si ya tiene idioma, no hacer nada
  if (
    url.pathname.startsWith("/es/") ||
    url.pathname.startsWith("/en/")
  ) {
    return;
  }

  const countryCode = context.geo?.country?.code;

  // En local no hay geo, redirigimos a /es/ por defecto
  if (!countryCode) {
    return Response.redirect(new URL("/es/", request.url), 302);
  }

  const spanishSpeakingCountries = [
    "ES", "MX", "AR", "CO", "CL", "PE", "VE", "EC", "GT", "CU",
    "BO", "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY"
  ];

  if (spanishSpeakingCountries.includes(countryCode)) {
    return Response.redirect(new URL("/es/", request.url), 302);
  } else {
    return Response.redirect(new URL("/en/", request.url), 302);
  }
};