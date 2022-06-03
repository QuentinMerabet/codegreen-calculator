export async function fetchJSON(url) {
  console.log("fetching", url);
  const res = await fetch(url);
  if (!res.ok) {
    const json = await res.json();
    throw json;
  }
  const data = await res.json();
  console.log("fetch over!");
  return data;
}
