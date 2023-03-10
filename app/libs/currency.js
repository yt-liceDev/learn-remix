export function formatCurrenty(money) {
  const options = {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }

  return new Intl.NumberFormat("id", options).format(money)
}
