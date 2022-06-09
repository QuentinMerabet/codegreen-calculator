export function coolNumber(n) {
  function round(n, dec = 0) {
    return Math.round(n * 10 ** dec) / 10 ** dec;
  }
  if (n < 10) {
    // Units
    return round(n, 2);
  } else if (n < 100) {
    // Units
    return round(n, 1);
  } else if (n < 1_000) {
    // Units
    return round(n);
  } else if (n < 1_000_000) {
    // Thousands
    return round(n / 1_000, 1) + "K";
  } else if (n < 1_000_000_000) {
    // Millions
    return round(n / 1_000_000, 2) + "M";
  } else {
    // Billions
    return round(n / 1_000_000_000, 2) + "B";
  }
}
