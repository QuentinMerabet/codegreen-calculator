export function buildApiUrl(address, endBlock) {
  const apiKey = "X2BBEZYNQQCBH7QM1PZ69EFRSGUE3SQBZ6";

  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=${endBlock}&sort=desc&apikey=${apiKey}`;
  return url;
}
