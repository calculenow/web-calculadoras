export default async (request, context) => {

  const url = new URL(request.url);
  console.log("PATH:", url.pathname); // <-- añade esto
  // Salir si ya tiene idioma O si es un asset (css, js, imágenes, etc.)
  if (
    url.pathname.startsWith("/es/") || 
    url.pathname.startsWith("/en/") ||
    url.pathname.startsWith("/css/") ||
    url.pathname.startsWith("/js/") ||
    url.pathname.startsWith("/img/") ||
    url.pathname.includes(".") // cualquier archivo con extensión
  ) {
    return;
  }

  const countryCode = context.geo?.country?.code;

  if (!countryCode) {
    return Response.redirect(new URL("/es/", request.url), 302);
  }
  
  const spanishSpeakingCountries = [
    "ES", "MX", "AR", "CO", "CL", "PE", "VE", "EC", "GT", "CU", "BO", "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY"
  ];

  if (spanishSpeakingCountries.includes(countryCode)) {
    return Response.redirect(new URL("/es/", request.url), 301);
  } else {
    return Response.redirect(new URL("/en/", request.url), 301);
  }
};