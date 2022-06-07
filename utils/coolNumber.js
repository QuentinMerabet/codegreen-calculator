export function coolNumber(n) {
  if (n < 1_000) {
    return Math.round(n);
  } else if (n < 1_000_000) {
    return Math.round(n / 1_000) + "K";
  } else {
    return Math.round(n / 1_000_000) + "M";
  }
}