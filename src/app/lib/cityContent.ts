export async function fetchCityContent(slug: string) {
  console.log(`fetchCityContent - Fetching content for slug: ${slug}`);
  
  const apiUrl = `${process.env.NEXT_PUBLIC_ADMIN_BASE_URL || 'http://localhost:3000'}/api/cms/cities/${slug}`;
  console.log(`fetchCityContent - API URL: ${apiUrl}`);
  
  const res = await fetch(apiUrl, {
    cache: 'no-store'
  });
  
  console.log(`fetchCityContent - Response status: ${res.status}`);
  
  if (!res.ok) {
    console.log(`fetchCityContent - API call failed with status: ${res.status}`);
    return { hero: null, about: null, contact: null, tripOptions: null, brands: null, faq: null, tripHighlights: null, header: null, reviews: null, usp: null, groupCta: null }
  }
  
  const data = await res.json();
  console.log(`fetchCityContent - Received data:`, data);
  
  return data;
}



