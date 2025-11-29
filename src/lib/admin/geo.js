export function formatLocationFromIpApi(j) {
  const city = String((j && j.city) || '').trim();
  const region = String((j && (j.region || j.region_code)) || '').trim();
  const country = String((j && (j.country_name || j.country)) || '').trim();
  return [city, region, country].filter(Boolean).join(', ');
}
