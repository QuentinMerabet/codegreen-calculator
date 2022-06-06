export function buildApiUrl(request, address, endBlock = 99999999) {
  const apiKey = "X2BBEZYNQQCBH7QM1PZ69EFRSGUE3SQBZ6";

  switch (request) {
    case "txlist":
      return `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=${endBlock}&sort=desc&apikey=${apiKey}`;

    case "totalsupply":
      return `https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${address}&apikey=${apiKey}`;
  }
}
