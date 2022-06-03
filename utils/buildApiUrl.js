export function buildApiUrl(address, count) {
  const apiKey = "X2BBEZYNQQCBH7QM1PZ69EFRSGUE3SQBZ6";
  const maxResult = 10_000;

  const url = `https://api.etherscan.io/api?module=account&action=txlist&page=${count}&offset=${maxResult}&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
  return url;
}
