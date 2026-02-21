export default async (request, context) => {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/es") || url.pathname.startsWith("/en")) {
    return;
  }

  const countryCode = context.geo?.country?.code;
  
  // Lista de países de habla hispana (puedes añadir los que quieras)
  const spanishSpeakingCountries = [
    "ES", "MX", "AR", "CO", "CL", "PE", "VE", "EC", "GT", "CU", "BO", "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY"
  ];

  if (spanishSpeakingCountries.includes(countryCode)) {
    return Response.redirect(new URL("/es/", request.url), 302);
  } else {
    return Response.redirect(new URL("/en/", request.url), 302);
  }
};